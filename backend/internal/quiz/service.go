package quiz

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"
)

type Service interface {
	GetTodayQuiz(ctx context.Context) (*PublicQuizResponse, error)
	GetQuizByDate(ctx context.Context, date string) (*PublicQuizResponse, error)
	ListPublishedQuizzes(ctx context.Context, page, pageSize int) ([]Quiz, int, error)
	SubmitQuiz(ctx context.Context, quizID string, req QuizSubmissionRequest, userAgent string) (*QuizAttemptResult, error)
	GetAttemptResult(ctx context.Context, attemptID string) (*QuizAttemptResult, error)
	GetQuizByID(ctx context.Context, id string) (*Quiz, error)
	ListAllQuizzes(ctx context.Context, status string, page, pageSize int) ([]Quiz, int, error)
	CreateQuiz(ctx context.Context, req CreateQuizRequest) (*Quiz, error)
	UpdateQuiz(ctx context.Context, id string, req CreateQuizRequest) (*Quiz, error)
	DeleteDraftQuiz(ctx context.Context, id string) error
	ApproveQuiz(ctx context.Context, id string) error
	PublishQuiz(ctx context.Context, id string) error
	UnpublishQuiz(ctx context.Context, id string) error
	GetDashboardStats(ctx context.Context) (*AdminDashboardStats, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) GetTodayQuiz(ctx context.Context) (*PublicQuizResponse, error) {
	q, err := s.repo.GetTodayPublishedQuiz(ctx)
	if err != nil {
		return nil, err
	}
	return s.toPublicQuizResponse(q), nil
}

func (s *service) GetQuizByDate(ctx context.Context, date string) (*PublicQuizResponse, error) {
	q, err := s.repo.GetPublishedQuizByDate(ctx, date)
	if err != nil {
		return nil, err
	}
	return s.toPublicQuizResponse(q), nil
}

func (s *service) toPublicQuizResponse(q *Quiz) *PublicQuizResponse {
	pubQuestions := make([]PublicQuestion, len(q.Questions))
	for i, question := range q.Questions {
		pubQuestions[i] = PublicQuestion{
			ID:           question.ID,
			QuestionText: question.QuestionText,
			OptionA:      question.OptionA,
			OptionB:      question.OptionB,
			OptionC:      question.OptionC,
			OptionD:      question.OptionD,
			Category:     question.Category,
			DisplayOrder: question.DisplayOrder,
		}
	}

	return &PublicQuizResponse{
		ID:        q.ID,
		QuizDate:  q.QuizDate,
		Title:     q.Title,
		Questions: pubQuestions,
	}
}

func (s *service) ListPublishedQuizzes(ctx context.Context, page, pageSize int) ([]Quiz, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize
	return s.repo.ListPublishedQuizzes(ctx, pageSize, offset)
}

func (s *service) SubmitQuiz(ctx context.Context, quizID string, req QuizSubmissionRequest, userAgent string) (*QuizAttemptResult, error) {
	quiz, err := s.repo.GetQuizByID(ctx, quizID)
	if err != nil {
		return nil, errors.New("quiz not found")
	}

	if quiz.Status != StatusPublished {
		return nil, errors.New("cannot submit answers for unpublished quiz")
	}

	if len(req.Answers) == 0 {
		return nil, errors.New("answers submission cannot be empty")
	}

	// Build map of questions by ID for validation and scoring
	questionMap := make(map[string]Question)
	for _, q := range quiz.Questions {
		questionMap[q.ID] = q
	}

	score := 0
	seen := make(map[string]bool)

	for _, ans := range req.Answers {
		if seen[ans.QuestionID] {
			return nil, errors.New("duplicate answers for the same question are not allowed")
		}
		seen[ans.QuestionID] = true

		q, exists := questionMap[ans.QuestionID]
		if !exists {
			return nil, fmt.Errorf("question ID %s does not belong to quiz", ans.QuestionID)
		}

		if ans.SelectedOption == q.CorrectOption {
			score++
		}
	}

	attemptID := uuid.New().String()
	guestID := req.GuestID
	if guestID == "" {
		guestID = "anonymous"
	}

	err = s.repo.SaveAttempt(ctx, attemptID, quizID, guestID, userAgent, score, req.Answers, questionMap)
	if err != nil {
		return nil, fmt.Errorf("failed saving attempt: %w", err)
	}

	return s.repo.GetAttemptResult(ctx, attemptID)
}

func (s *service) GetAttemptResult(ctx context.Context, attemptID string) (*QuizAttemptResult, error) {
	return s.repo.GetAttemptResult(ctx, attemptID)
}

func (s *service) GetQuizByID(ctx context.Context, id string) (*Quiz, error) {
	return s.repo.GetQuizByID(ctx, id)
}

func (s *service) ListAllQuizzes(ctx context.Context, status string, page, pageSize int) ([]Quiz, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 50 {
		pageSize = 10
	}
	offset := (page - 1) * pageSize
	return s.repo.ListAllQuizzes(ctx, status, pageSize, offset)
}

func (s *service) CreateQuiz(ctx context.Context, req CreateQuizRequest) (*Quiz, error) {
	if len(req.Questions) < 3 {
		return nil, errors.New("quiz must contain at least 3 questions")
	}

	q := &Quiz{
		QuizDate:    req.QuizDate,
		Title:       req.Title,
		Status:      StatusDraft,
		GeneratedBy: GeneratedByManual,
	}

	questions := make([]Question, len(req.Questions))
	for i, qDto := range req.Questions {
		displayOrder := qDto.DisplayOrder
		if displayOrder < 1 {
			displayOrder = i + 1
		}
		difficulty := normalizeDifficulty(qDto.Difficulty)
		questions[i] = Question{
			QuestionText:  qDto.QuestionText,
			OptionA:       qDto.OptionA,
			OptionB:       qDto.OptionB,
			OptionC:       qDto.OptionC,
			OptionD:       qDto.OptionD,
			CorrectOption: qDto.CorrectOption,
			Explanation:   qDto.Explanation,
			Category:      qDto.Category,
			Difficulty:    difficulty,
			SourceName:    qDto.SourceName,
			SourceURL:     qDto.SourceURL,
			SourceDate:    qDto.SourceDate,
			DisplayOrder:  displayOrder,
		}
	}
	q.Questions = questions

	if err := s.repo.CreateQuiz(ctx, q); err != nil {
		return nil, err
	}

	return q, nil
}

func (s *service) UpdateQuiz(ctx context.Context, id string, req CreateQuizRequest) (*Quiz, error) {
	if len(req.Questions) < 3 {
		return nil, errors.New("quiz must contain at least 3 questions")
	}

	existing, err := s.repo.GetQuizByID(ctx, id)
	if err != nil {
		return nil, err
	}

	existing.QuizDate = req.QuizDate
	existing.Title = req.Title

	questions := make([]Question, len(req.Questions))
	for i, qDto := range req.Questions {
		displayOrder := qDto.DisplayOrder
		if displayOrder < 1 {
			displayOrder = i + 1
		}
		difficulty := normalizeDifficulty(qDto.Difficulty)
		questions[i] = Question{
			QuizID:        id,
			QuestionText:  qDto.QuestionText,
			OptionA:       qDto.OptionA,
			OptionB:       qDto.OptionB,
			OptionC:       qDto.OptionC,
			OptionD:       qDto.OptionD,
			CorrectOption: qDto.CorrectOption,
			Explanation:   qDto.Explanation,
			Category:      qDto.Category,
			Difficulty:    difficulty,
			SourceName:    qDto.SourceName,
			SourceURL:     qDto.SourceURL,
			SourceDate:    qDto.SourceDate,
			DisplayOrder:  displayOrder,
		}
	}
	existing.Questions = questions

	if err := s.repo.UpdateQuiz(ctx, existing); err != nil {
		return nil, err
	}

	return existing, nil
}

func normalizeDifficulty(difficulty Difficulty) Difficulty {
	switch difficulty {
	case DifficultySimple, DifficultyMedium, DifficultyHard:
		return difficulty
	default:
		return DifficultyMedium
	}
}

func (s *service) DeleteDraftQuiz(ctx context.Context, id string) error {
	return s.repo.DeleteDraftQuiz(ctx, id)
}

func (s *service) ApproveQuiz(ctx context.Context, id string) error {
	return s.repo.UpdateQuizStatus(ctx, id, StatusApproved)
}

func (s *service) PublishQuiz(ctx context.Context, id string) error {
	return s.repo.UpdateQuizStatus(ctx, id, StatusPublished)
}

func (s *service) UnpublishQuiz(ctx context.Context, id string) error {
	return s.repo.UpdateQuizStatus(ctx, id, StatusApproved)
}

func (s *service) GetDashboardStats(ctx context.Context) (*AdminDashboardStats, error) {
	return s.repo.GetDashboardStats(ctx)
}
