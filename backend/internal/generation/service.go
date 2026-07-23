package generation

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"quiz-keralam-backend/internal/config"
	"quiz-keralam-backend/internal/quiz"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Service interface {
	GenerateDailyQuiz(ctx context.Context, customDate string) (*quiz.Quiz, error)
}

type service struct {
	pool    *pgxpool.Pool
	cfg     *config.Config
	quizSvc quiz.Service
}

func NewService(pool *pgxpool.Pool, cfg *config.Config, quizSvc quiz.Service) Service {
	return &service{
		pool:    pool,
		cfg:     cfg,
		quizSvc: quizSvc,
	}
}

type GeminiRequest struct {
	Contents         []GeminiContent        `json:"contents"`
	SystemInstruction *GeminiContent        `json:"system_instruction,omitempty"`
	GenerationConfig *GeminiGenConfig       `json:"generationConfig,omitempty"`
}

type GeminiContent struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiPart struct {
	Text string `json:"text"`
}

type GeminiGenConfig struct {
	ResponseMimeType string `json:"response_mime_type,omitempty"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

type AIGeneratedQuizPayload struct {
	QuizDate  string `json:"quiz_date"`
	Title     string `json:"title"`
	Questions []struct {
		DisplayOrder  int    `json:"display_order"`
		Category      string `json:"category"`
		QuestionText  string `json:"question_text"`
		Options       struct {
			A string `json:"A"`
			B string `json:"B"`
			C string `json:"C"`
			D string `json:"D"`
		} `json:"options"`
		CorrectOption string `json:"correct_option"`
		Explanation   string `json:"explanation"`
		SourceName    string `json:"source_name"`
		SourceURL     string `json:"source_url"`
		SourceDate    string `json:"source_date"`
	} `json:"questions"`
}

func (s *service) GenerateDailyQuiz(ctx context.Context, customDate string) (*quiz.Quiz, error) {
	location, _ := time.LoadLocation("Asia/Kolkata")
	targetDate := time.Now().In(location).Format("2006-01-02")
	if customDate != "" {
		targetDate = customDate
	}

	log.Printf("[AI-GENERATION] Initiating Gemini Quiz Generation for date: %s", targetDate)

	prompt := fmt.Sprintf(`Generate a 3-question competitive exam daily current affairs quiz for date %s.
Question Distribution:
- Question 1 (display_order 1): Category must be "Kerala Current Affairs". Focus on recent news, achievements, governance, or cultural updates from Kerala.
- Question 2 (display_order 2): Category must be "India Current Affairs". Focus on national governance, policy, economy, or achievements in India.
- Question 3 (display_order 3): Category must be one rotating topic such as "Science & Tech", "Sports", "Environment", "Economy", or "International Affairs".

Requirements:
- Provide exactly 4 options (A, B, C, D) for each question.
- Ensure exactly ONE option is correct.
- Provide a clear factual explanation under 80 words.
- Provide reputable news sources (e.g. The Hindu, PIB, Press Trust of India, Malayala Manorama, Mathrubhumi) with source_name, valid source_url, and source_date (%s).
- Title must be "Daily Current Affairs Quiz - %s".

Return JSON in this EXACT structure:
{
  "quiz_date": "%s",
  "title": "Daily Current Affairs Quiz - %s",
  "questions": [
    {
      "display_order": 1,
      "category": "Kerala Current Affairs",
      "question_text": "...",
      "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
      "correct_option": "A",
      "explanation": "...",
      "source_name": "Press Information Bureau",
      "source_url": "https://pib.gov.in",
      "source_date": "%s"
    },
    ...
  ]
}`, targetDate, targetDate, targetDate, targetDate, targetDate, targetDate)

	rawResponse, err := s.callGeminiAPI(ctx, prompt)
	if err != nil {
		s.logGenerationAttempt(ctx, targetDate, "failed", err.Error(), nil)
		return nil, fmt.Errorf("gemini API call failed: %w", err)
	}

	// Parse JSON output from Gemini
	cleanedJSON := s.cleanJSONString(rawResponse)
	var aiPayload AIGeneratedQuizPayload
	if err := json.Unmarshal([]byte(cleanedJSON), &aiPayload); err != nil {
		s.logGenerationAttempt(ctx, targetDate, "failed", fmt.Sprintf("invalid JSON output: %v", err), rawResponse)
		return nil, fmt.Errorf("failed to parse AI JSON response: %w", err)
	}

	// Validate payload structure
	if len(aiPayload.Questions) != 3 {
		errStr := fmt.Sprintf("expected 3 questions, got %d", len(aiPayload.Questions))
		s.logGenerationAttempt(ctx, targetDate, "failed", errStr, rawResponse)
		return nil, fmt.Errorf(errStr)
	}

	// Construct CreateQuizRequest
	createReq := quiz.CreateQuizRequest{
		QuizDate: targetDate,
		Title:    aiPayload.Title,
	}

	for _, q := range aiPayload.Questions {
		srcDate := q.SourceDate
		createReq.Questions = append(createReq.Questions, quiz.CreateQuestionDTO{
			QuestionText:  q.QuestionText,
			OptionA:       q.Options.A,
			OptionB:       q.Options.B,
			OptionC:       q.Options.C,
			OptionD:       q.Options.D,
			CorrectOption: strings.ToUpper(strings.TrimSpace(q.CorrectOption)),
			Explanation:   q.Explanation,
			Category:      q.Category,
			SourceName:    q.SourceName,
			SourceURL:     q.SourceURL,
			SourceDate:    &srcDate,
			DisplayOrder:  q.DisplayOrder,
		})
	}

	// Save as draft using quiz service
	createdQuiz, err := s.quizSvc.CreateQuiz(ctx, createReq)
	if err != nil {
		s.logGenerationAttempt(ctx, targetDate, "failed", fmt.Sprintf("db creation failed: %v", err), rawResponse)
		return nil, fmt.Errorf("failed saving AI generated draft quiz: %w", err)
	}

	// Update generated_by field to 'ai'
	_, _ = s.pool.Exec(ctx, "UPDATE quizzes SET generated_by = 'ai' WHERE id = $1", createdQuiz.ID)
	createdQuiz.GeneratedBy = quiz.GeneratedByAI

	s.logGenerationAttempt(ctx, targetDate, "success", "Quiz generated as draft successfully", rawResponse)
	log.Printf("[AI-GENERATION] Quiz draft created successfully for date: %s", targetDate)

	return createdQuiz, nil
}

func (s *service) callGeminiAPI(ctx context.Context, prompt string) (string, error) {
	apiKey := s.cfg.GeminiAPIKey
	if apiKey == "" {
		// Fallback sample generation when API key is not configured for local development
		log.Println("[AI-GENERATION] GEMINI_API_KEY missing. Using intelligent current affairs template generator.")
		return s.generateMockFallbackJSON(), nil
	}

	model := s.cfg.GeminiModel
	url := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey)

	reqBody := GeminiRequest{
		SystemInstruction: &GeminiContent{
			Parts: []GeminiPart{{Text: "Generate factual competitive-exam-style multiple-choice questions using only supplied news context. Return valid JSON only."}},
		},
		Contents: []GeminiContent{
			{Parts: []GeminiPart{{Text: prompt}}},
		},
		GenerationConfig: &GeminiGenConfig{
			ResponseMimeType: "application/json",
		},
	}

	jsonBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(jsonBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gemini API returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	var geminiResp GeminiResponse
	if err := json.Unmarshal(bodyBytes, &geminiResp); err != nil {
		return "", err
	}

	if len(geminiResp.Candidates) == 0 || len(geminiResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("empty candidates response from Gemini")
	}

	return geminiResp.Candidates[0].Content.Parts[0].Text, nil
}

func (s *service) cleanJSONString(input string) string {
	cleaned := strings.TrimSpace(input)
	if strings.HasPrefix(cleaned, "```json") {
		cleaned = strings.TrimPrefix(cleaned, "```json")
	}
	if strings.HasPrefix(cleaned, "```") {
		cleaned = strings.TrimPrefix(cleaned, "```")
	}
	if strings.HasSuffix(cleaned, "```") {
		cleaned = strings.TrimSuffix(cleaned, "```")
	}
	return strings.TrimSpace(cleaned)
}

func (s *service) logGenerationAttempt(ctx context.Context, quizDate, status, message string, rawResponse interface{}) {
	var rawJSON []byte
	if rawResponse != nil {
		rawJSON, _ = json.Marshal(rawResponse)
	}

	query := `
		INSERT INTO generation_logs (quiz_date, status, message, raw_ai_response, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`
	_, _ = s.pool.Exec(ctx, query, quizDate, status, message, rawJSON)
}

func (s *service) generateMockFallbackJSON() string {
	location, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(location).Format("2006-01-02")

	return fmt.Sprintf(`{
  "quiz_date": "%s",
  "title": "Daily Current Affairs Quiz - %s",
  "questions": [
    {
      "display_order": 1,
      "category": "Kerala Current Affairs",
      "question_text": "Which Kerala port recently registered a record container handling benchmark following its inaugural commercial Phase-1 operations?",
      "options": {
        "A": "Cochin Port",
        "B": "Vizhinjam International Transshipment Deepwater Multipurpose Seaport",
        "C": "Beypore Port",
        "D": "Kollam Port"
      },
      "correct_option": "B",
      "explanation": "Vizhinjam International Transshipment Seaport near Thiruvananthapuram is India's first deepwater transshipment port.",
      "source_name": "The Hindu",
      "source_url": "https://www.thehindu.com",
      "source_date": "%s"
    },
    {
      "display_order": 2,
      "category": "India Current Affairs",
      "question_text": "Which Indian city hosted the Global Renewable Energy Investment Meet (RE-INVEST)?",
      "options": {
        "A": "Gandhinagar",
        "B": "New Delhi",
        "C": "Bengaluru",
        "D": "Mumbai"
      },
      "correct_option": "A",
      "explanation": "The 4th Global Renewable Energy Investment Meet & Expo (RE-INVEST) was inaugurated in Mahatma Mandir, Gandhinagar, Gujarat.",
      "source_name": "Press Information Bureau (PIB)",
      "source_url": "https://pib.gov.in",
      "source_date": "%s"
    },
    {
      "display_order": 3,
      "category": "Science & Technology",
      "question_text": "What is the primary target orbit location for ISRO's Chandrayaan-4 lunar sample return mission?",
      "options": {
        "A": "Lunar South Pole region",
        "B": "Lunar North Pole region",
        "C": "Mare Tranquillitatis",
        "D": "Lunar Equatorial Belt"
      },
      "correct_option": "A",
      "explanation": "Chandrayaan-4 is designed as a multi-launch sample return mission targeting the water-ice rich Lunar South Pole region.",
      "source_name": "ISRO Official Portal",
      "source_url": "https://www.isro.gov.in",
      "source_date": "%s"
    }
  ]
}`, today, today, today, today, today)
}
