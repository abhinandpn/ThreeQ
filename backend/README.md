# ThreeQ - Go Backend API

High-performance RESTful API powering ThreeQ ("3 Questions. 1 Minute. Every Day."), built using Go, Gin framework, pgxpool, and Google Gemini API.

## Features
- **Public Quiz Engine**: Serves daily quiz questions without revealing correct answers before submission.
- **Server-Side Scoring**: Validates answer submissions and calculates official score (0-3).
- **Gemini AI Generator**: Daily automated draft quiz creation with National, World/International, and General Knowledge categories.
- **Admin System**: JWT authenticated dashboard to review, edit, approve, and publish quizzes.
- **PostgreSQL Database**: Connection pooled via `pgxpool` with strict foreign key constraints and audit logging.

## Local Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Copy environment variables file
cp .env.example .env

# 3. Download dependencies
go mod download

# 4. Run the API server
go run ./cmd/api/main.go
```

## API Endpoints Overview

| Method | Path | Access | Description |
|---|---|---|---|
| `GET` | `/api/v1/health` | Public | System health check |
| `GET` | `/api/v1/quizzes/today` | Public | Fetch currently published daily quiz |
| `GET` | `/api/v1/quizzes/date/:date` | Public | Fetch published quiz for specific date |
| `GET` | `/api/v1/quizzes` | Public | List archive of published quizzes |
| `POST` | `/api/v1/quizzes/:id/submit` | Public | Submit quiz answers & compute score |
| `GET` | `/api/v1/attempts/:id` | Public | Fetch attempt results & explanations |
| `POST` | `/api/v1/admin/auth/login` | Public | Admin login with JWT response |
| `GET` | `/api/v1/admin/dashboard` | Admin | Dashboard stats & metrics |
| `GET` | `/api/v1/admin/quizzes` | Admin | Filter & list all quizzes |
| `POST` | `/api/v1/admin/quizzes` | Admin | Manually create draft quiz |
| `GET` | `/api/v1/admin/quizzes/:id` | Admin | Get full quiz details |
| `PUT` | `/api/v1/admin/quizzes/:id` | Admin | Update quiz draft/approved |
| `DELETE` | `/api/v1/admin/quizzes/:id` | Admin | Delete draft quiz |
| `POST` | `/api/v1/admin/quizzes/:id/approve` | Admin | Approve quiz |
| `POST` | `/api/v1/admin/quizzes/:id/publish` | Admin | Publish quiz to users |
| `POST` | `/api/v1/admin/quizzes/generate` | Admin/Cron | Trigger Gemini AI daily quiz draft |

## Running Tests

```bash
go test -v ./...
```
