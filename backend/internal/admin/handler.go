package admin

import (
	"errors"
	"log"
	"net/http"
	"strconv"

	"quiz-keralam-backend/internal/auth"
	"quiz-keralam-backend/internal/generation"
	"quiz-keralam-backend/internal/quiz"
	"quiz-keralam-backend/internal/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	authSvc auth.Service
	quizSvc quiz.Service
	genSvc  generation.Service
}

func NewHandler(authSvc auth.Service, quizSvc quiz.Service, genSvc generation.Service) *Handler {
	return &Handler{
		authSvc: authSvc,
		quizSvc: quizSvc,
		genSvc:  genSvc,
	}
}

func (h *Handler) Login(c *gin.Context) {
	var req auth.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid login credentials", err.Error())
		return
	}

	resp, err := h.authSvc.Login(c.Request.Context(), req)
	if err != nil {
		response.Unauthorized(c, err.Error())
		return
	}

	response.OK(c, "Admin login successful", resp)
}

func (h *Handler) GetDashboard(c *gin.Context) {
	stats, err := h.quizSvc.GetDashboardStats(c.Request.Context())
	if err != nil {
		response.InternalServerError(c, "Failed to retrieve dashboard stats")
		return
	}

	response.OK(c, "Dashboard stats retrieved", stats)
}

func (h *Handler) ListQuizzes(c *gin.Context) {
	status := c.Query("status")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("limit", "15"))

	quizzes, total, err := h.quizSvc.ListAllQuizzes(c.Request.Context(), status, page, pageSize)
	if err != nil {
		response.InternalServerError(c, "Failed to list quizzes")
		return
	}

	response.OK(c, "Quizzes list retrieved", gin.H{
		"quizzes": quizzes,
		"total":   total,
		"page":    page,
		"limit":   pageSize,
	})
}

func (h *Handler) GetQuiz(c *gin.Context) {
	id := c.Param("id")
	q, err := h.quizSvc.GetQuizByID(c.Request.Context(), id)
	if err != nil {
		response.NotFound(c, "Quiz not found")
		return
	}

	response.OK(c, "Quiz details retrieved", q)
}

func (h *Handler) CreateQuiz(c *gin.Context) {
	var req quiz.CreateQuizRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request payload. Exactly 3 questions with 4 options required.", err.Error())
		return
	}

	createdQuiz, err := h.quizSvc.CreateQuiz(c.Request.Context(), req)
	if err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.Created(c, "Draft quiz created successfully", createdQuiz)
}

func (h *Handler) UpdateQuiz(c *gin.Context) {
	id := c.Param("id")
	var req quiz.CreateQuizRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request payload", err.Error())
		return
	}

	updatedQuiz, err := h.quizSvc.UpdateQuiz(c.Request.Context(), id, req)
	if err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Quiz updated successfully", updatedQuiz)
}

func (h *Handler) DeleteQuiz(c *gin.Context) {
	id := c.Param("id")
	if err := h.quizSvc.DeleteDraftQuiz(c.Request.Context(), id); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Draft quiz deleted successfully", nil)
}

func (h *Handler) ApproveQuiz(c *gin.Context) {
	id := c.Param("id")
	if err := h.quizSvc.ApproveQuiz(c.Request.Context(), id); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Quiz approved successfully", nil)
}

func (h *Handler) PublishQuiz(c *gin.Context) {
	id := c.Param("id")
	if err := h.quizSvc.PublishQuiz(c.Request.Context(), id); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Quiz published successfully", nil)
}

func (h *Handler) UnpublishQuiz(c *gin.Context) {
	id := c.Param("id")
	if err := h.quizSvc.UnpublishQuiz(c.Request.Context(), id); err != nil {
		response.BadRequest(c, err.Error(), nil)
		return
	}

	response.OK(c, "Quiz unpublished back to approved status", nil)
}

func (h *Handler) GenerateQuiz(c *gin.Context) {
	type GenRequest struct {
		Date string `json:"date"`
	}
	var req GenRequest
	_ = c.ShouldBindJSON(&req)

	generated, err := h.genSvc.GenerateDailyQuiz(c.Request.Context(), req.Date)
	if err != nil {
		log.Printf("quiz generation failed for date %q: %v", req.Date, err)
		if errors.Is(err, quiz.ErrQuizDateAlreadyExists) {
			response.Error(
				c,
				http.StatusConflict,
				"A quiz already exists for this date. Open Quizzes List to review, edit, approve, or publish the existing quiz.",
				"QUIZ_ALREADY_EXISTS",
				gin.H{"date": req.Date},
			)
			return
		}
		response.InternalServerError(c, "Quiz generation could not be completed. Please try again. If the problem continues, check Analytics & Logs.")
		return
	}

	response.Created(c, "Daily draft quiz generated successfully using Gemini AI", generated)
}
