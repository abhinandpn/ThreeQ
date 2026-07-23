package config

import (
	"log"
	"os"
	"strconv"
)

type Config struct {
	Port               string
	AppEnv             string
	DatabaseURL        string
	JWTSecret          string
	JWTExpiryMinutes   int
	AdminSeedName      string
	AdminSeedEmail     string
	AdminSeedPassword  string
	GeminiAPIKey       string
	GeminiModel        string
	FrontendURL        string
	AdminGenerationKey string
}

func Load() *Config {
	port := getEnv("PORT", "8080")
	appEnv := getEnv("APP_ENV", "development")
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/quiz_keralam?sslmode=disable")
	jwtSecret := getEnv("JWT_SECRET", "quiz-keralam-jwt-secret-key-change-in-prod")
	
	expiryStr := getEnv("JWT_EXPIRY_MINUTES", "1440")
	expiry, err := strconv.Atoi(expiryStr)
	if err != nil {
		expiry = 1440
	}

	cfg := &Config{
		Port:               port,
		AppEnv:             appEnv,
		DatabaseURL:        dbURL,
		JWTSecret:          jwtSecret,
		JWTExpiryMinutes:   expiry,
		AdminSeedName:      getEnv("ADMIN_SEED_NAME", "Quiz Admin"),
		AdminSeedEmail:     getEnv("ADMIN_SEED_EMAIL", "admin@quizkeralam.com"),
		AdminSeedPassword:  getEnv("ADMIN_SEED_PASSWORD", "AdminSecurePassword123!"),
		GeminiAPIKey:       os.Getenv("GEMINI_API_KEY"),
		GeminiModel:        getEnv("GEMINI_MODEL", "gemini-1.5-flash"),
		FrontendURL:        getEnv("FRONTEND_URL", "http://localhost:3000"),
		AdminGenerationKey: getEnv("ADMIN_GENERATION_KEY", "cron-secret-key-12345"),
	}

	log.Printf("[CONFIG] Environment loaded. Environment: %s, Port: %s", cfg.AppEnv, cfg.Port)
	return cfg
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
