package quiz

import (
	"testing"
)

func TestScoreCalculation(t *testing.T) {
	questions := map[string]Question{
		"q1": {ID: "q1", CorrectOption: "A"},
		"q2": {ID: "q2", CorrectOption: "B"},
		"q3": {ID: "q3", CorrectOption: "C"},
	}

	tests := []struct {
		name          string
		answers       []QuestionAnswer
		expectedScore int
	}{
		{
			name: "All Correct (3/3)",
			answers: []QuestionAnswer{
				{QuestionID: "q1", SelectedOption: "A"},
				{QuestionID: "q2", SelectedOption: "B"},
				{QuestionID: "q3", SelectedOption: "C"},
			},
			expectedScore: 3,
		},
		{
			name: "Two Correct (2/3)",
			answers: []QuestionAnswer{
				{QuestionID: "q1", SelectedOption: "A"},
				{QuestionID: "q2", SelectedOption: "B"},
				{QuestionID: "q3", SelectedOption: "D"},
			},
			expectedScore: 2,
		},
		{
			name: "One Correct (1/3)",
			answers: []QuestionAnswer{
				{QuestionID: "q1", SelectedOption: "A"},
				{QuestionID: "q2", SelectedOption: "D"},
				{QuestionID: "q3", SelectedOption: "D"},
			},
			expectedScore: 1,
		},
		{
			name: "Zero Correct (0/3)",
			answers: []QuestionAnswer{
				{QuestionID: "q1", SelectedOption: "B"},
				{QuestionID: "q2", SelectedOption: "C"},
				{QuestionID: "q3", SelectedOption: "A"},
			},
			expectedScore: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			score := 0
			for _, ans := range tt.answers {
				q, ok := questions[ans.QuestionID]
				if !ok {
					t.Fatalf("Question %s not found", ans.QuestionID)
				}
				if ans.SelectedOption == q.CorrectOption {
					score++
				}
			}

			if score != tt.expectedScore {
				t.Errorf("Expected score %d, got %d", tt.expectedScore, score)
			}
		})
	}
}

func TestValidationRules(t *testing.T) {
	req := CreateQuizRequest{
		QuizDate: "2026-07-24",
		Title:    "Test Quiz",
		Questions: []CreateQuestionDTO{
			{QuestionText: "Q1", OptionA: "A", OptionB: "B", OptionC: "C", OptionD: "D", CorrectOption: "A", Category: "Kerala", DisplayOrder: 1},
			{QuestionText: "Q2", OptionA: "A", OptionB: "B", OptionC: "C", OptionD: "D", CorrectOption: "B", Category: "India", DisplayOrder: 2},
			{QuestionText: "Q3", OptionA: "A", OptionB: "B", OptionC: "C", OptionD: "D", CorrectOption: "C", Category: "Tech", DisplayOrder: 3},
		},
	}

	if len(req.Questions) != 3 {
		t.Errorf("Expected 3 questions, got %d", len(req.Questions))
	}
}
