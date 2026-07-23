package quiz

import (
	"strconv"

	"quiz-keralam-backend/internal/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	quizSvc Service
}

func NewHandler(quizSvc Service) *Handler {
	return &Handler{quizSvc: quizSvc}
}

func (h *Handler) GetTodayQuiz(c *gin.Context) {
	quiz, err := h.quizSvc.GetTodayQuiz(c.Request.Context())
	if err != nil {
		response.NotFound(c, "Today's quiz is getting ready. Please check again soon.")
		return
	}

	response.OK(c, "Today's published quiz retrieved successfully", quiz)
}

func (h *Handler) GetQuizByDate(c *gin.Context) {
	date := c.Param("date")
	if date == "" {
		response.BadRequest(c, "Date parameter is required", nil)
		return
	}

	quiz, err := h.quizSvc.GetQuizByDate(c.Request.Context(), date)
	if err != nil {
		response.NotFound(c, "No published quiz found for the given date")
		return
	}

	response.OK(c, "Quiz retrieved successfully", quiz)
}

func (h *Handler) ListPublishedQuizzes(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	quizzes, total, err := h.quizSvc.ListPublishedQuizzes(c.Request.Context(), page, pageSize)
	if err != nil {
		response.InternalServerError(c, "Failed to list published quizzes")
		return
	}

	response.OK(c, "Published quizzes retrieved", gin.H{
		"quizzes": quizzes,
		"total":   total,
		"page":    page,
		"limit":   pageSize,
	})
}

func (h *Handler) SubmitQuiz(c *gin.Context) {
	quizID := c.Param("id")
	if quizID == "" {
		response.BadRequest(c, "Quiz ID is required", nil)
		return
	}

	var req QuizSubmissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid submission payload. Must contain 3 valid answers.", err.Error())
		return
	}

	userAgent := c.GetHeader("User-Agent")
	result, err := h.quizSvc.SubmitQuiz(c.Request.Context(), quizID, req, userAgent)
	if err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Quiz submitted successfully", result)
}

func (h *Handler) GetAttemptResult(c *gin.Context) {
	attemptID := c.Param("id")
	if attemptID == "" {
		response.BadRequest(c, "Attempt ID is required", nil)
		return
	}

	result, err := h.quizSvc.GetAttemptResult(c.Request.Context(), attemptID)
	if err != nil {
		response.NotFound(c, "Attempt result not found")
		return
	}

	response.OK(c, "Attempt result retrieved successfully", result)
}
