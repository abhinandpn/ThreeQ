package quiz

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
)

type memoryRepository struct {
	mu       sync.RWMutex
	quizzes  map[string]*Quiz
	attempts map[string]*QuizAttemptResult
}

func NewMemoryRepository() Repository {
	repo := &memoryRepository{
		quizzes:  make(map[string]*Quiz),
		attempts: make(map[string]*QuizAttemptResult),
	}

	repo.seedDefaultQuizzes()
	return repo
}

func (r *memoryRepository) seedDefaultQuizzes() {
	location, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(location)
	todayStr := now.Format("2006-01-02")
	yesterdayStr := now.AddDate(0, 0, -1).Format("2006-01-02")
	dayBeforeStr := now.AddDate(0, 0, -2).Format("2006-01-02")

	publishedAt := now

	// Today's Seed Quiz
	q1ID := uuid.New().String()
	q1 := &Quiz{
		ID:          q1ID,
		QuizDate:    todayStr,
		Title:       fmt.Sprintf("Daily Current Affairs - %s", todayStr),
		Status:      StatusPublished,
		GeneratedBy: "ai",
		PublishedAt: &publishedAt,
		CreatedAt:   now,
		UpdatedAt:   now,
		Questions: []Question{
			{
				ID:            uuid.New().String(),
				QuizID:        q1ID,
				Category:      "Kerala Current Affairs",
				QuestionText:  "Which Kerala port recently handled its largest container vessel, setting a new maritime milestone?",
				OptionA:       "Cochin Port",
				OptionB:       "Vizhinjam International Transhipment Deepwater Multipurpose Seaport",
				OptionC:       "Kollam Port",
				OptionD:       "Beypore Port",
				CorrectOption: "B",
				Explanation:   "Vizhinjam Seaport in Thiruvananthapuram successfully docked large mother container vessels, marking a landmark in India's transhipment hub capabilities.",
				SourceName:    "The Hindu",
				SourceURL:     "https://www.thehindu.com",
				DisplayOrder:  1,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q1ID,
				Category:      "India National Affairs",
				QuestionText:  "Which Indian state launched the 'Digital Habitat Initiative' to enhance rural broadband access?",
				OptionA:       "Karnataka",
				OptionB:       "Tamil Nadu",
				OptionC:       "Kerala",
				OptionD:       "Telangana",
				CorrectOption: "C",
				Explanation:   "Kerala's K-FON project continues its digital habitat initiative, connecting high schools, panchayats, and economically disadvantaged households to high-speed internet.",
				SourceName:    "Press Information Bureau",
				SourceURL:     "https://pib.gov.in",
				DisplayOrder:  2,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q1ID,
				Category:      "Science & Environment",
				QuestionText:  "What is the primary target orbit for India's upcoming Chandrayaan-4 lunar sample return mission?",
				OptionA:       "Geostationary Transfer Orbit",
				OptionB:       "Lunar South Pole Polar Orbit",
				OptionC:       "Low Earth Orbit",
				OptionD:       "Sun-Synchronous Orbit",
				CorrectOption: "B",
				Explanation:   "ISRO's Chandrayaan-4 mission aims to land near the lunar south pole, collect surface samples, and launch them back to Earth.",
				SourceName:    "ISRO Official",
				SourceURL:     "https://www.isro.gov.in",
				DisplayOrder:  3,
			},
		},
	}
	r.quizzes[q1.ID] = q1

	// Yesterday's Seed Quiz
	q2ID := uuid.New().String()
	q2 := &Quiz{
		ID:          q2ID,
		QuizDate:    yesterdayStr,
		Title:       fmt.Sprintf("Daily Current Affairs - %s", yesterdayStr),
		Status:      StatusPublished,
		GeneratedBy: "ai",
		PublishedAt: &publishedAt,
		CreatedAt:   now.AddDate(0, 0, -1),
		UpdatedAt:   now.AddDate(0, 0, -1),
		Questions: []Question{
			{
				ID:            uuid.New().String(),
				QuizID:        q2ID,
				Category:      "Kerala Current Affairs",
				QuestionText:  "Who was awarded the prestigious Kerala Jyothi award for lifetime contributions to literature?",
				OptionA:       "M. T. Vasudevan Nair",
				OptionB:       "T. Padmanabhan",
				OptionC:       "Azoor Madhavan",
				OptionD:       "K. Satchidanandan",
				CorrectOption: "B",
				Explanation:   "Eminent writer T. Padmanabhan was selected for the highest state civilian honor, the Kerala Jyothi award.",
				SourceName:    "Mathrubhumi",
				SourceURL:     "https://mathrubhumi.com",
				DisplayOrder:  1,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q2ID,
				Category:      "India National Affairs",
				QuestionText:  "Which city hosts the 2026 National Youth Festival in India?",
				OptionA:       "Kochi",
				OptionB:       "Bhopal",
				OptionC:       "Jaipur",
				OptionD:       "Lucknow",
				CorrectOption: "A",
				Explanation:   "Kochi was chosen to host the National Youth Festival celebrating youth empowerment and cultural heritage.",
				SourceName:    "PIB India",
				SourceURL:     "https://pib.gov.in",
				DisplayOrder:  2,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q2ID,
				Category:      "Economy & Banking",
				QuestionText:  "What is the key benchmark interest rate maintained by the Reserve Bank of India (RBI)?",
				OptionA:       "Reverse Repo Rate",
				OptionB:       "Repo Rate",
				OptionC:       "Bank Rate",
				OptionD:       "SDR Rate",
				CorrectOption: "B",
				Explanation:   "The Repo Rate is the rate at which the RBI lends money to commercial banks and serves as India's primary monetary policy benchmark.",
				SourceName:    "Reserve Bank of India",
				SourceURL:     "https://rbi.org.in",
				DisplayOrder:  3,
			},
		},
	}
	r.quizzes[q2.ID] = q2

	// Day Before Yesterday's Seed Quiz
	q3ID := uuid.New().String()
	q3 := &Quiz{
		ID:          q3ID,
		QuizDate:    dayBeforeStr,
		Title:       fmt.Sprintf("Daily Current Affairs - %s", dayBeforeStr),
		Status:      StatusPublished,
		GeneratedBy: "manual",
		PublishedAt: &publishedAt,
		CreatedAt:   now.AddDate(0, 0, -2),
		UpdatedAt:   now.AddDate(0, 0, -2),
		Questions: []Question{
			{
				ID:            uuid.New().String(),
				QuizID:        q3ID,
				Category:      "Kerala Current Affairs",
				QuestionText:  "Which Kerala sanctuary was declared a plastic-free eco-sensitive zone?",
				OptionA:       "Periyar Tiger Reserve",
				OptionB:       "Wayanad Wildlife Sanctuary",
				OptionC:       "Silent Valley National Park",
				OptionD:       "Eravikulam National Park",
				CorrectOption: "A",
				Explanation:   "Periyar Tiger Reserve enforced strict single-use plastic prohibition guidelines across all tourist zones.",
				SourceName:    "Forest Department Kerala",
				SourceURL:     "https://forest.kerala.gov.in",
				DisplayOrder:  1,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q3ID,
				Category:      "Sports & Culture",
				QuestionText:  "Who won the National Badminton Championship Senior Men's Singles title?",
				OptionA:       "Lakshya Sen",
				OptionB:       "P. V. Sindhu",
				OptionC:       "H. S. Prannoy",
				OptionD:       "Chirag Shetty",
				CorrectOption: "C",
				Explanation:   "Kerala's H. S. Prannoy secured the national singles championship title with a straight-set victory.",
				SourceName:    "Times of India",
				SourceURL:     "https://timesofindia.indiatimes.com",
				DisplayOrder:  2,
			},
			{
				ID:            uuid.New().String(),
				QuizID:        q3ID,
				Category:      "India National Affairs",
				QuestionText:  "Which Constitutional Article guarantees the Right to Equality before Law in India?",
				OptionA:       "Article 14",
				OptionB:       "Article 19",
				OptionC:       "Article 21",
				OptionD:       "Article 32",
				CorrectOption: "A",
				Explanation:   "Article 14 of the Indian Constitution ensures equality before the law and equal protection of laws within India.",
				SourceName:    "Ministry of Law",
				SourceURL:     "https://lawmin.gov.in",
				DisplayOrder:  3,
			},
		},
	}
	r.quizzes[q3.ID] = q3
}

func (r *memoryRepository) GetTodayPublishedQuiz(ctx context.Context) (*Quiz, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	location, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(location).Format("2006-01-02")

	for _, q := range r.quizzes {
		if q.Status == StatusPublished && q.QuizDate == today {
			return q, nil
		}
	}

	// Fallback to latest published
	var latest *Quiz
	for _, q := range r.quizzes {
		if q.Status == StatusPublished {
			if latest == nil || q.QuizDate > latest.QuizDate {
				latest = q
			}
		}
	}

	if latest != nil {
		return latest, nil
	}
	return nil, errors.New("no published quiz found")
}

func (r *memoryRepository) GetPublishedQuizByDate(ctx context.Context, date string) (*Quiz, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, q := range r.quizzes {
		if q.QuizDate == date && q.Status == StatusPublished {
			return q, nil
		}
	}
	return nil, errors.New("quiz not found for date")
}

func (r *memoryRepository) GetQuizByID(ctx context.Context, id string) (*Quiz, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if q, ok := r.quizzes[id]; ok {
		return q, nil
	}
	return nil, errors.New("quiz not found")
}

func (r *memoryRepository) ListPublishedQuizzes(ctx context.Context, limit, offset int) ([]Quiz, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var published []Quiz
	for _, q := range r.quizzes {
		if q.Status == StatusPublished {
			published = append(published, *q)
		}
	}

	total := len(published)
	if offset >= total {
		return []Quiz{}, total, nil
	}

	end := offset + limit
	if end > total {
		end = total
	}

	return published[offset:end], total, nil
}

func (r *memoryRepository) ListAllQuizzes(ctx context.Context, status string, limit, offset int) ([]Quiz, int, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var filtered []Quiz
	for _, q := range r.quizzes {
		if status == "" || string(q.Status) == status {
			filtered = append(filtered, *q)
		}
	}

	total := len(filtered)
	if offset >= total {
		return []Quiz{}, total, nil
	}

	end := offset + limit
	if end > total {
		end = total
	}

	return filtered[offset:end], total, nil
}

func (r *memoryRepository) CreateQuiz(ctx context.Context, quiz *Quiz) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if quiz.ID == "" {
		quiz.ID = uuid.New().String()
	}
	for i := range quiz.Questions {
		if quiz.Questions[i].ID == "" {
			quiz.Questions[i].ID = uuid.New().String()
		}
		quiz.Questions[i].QuizID = quiz.ID
	}

	r.quizzes[quiz.ID] = quiz
	return nil
}

func (r *memoryRepository) UpdateQuiz(ctx context.Context, quiz *Quiz) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.quizzes[quiz.ID]; !ok {
		return errors.New("quiz not found")
	}
	r.quizzes[quiz.ID] = quiz
	return nil
}

func (r *memoryRepository) DeleteDraftQuiz(ctx context.Context, id string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	q, ok := r.quizzes[id]
	if !ok {
		return errors.New("quiz not found")
	}
	if q.Status == StatusPublished {
		return errors.New("cannot delete published quiz")
	}

	delete(r.quizzes, id)
	return nil
}

func (r *memoryRepository) UpdateQuizStatus(ctx context.Context, id string, status QuizStatus) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	q, ok := r.quizzes[id]
	if !ok {
		return errors.New("quiz not found")
	}

	q.Status = status
	if status == StatusPublished {
		now := time.Now()
		q.PublishedAt = &now
	}
	q.UpdatedAt = time.Now()
	return nil
}

func (r *memoryRepository) SaveAttempt(ctx context.Context, attemptID, quizID, guestID, userAgent string, score int, answers []QuestionAnswer, questionMap map[string]Question) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	quiz, ok := r.quizzes[quizID]
	if !ok {
		return errors.New("quiz not found")
	}

	var detailedAnswers []DetailedAnswer
	for _, a := range answers {
		q := questionMap[a.QuestionID]
		detailedAnswers = append(detailedAnswers, DetailedAnswer{
			QuestionID:     q.ID,
			DisplayOrder:   q.DisplayOrder,
			Category:       q.Category,
			QuestionText:   q.QuestionText,
			OptionA:        q.OptionA,
			OptionB:        q.OptionB,
			OptionC:        q.OptionC,
			OptionD:        q.OptionD,
			CorrectOption:  q.CorrectOption,
			SelectedOption: a.SelectedOption,
			IsCorrect:      a.SelectedOption == q.CorrectOption,
			Explanation:    q.Explanation,
			SourceName:     q.SourceName,
			SourceURL:      q.SourceURL,
		})
	}

	totalQuestions := len(quiz.Questions)
	if totalQuestions == 0 {
		totalQuestions = len(answers)
	}

	pct := (float64(score) / float64(totalQuestions)) * 100
	var msg string
	if pct == 100 {
		msg = fmt.Sprintf("Perfect score! You scored %d/%d on today's Kerala and India current affairs.", score, totalQuestions)
	} else if pct >= 60 {
		msg = fmt.Sprintf("Great effort! You scored %d out of %d. Review the factual explanations below.", score, totalQuestions)
	} else if pct > 0 {
		msg = fmt.Sprintf("Good attempt! You scored %d out of %d. Learn from the detailed explanations.", score, totalQuestions)
	} else {
		msg = "Keep practicing! Every day builds stronger knowledge for Kerala PSC and competitive exams."
	}

	result := &QuizAttemptResult{
		AttemptID:     attemptID,
		QuizID:        quizID,
		QuizDate:      quiz.QuizDate,
		Title:         quiz.Title,
		Score:         score,
		Total:         totalQuestions,
		ResultMessage: msg,
		Answers:       detailedAnswers,
	}

	r.attempts[attemptID] = result
	return nil
}

func (r *memoryRepository) GetAttemptResult(ctx context.Context, attemptID string) (*QuizAttemptResult, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	if res, ok := r.attempts[attemptID]; ok {
		return res, nil
	}
	return nil, errors.New("attempt result not found")
}

func (r *memoryRepository) GetDashboardStats(ctx context.Context) (*AdminDashboardStats, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	location, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(location).Format("2006-01-02")

	todayStatus := "not_generated"
	var publishedCount int
	var recent []Quiz

	for _, q := range r.quizzes {
		if q.QuizDate == today {
			todayStatus = string(q.Status)
		}
		if q.Status == StatusPublished {
			publishedCount++
		}
		recent = append(recent, *q)
	}

	totalAttempts := len(r.attempts)
	var scoreSum int
	for _, a := range r.attempts {
		scoreSum += a.Score
	}
	avgScore := 0.0
	if totalAttempts > 0 {
		avgScore = float64(scoreSum) / float64(totalAttempts)
	}

	return &AdminDashboardStats{
		TodayQuizStatus: todayStatus,
		TotalPublished:  publishedCount,
		TotalAttempts:   totalAttempts,
		AverageScore:    avgScore,
		RecentQuizzes:   recent,
	}, nil
}
