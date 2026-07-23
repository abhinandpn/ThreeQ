package quiz

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository interface {
	GetTodayPublishedQuiz(ctx context.Context) (*Quiz, error)
	GetPublishedQuizByDate(ctx context.Context, date string) (*Quiz, error)
	GetQuizByID(ctx context.Context, id string) (*Quiz, error)
	ListPublishedQuizzes(ctx context.Context, limit, offset int) ([]Quiz, int, error)
	ListAllQuizzes(ctx context.Context, status string, limit, offset int) ([]Quiz, int, error)
	CreateQuiz(ctx context.Context, quiz *Quiz) error
	UpdateQuiz(ctx context.Context, quiz *Quiz) error
	DeleteDraftQuiz(ctx context.Context, id string) error
	UpdateQuizStatus(ctx context.Context, id string, status QuizStatus) error
	SaveAttempt(ctx context.Context, attemptID, quizID, guestID, userAgent string, score int, answers []QuestionAnswer, questionMap map[string]Question) error
	GetAttemptResult(ctx context.Context, attemptID string) (*QuizAttemptResult, error)
	GetDashboardStats(ctx context.Context) (*AdminDashboardStats, error)
}

type repository struct {
	pool *pgxpool.Pool
}

func NewRepository(pool *pgxpool.Pool) Repository {
	return &repository{pool: pool}
}

func (r *repository) GetTodayPublishedQuiz(ctx context.Context) (*Quiz, error) {
	// Asia/Kolkata date format YYYY-MM-DD
	location, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(location).Format("2006-01-02")

	// Try fetching published quiz for today first
	q, err := r.GetPublishedQuizByDate(ctx, today)
	if err == nil {
		return q, nil
	}

	// Fallback to the latest published quiz if today's quiz isn't published yet
	var latestDate string
	fallbackQuery := `SELECT quiz_date FROM quizzes WHERE status = 'published' ORDER BY quiz_date DESC LIMIT 1`
	err = r.pool.QueryRow(ctx, fallbackQuery).Scan(&latestDate)
	if err != nil {
		return nil, errors.New("no published quiz found")
	}

	return r.GetPublishedQuizByDate(ctx, latestDate)
}

func (r *repository) GetPublishedQuizByDate(ctx context.Context, date string) (*Quiz, error) {
	query := `
		SELECT id, quiz_date, title, status, generated_by, published_at, created_at, updated_at
		FROM quizzes
		WHERE quiz_date = $1 AND status = 'published'
	`
	var q Quiz
	var publishedAt sql.NullTime
	var quizDate time.Time

	err := r.pool.QueryRow(ctx, query, date).Scan(
		&q.ID, &quizDate, &q.Title, &q.Status, &q.GeneratedBy, &publishedAt, &q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("quiz not found for date %s: %w", date, err)
	}
	q.QuizDate = quizDate.Format("2006-01-02")
	if publishedAt.Valid {
		q.PublishedAt = &publishedAt.Time
	}

	questions, err := r.getQuestionsByQuizID(ctx, q.ID, false)
	if err != nil {
		return nil, err
	}
	q.Questions = questions

	return &q, nil
}

func (r *repository) GetQuizByID(ctx context.Context, id string) (*Quiz, error) {
	query := `
		SELECT id, quiz_date, title, status, generated_by, published_at, created_at, updated_at
		FROM quizzes
		WHERE id = $1
	`
	var q Quiz
	var publishedAt sql.NullTime
	var quizDate time.Time

	err := r.pool.QueryRow(ctx, query, id).Scan(
		&q.ID, &quizDate, &q.Title, &q.Status, &q.GeneratedBy, &publishedAt, &q.CreatedAt, &q.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("quiz not found with id %s: %w", id, err)
	}
	q.QuizDate = quizDate.Format("2006-01-02")
	if publishedAt.Valid {
		q.PublishedAt = &publishedAt.Time
	}

	questions, err := r.getQuestionsByQuizID(ctx, q.ID, true)
	if err != nil {
		return nil, err
	}
	q.Questions = questions

	return &q, nil
}

func (r *repository) getQuestionsByQuizID(ctx context.Context, quizID string, includeAnswers bool) ([]Question, error) {
	query := `
		SELECT id, quiz_id, question_text, option_a, option_b, option_c, option_d,
		       correct_option, explanation, category, source_name, source_url, source_date, display_order, created_at, updated_at
		FROM questions
		WHERE quiz_id = $1
		ORDER BY display_order ASC
	`
	rows, err := r.pool.Query(ctx, query, quizID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch questions: %w", err)
	}
	defer rows.Close()

	var questions []Question
	for rows.Next() {
		var q Question
		var srcDate sql.NullTime
		err := rows.Scan(
			&q.ID, &q.QuizID, &q.QuestionText, &q.OptionA, &q.OptionB, &q.OptionC, &q.OptionD,
			&q.CorrectOption, &q.Explanation, &q.Category, &q.SourceName, &q.SourceURL, &srcDate, &q.DisplayOrder, &q.CreatedAt, &q.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed scanning question: %w", err)
		}
		if srcDate.Valid {
			formattedDate := srcDate.Time.Format("2006-01-02")
			q.SourceDate = &formattedDate
		}

		if !includeAnswers {
			q.CorrectOption = ""
			q.Explanation = ""
		}

		questions = append(questions, q)
	}

	return questions, nil
}

func (r *repository) ListPublishedQuizzes(ctx context.Context, limit, offset int) ([]Quiz, int, error) {
	var total int
	countErr := r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM quizzes WHERE status = 'published'").Scan(&total)
	if countErr != nil {
		return nil, 0, countErr
	}

	query := `
		SELECT id, quiz_date, title, status, generated_by, published_at, created_at, updated_at
		FROM quizzes
		WHERE status = 'published'
		ORDER BY quiz_date DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.pool.Query(ctx, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var quizzes []Quiz
	for rows.Next() {
		var q Quiz
		var publishedAt sql.NullTime
		var quizDate time.Time
		if err := rows.Scan(&q.ID, &quizDate, &q.Title, &q.Status, &q.GeneratedBy, &publishedAt, &q.CreatedAt, &q.UpdatedAt); err != nil {
			return nil, 0, err
		}
		q.QuizDate = quizDate.Format("2006-01-02")
		if publishedAt.Valid {
			q.PublishedAt = &publishedAt.Time
		}
		quizzes = append(quizzes, q)
	}

	return quizzes, total, nil
}

func (r *repository) ListAllQuizzes(ctx context.Context, status string, limit, offset int) ([]Quiz, int, error) {
	countQuery := "SELECT COUNT(*) FROM quizzes"
	listQuery := `
		SELECT id, quiz_date, title, status, generated_by, published_at, created_at, updated_at
		FROM quizzes
	`
	args := []interface{}{}

	if status != "" {
		countQuery += " WHERE status = $1"
		listQuery += " WHERE status = $1"
		args = append(args, status)
		listQuery += " ORDER BY quiz_date DESC LIMIT $2 OFFSET $3"
		args = append(args, limit, offset)
	} else {
		listQuery += " ORDER BY quiz_date DESC LIMIT $1 OFFSET $2"
		args = append(args, limit, offset)
	}

	var total int
	var err error
	if status != "" {
		err = r.pool.QueryRow(ctx, countQuery, status).Scan(&total)
	} else {
		err = r.pool.QueryRow(ctx, countQuery).Scan(&total)
	}
	if err != nil {
		return nil, 0, err
	}

	rows, err := r.pool.Query(ctx, listQuery, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var quizzes []Quiz
	for rows.Next() {
		var q Quiz
		var publishedAt sql.NullTime
		var quizDate time.Time
		if err := rows.Scan(&q.ID, &quizDate, &q.Title, &q.Status, &q.GeneratedBy, &publishedAt, &q.CreatedAt, &q.UpdatedAt); err != nil {
			return nil, 0, err
		}
		q.QuizDate = quizDate.Format("2006-01-02")
		if publishedAt.Valid {
			q.PublishedAt = &publishedAt.Time
		}
		quizzes = append(quizzes, q)
	}

	return quizzes, total, nil
}

func (r *repository) CreateQuiz(ctx context.Context, quiz *Quiz) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	quizQuery := `
		INSERT INTO quizzes (quiz_date, title, status, generated_by, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	err = tx.QueryRow(ctx, quizQuery, quiz.QuizDate, quiz.Title, quiz.Status, quiz.GeneratedBy).Scan(
		&quiz.ID, &quiz.CreatedAt, &quiz.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("failed to insert quiz: %w", err)
	}

	questionQuery := `
		INSERT INTO questions (
			quiz_id, question_text, option_a, option_b, option_c, option_d,
			correct_option, explanation, category, source_name, source_url, source_date, display_order, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	for i := range quiz.Questions {
		q := &quiz.Questions[i]
		q.QuizID = quiz.ID
		var srcDate *time.Time
		if q.SourceDate != nil && *q.SourceDate != "" {
			t, err := time.Parse("2006-01-02", *q.SourceDate)
			if err == nil {
				srcDate = &t
			}
		}

		err = tx.QueryRow(ctx, questionQuery,
			q.QuizID, q.QuestionText, q.OptionA, q.OptionB, q.OptionC, q.OptionD,
			q.CorrectOption, q.Explanation, q.Category, q.SourceName, q.SourceURL, srcDate, q.DisplayOrder,
		).Scan(&q.ID, &q.CreatedAt, &q.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed inserting question %d: %w", q.DisplayOrder, err)
		}
	}

	return tx.Commit(ctx)
}

func (r *repository) UpdateQuiz(ctx context.Context, quiz *Quiz) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	quizQuery := `
		UPDATE quizzes
		SET quiz_date = $1, title = $2, updated_at = NOW()
		WHERE id = $3
	`
	_, err = tx.Exec(ctx, quizQuery, quiz.QuizDate, quiz.Title, quiz.ID)
	if err != nil {
		return fmt.Errorf("failed to update quiz: %w", err)
	}

	// Delete existing questions and re-insert updated ones
	_, err = tx.Exec(ctx, "DELETE FROM questions WHERE quiz_id = $1", quiz.ID)
	if err != nil {
		return fmt.Errorf("failed deleting old questions: %w", err)
	}

	questionQuery := `
		INSERT INTO questions (
			quiz_id, question_text, option_a, option_b, option_c, option_d,
			correct_option, explanation, category, source_name, source_url, source_date, display_order, created_at, updated_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`

	for i := range quiz.Questions {
		q := &quiz.Questions[i]
		q.QuizID = quiz.ID
		var srcDate *time.Time
		if q.SourceDate != nil && *q.SourceDate != "" {
			t, err := time.Parse("2006-01-02", *q.SourceDate)
			if err == nil {
				srcDate = &t
			}
		}

		err = tx.QueryRow(ctx, questionQuery,
			q.QuizID, q.QuestionText, q.OptionA, q.OptionB, q.OptionC, q.OptionD,
			q.CorrectOption, q.Explanation, q.Category, q.SourceName, q.SourceURL, srcDate, q.DisplayOrder,
		).Scan(&q.ID, &q.CreatedAt, &q.UpdatedAt)
		if err != nil {
			return fmt.Errorf("failed inserting question %d: %w", q.DisplayOrder, err)
		}
	}

	return tx.Commit(ctx)
}

func (r *repository) DeleteDraftQuiz(ctx context.Context, id string) error {
	var status QuizStatus
	err := r.pool.QueryRow(ctx, "SELECT status FROM quizzes WHERE id = $1", id).Scan(&status)
	if err != nil {
		return fmt.Errorf("quiz not found: %w", err)
	}

	if status == StatusPublished {
		return errors.New("cannot delete a published quiz")
	}

	_, err = r.pool.Exec(ctx, "DELETE FROM quizzes WHERE id = $1", id)
	return err
}

func (r *repository) UpdateQuizStatus(ctx context.Context, id string, status QuizStatus) error {
	var publishedAt *time.Time
	if status == StatusPublished {
		now := time.Now()
		publishedAt = &now
	}

	query := `
		UPDATE quizzes
		SET status = $1, published_at = COALESCE($2, published_at), updated_at = NOW()
		WHERE id = $3
	`
	_, err := r.pool.Exec(ctx, query, status, publishedAt, id)
	return err
}

func (r *repository) SaveAttempt(ctx context.Context, attemptID, quizID, guestID, userAgent string, score int, answers []QuestionAnswer, questionMap map[string]Question) error {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to start attempt transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	attemptQuery := `
		INSERT INTO quiz_attempts (id, quiz_id, guest_id, score, started_at, completed_at, user_agent, created_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW(), $5, NOW())
	`
	_, err = tx.Exec(ctx, attemptQuery, attemptID, quizID, guestID, score, userAgent)
	if err != nil {
		return fmt.Errorf("failed to save attempt: %w", err)
	}

	answerQuery := `
		INSERT INTO attempt_answers (attempt_id, question_id, selected_option, is_correct, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`
	for _, ans := range answers {
		q, exists := questionMap[ans.QuestionID]
		if !exists {
			return fmt.Errorf("question %s not found in quiz", ans.QuestionID)
		}
		isCorrect := ans.SelectedOption == q.CorrectOption
		_, err = tx.Exec(ctx, answerQuery, attemptID, ans.QuestionID, ans.SelectedOption, isCorrect)
		if err != nil {
			return fmt.Errorf("failed saving attempt answer: %w", err)
		}
	}

	return tx.Commit(ctx)
}

func (r *repository) GetAttemptResult(ctx context.Context, attemptID string) (*QuizAttemptResult, error) {
	var res QuizAttemptResult
	var quizDate time.Time
	attemptQuery := `
		SELECT a.id, a.quiz_id, q.quiz_date, q.title, a.score
		FROM quiz_attempts a
		JOIN quizzes q ON a.quiz_id = q.id
		WHERE a.id = $1
	`
	err := r.pool.QueryRow(ctx, attemptQuery, attemptID).Scan(
		&res.AttemptID, &res.QuizID, &quizDate, &res.Title, &res.Score,
	)
	if err != nil {
		return nil, fmt.Errorf("attempt not found: %w", err)
	}

	res.QuizDate = quizDate.Format("2006-01-02")

	answersQuery := `
		SELECT q.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
		       ans.selected_option, q.correct_option, ans.is_correct, q.explanation,
			   q.category, q.source_name, q.source_url, q.source_date, q.display_order
		FROM attempt_answers ans
		JOIN questions q ON ans.question_id = q.id
		WHERE ans.attempt_id = $1
		ORDER BY q.display_order ASC
	`
	rows, err := r.pool.Query(ctx, answersQuery, attemptID)
	if err != nil {
		return nil, fmt.Errorf("failed fetching attempt answers: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var da DetailedAnswer
		var srcDate sql.NullTime
		err := rows.Scan(
			&da.QuestionID, &da.QuestionText, &da.OptionA, &da.OptionB, &da.OptionC, &da.OptionD,
			&da.SelectedOption, &da.CorrectOption, &da.IsCorrect, &da.Explanation,
			&da.Category, &da.SourceName, &da.SourceURL, &srcDate, &da.DisplayOrder,
		)
		if err != nil {
			return nil, fmt.Errorf("failed scanning detailed answer: %w", err)
		}
		if srcDate.Valid {
			formatted := srcDate.Time.Format("2006-01-02")
			da.SourceDate = &formatted
		}
		res.Answers = append(res.Answers, da)
	}

	res.Total = len(res.Answers)
	pct := 0.0
	if res.Total > 0 {
		pct = (float64(res.Score) / float64(res.Total)) * 100
	}

	if pct == 100 {
		res.ResultMessage = fmt.Sprintf("Perfect score! You scored %d/%d on today's Kerala and India current affairs.", res.Score, res.Total)
	} else if pct >= 60 {
		res.ResultMessage = fmt.Sprintf("Great effort! You scored %d out of %d. Review the factual explanations below.", res.Score, res.Total)
	} else if pct > 0 {
		res.ResultMessage = fmt.Sprintf("Good attempt! You scored %d out of %d. Learn from the detailed explanations.", res.Score, res.Total)
	} else {
		res.ResultMessage = "Keep practicing! Every day builds stronger knowledge for Kerala PSC and competitive exams."
	}

	return &res, nil
}

func (r *repository) GetDashboardStats(ctx context.Context) (*AdminDashboardStats, error) {
	stats := &AdminDashboardStats{}

	location, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(location).Format("2006-01-02")

	var todayStatus string
	err := r.pool.QueryRow(ctx, "SELECT status FROM quizzes WHERE quiz_date = $1", today).Scan(&todayStatus)
	if err != nil {
		stats.TodayQuizStatus = "Not Generated"
	} else {
		stats.TodayQuizStatus = todayStatus
	}

	_ = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM quizzes WHERE status = 'published'").Scan(&stats.TotalPublished)
	_ = r.pool.QueryRow(ctx, "SELECT COUNT(*) FROM quiz_attempts").Scan(&stats.TotalAttempts)
	_ = r.pool.QueryRow(ctx, "SELECT COALESCE(AVG(score), 0) FROM quiz_attempts").Scan(&stats.AverageScore)

	recentQuizzes, _, _ := r.ListAllQuizzes(ctx, "", 5, 0)
	stats.RecentQuizzes = recentQuizzes

	return stats, nil
}
