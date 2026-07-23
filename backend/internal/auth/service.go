package auth

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time"

	"quiz-keralam-backend/internal/config"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type AdminUser struct {
	ID           string    `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string    `json:"token"`
	Admin AdminUser `json:"admin"`
}

type Service interface {
	SeedAdmin(ctx context.Context) error
	Login(ctx context.Context, req LoginRequest) (*LoginResponse, error)
}

type service struct {
	pool *pgxpool.Pool
	cfg  *config.Config
}

func NewService(pool *pgxpool.Pool, cfg *config.Config) Service {
	return &service{pool: pool, cfg: cfg}
}

func (s *service) SeedAdmin(ctx context.Context) error {
	if s.pool == nil {
		log.Printf("[AUTH] Running in-memory mode. Default admin enabled: %s", s.cfg.AdminSeedEmail)
		return nil
	}

	var count int
	err := s.pool.QueryRow(ctx, "SELECT COUNT(*) FROM admins WHERE email = $1", s.cfg.AdminSeedEmail).Scan(&count)
	if err != nil {
		return fmt.Errorf("failed checking admin existence: %w", err)
	}

	if count > 0 {
		log.Printf("[AUTH] Seed admin already exists: %s", s.cfg.AdminSeedEmail)
		return nil
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(s.cfg.AdminSeedPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed hashing admin seed password: %w", err)
	}

	query := `
		INSERT INTO admins (name, email, password_hash, created_at, updated_at)
		VALUES ($1, $2, $3, NOW(), NOW())
	`
	_, err = s.pool.Exec(ctx, query, "System Admin", s.cfg.AdminSeedEmail, string(hash))
	if err != nil {
		return fmt.Errorf("failed inserting seed admin: %w", err)
	}

	log.Printf("[AUTH] Seed admin created successfully: %s", s.cfg.AdminSeedEmail)
	return nil
}

func (s *service) Login(ctx context.Context, req LoginRequest) (*LoginResponse, error) {
	var admin AdminUser

	if s.pool == nil {
		// Standalone memory fallback
		if req.Email == s.cfg.AdminSeedEmail && req.Password == s.cfg.AdminSeedPassword {
			admin = AdminUser{
				ID:        "admin-memory-id",
				Name:      "System Admin",
				Email:     s.cfg.AdminSeedEmail,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
		} else {
			return nil, errors.New("invalid email or password")
		}
	} else {
		query := `SELECT id, name, email, password_hash, created_at, updated_at FROM admins WHERE email = $1`
		err := s.pool.QueryRow(ctx, query, req.Email).Scan(
			&admin.ID,
			&admin.Name,
			&admin.Email,
			&admin.PasswordHash,
			&admin.CreatedAt,
			&admin.UpdatedAt,
		)
		if err != nil {
			return nil, errors.New("invalid email or password")
		}

		if err := bcrypt.CompareHashAndPassword([]byte(admin.PasswordHash), []byte(req.Password)); err != nil {
			return nil, errors.New("invalid email or password")
		}
	}

	token, err := s.generateJWT(admin)
	if err != nil {
		return nil, fmt.Errorf("failed generating token: %w", err)
	}

	return &LoginResponse{
		Token: token,
		Admin: admin,
	}, nil
}

func (s *service) generateJWT(admin AdminUser) (string, error) {
	claims := jwt.MapClaims{
		"sub":   admin.ID,
		"email": admin.Email,
		"name":  admin.Name,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
		"iat":   time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.cfg.JWTSecret))
}
