package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"quiz-keralam-backend/internal/admin"
	"quiz-keralam-backend/internal/auth"
	"quiz-keralam-backend/internal/config"
	"quiz-keralam-backend/internal/database"
	"quiz-keralam-backend/internal/generation"
	"quiz-keralam-backend/internal/middleware"
	"quiz-keralam-backend/internal/quiz"
	"quiz-keralam-backend/internal/response"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Initialize Postgres Connection Pool
	pool, err := database.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Printf("[WARNING] Could not connect to database pool: %v. Running in standalone in-memory mode.", err)
	} else {
		defer pool.Close()
	}

	// Initialize Repositories and Services
	var quizRepo quiz.Repository
	if pool != nil {
		quizRepo = quiz.NewRepository(pool)
	} else {
		quizRepo = quiz.NewMemoryRepository()
	}

	quizSvc := quiz.NewService(quizRepo)
	authSvc := auth.NewService(pool, cfg)

	// Seed default admin user asynchronously on startup if pool exists
	if pool != nil {
		go func() {
			seedCtx, seedCancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer seedCancel()
			if err := authSvc.SeedAdmin(seedCtx); err != nil {
				log.Printf("[WARNING] Failed to seed initial admin: %v", err)
			}
		}()
	}

	genSvc := generation.NewService(pool, cfg, quizSvc)

	// Handlers
	quizHandler := quiz.NewHandler(quizSvc)
	adminHandler := admin.NewHandler(authSvc, quizSvc, genSvc)

	// Setup Gin Router
	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.RequestLogger())
	r.Use(middleware.SecurityHeaders())
	r.Use(middleware.CORS(cfg))

	// API v1 Routes
	v1 := r.Group("/api/v1")
	{
		// Health Check
		v1.GET("/health", func(c *gin.Context) {
			status := "UP"
			if pool == nil {
				status = "STANDALONE_MEMORY"
			}
			response.OK(c, "Quiz Keralam Backend is healthy", gin.H{
				"status":    status,
				"timestamp": time.Now().Format(time.RFC3339),
				"env":       cfg.AppEnv,
			})
		})

		// Public Quiz Endpoints
		v1.GET("/quizzes/today", quizHandler.GetTodayQuiz)
		v1.GET("/quizzes/date/:date", quizHandler.GetQuizByDate)
		v1.GET("/quizzes", quizHandler.ListPublishedQuizzes)
		v1.POST("/quizzes/:id/submit", quizHandler.SubmitQuiz)
		v1.GET("/attempts/:id", quizHandler.GetAttemptResult)

		// Admin Auth
		adminAuthGroup := v1.Group("/admin/auth")
		{
			adminAuthGroup.POST("/login", adminHandler.Login)
		}

		// Admin Protected Group
		adminGroup := v1.Group("/admin")
		adminGroup.Use(middleware.AdminAuth(cfg))
		{
			adminGroup.GET("/dashboard", adminHandler.GetDashboard)
			adminGroup.GET("/quizzes", adminHandler.ListQuizzes)
			adminGroup.POST("/quizzes", adminHandler.CreateQuiz)
			adminGroup.GET("/quizzes/:id", adminHandler.GetQuiz)
			adminGroup.PUT("/quizzes/:id", adminHandler.UpdateQuiz)
			adminGroup.DELETE("/quizzes/:id", adminHandler.DeleteQuiz)
			adminGroup.POST("/quizzes/:id/approve", adminHandler.ApproveQuiz)
			adminGroup.POST("/quizzes/:id/publish", adminHandler.PublishQuiz)
			adminGroup.POST("/quizzes/:id/unpublish", adminHandler.UnpublishQuiz)
		}

		// Quiz generation can be triggered either by an authenticated admin or
		// by the scheduled GitHub Actions workflow using its dedicated key.
		generationGroup := v1.Group("/admin/quizzes")
		generationGroup.Use(middleware.RequireCronKeyOrAdmin(cfg))
		{
			generationGroup.POST("/generate", adminHandler.GenerateQuiz)
		}
	}

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[SERVER] Quiz Keralam API listening on port %s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[ERROR] Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[SERVER] Shutting down API server...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutdownCancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("[ERROR] Server forced to shutdown: %v", err)
	}

	log.Println("[SERVER] Server exited cleanly")
}
