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
		log.Printf("[WARNING] Could not connect to database pool: %v. Running in standalone mode if needed.", err)
	} else {
		defer pool.Close()
	}

	// Initialize Repositories and Services
	var quizRepo quiz.Repository
	if pool != nil {
		quizRepo = quiz.NewRepository(pool)
	}
	
	quizSvc := quiz.NewService(quizRepo)

	var authSvc auth.Service
	if pool != nil {
		authSvc = auth.NewService(pool, cfg)
		// Seed default admin user asynchronously on startup
		go func() {
			seedCtx, seedCancel := context.WithTimeout(context.Background(), 10*time.Second)
			defer seedCancel()
			if err := authSvc.SeedAdmin(seedCtx); err != nil {
				log.Printf("[WARNING] Failed to seed initial admin: %v", err)
			}
		}()
	}

	var genSvc generation.Service
	if pool != nil {
		genSvc = generation.NewService(pool, cfg, quizSvc)
	}

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
			response.OK(c, "Quiz Keralam Backend is healthy", gin.H{
				"status":    "UP",
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

		// Protected Admin Routes (JWT Auth required)
		adminProtected := v1.Group("/admin")
		adminProtected.Use(middleware.AdminAuth(cfg))
		{
			adminProtected.GET("/dashboard", adminHandler.GetDashboard)
			adminProtected.GET("/quizzes", adminHandler.ListQuizzes)
			adminProtected.POST("/quizzes", adminHandler.CreateQuiz)
			adminProtected.GET("/quizzes/:id", adminHandler.GetQuiz)
			adminProtected.PUT("/quizzes/:id", adminHandler.UpdateQuiz)
			adminProtected.DELETE("/quizzes/:id", adminHandler.DeleteQuiz)
			adminProtected.POST("/quizzes/:id/approve", adminHandler.ApproveQuiz)
			adminProtected.POST("/quizzes/:id/publish", adminHandler.PublishQuiz)
			adminProtected.POST("/quizzes/:id/unpublish", adminHandler.UnpublishQuiz)
		}

		// Protected Generation Endpoint (Accessible via GitHub Actions Cron Key or Admin JWT)
		genGroup := v1.Group("/admin/quizzes")
		genGroup.Use(middleware.RequireCronKeyOrAdmin(cfg))
		{
			genGroup.POST("/generate", adminHandler.GenerateQuiz)
		}
	}

	// Server setup with Graceful Shutdown
	server := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("[SERVER] Quiz Keralam API listening on port %s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("[FATAL] Server error: %v", err)
		}
	}()

	// Wait for interrupt signal for graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("[SERVER] Shutting down Quiz Keralam API gracefully...")

	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("[FATAL] Server forced to shutdown: %v", err)
	}

	log.Println("[SERVER] Server exited gracefully")
}
