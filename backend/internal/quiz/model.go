package quiz

import (
	"time"
)

type QuizStatus string

const (
	StatusDraft     QuizStatus = "draft"
	StatusApproved  QuizStatus = "approved"
	StatusPublished QuizStatus = "published"
)

type GeneratedBy string

const (
	GeneratedByManual GeneratedBy = "manual"
	GeneratedByAI     GeneratedBy = "ai"
)

type Quiz struct {
	ID          string     `json:"id"`
	QuizDate    string     `json:"quiz_date"` // YYYY-MM-DD
	Title       string     `json:"title"`
	Status      QuizStatus `json:"status"`
	GeneratedBy GeneratedBy`json:"generated_by"`
	PublishedAt *time.Time `json:"published_at,omitempty"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	Questions   []Question `json:"questions,omitempty"`
}

type Question struct {
	ID           string    `json:"id"`
	QuizID       string    `json:"quiz_id"`
	QuestionText string    `json:"question_text"`
	OptionA      string    `json:"option_a"`
	OptionB      string    `json:"option_b"`
	OptionC      string    `json:"option_c"`
	OptionD      string    `json:"option_d"`
	CorrectOption string   `json:"correct_option,omitempty"` // Omitted in public GET quiz requests
	Explanation  string    `json:"explanation,omitempty"`  // Omitted in public GET quiz requests
	Category     string    `json:"category"`
	SourceName   string    `json:"source_name"`
	SourceURL    string    `json:"source_url"`
	SourceDate   *string   `json:"source_date,omitempty"`
	DisplayOrder int       `json:"display_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

// Public representations (where answers/explanations are concealed)
type PublicQuizResponse struct {
	ID        string           `json:"id"`
	QuizDate  string           `json:"quiz_date"`
	Title     string           `json:"title"`
	Questions []PublicQuestion `json:"questions"`
}

type PublicQuestion struct {
	ID           string `json:"id"`
	QuestionText string `json:"question_text"`
	OptionA      string `json:"option_a"`
	OptionB      string `json:"option_b"`
	OptionC      string `json:"option_c"`
	OptionD      string `json:"option_d"`
	Category     string `json:"category"`
	DisplayOrder int    `json:"display_order"`
}

// Submission DTOs
type QuizSubmissionRequest struct {
	GuestID string            `json:"guest_id"`
	Answers []QuestionAnswer  `json:"answers" binding:"required,len=3"`
}

type QuestionAnswer struct {
	QuestionID     string `json:"question_id" binding:"required"`
	SelectedOption string `json:"selected_option" binding:"required,oneof=A B C D"`
}

type QuizAttemptResult struct {
	AttemptID   string              `json:"attempt_id"`
	QuizID      string              `json:"quiz_id"`
	QuizDate    string              `json:"quiz_date"`
	Title       string              `json:"title"`
	Score       int                 `json:"score"`
	Total       int                 `json:"total"`
	ResultMessage string            `json:"result_message"`
	Answers     []DetailedAnswer `json:"answers"`
}

type DetailedAnswer struct {
	QuestionID     string  `json:"question_id"`
	QuestionText   string  `json:"question_text"`
	OptionA        string  `json:"option_a"`
	OptionB        string  `json:"option_b"`
	OptionC        string  `json:"option_c"`
	OptionD        string  `json:"option_d"`
	SelectedOption string  `json:"selected_option"`
	CorrectOption  string  `json:"correct_option"`
	IsCorrect      bool    `json:"is_correct"`
	Explanation    string  `json:"explanation"`
	Category       string  `json:"category"`
	SourceName     string  `json:"source_name"`
	SourceURL      string  `json:"source_url"`
	SourceDate     *string `json:"source_date,omitempty"`
	DisplayOrder   int     `json:"display_order"`
}

// Admin DTOs
type CreateQuizRequest struct {
	QuizDate  string               `json:"quiz_date" binding:"required"`
	Title     string               `json:"title" binding:"required"`
	Questions []CreateQuestionDTO  `json:"questions" binding:"required,len=3"`
}

type CreateQuestionDTO struct {
	QuestionText  string  `json:"question_text" binding:"required"`
	OptionA       string  `json:"option_a" binding:"required"`
	OptionB       string  `json:"option_b" binding:"required"`
	OptionC       string  `json:"option_c" binding:"required"`
	OptionD       string  `json:"option_d" binding:"required"`
	CorrectOption string  `json:"correct_option" binding:"required,oneof=A B C D"`
	Explanation   string  `json:"explanation" binding:"required"`
	Category      string  `json:"category" binding:"required"`
	SourceName    string  `json:"source_name" binding:"required"`
	SourceURL     string  `json:"source_url" binding:"required"`
	SourceDate    *string `json:"source_date"`
	DisplayOrder  int     `json:"display_order" binding:"required,min=1,max=3"`
}

type AdminDashboardStats struct {
	TodayQuizStatus   string `json:"today_quiz_status"`
	TotalPublished    int    `json:"total_published"`
	TotalAttempts     int    `json:"total_attempts"`
	AverageScore      float64`json:"average_score"`
	RecentQuizzes     []Quiz `json:"recent_quizzes"`
}
