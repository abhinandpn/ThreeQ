# Quiz Keralam 🌴 Quiz Keralam

> **3 Questions. 1 Minute. Every Day.**

Quiz Keralam is a daily current-affairs micro-quiz platform focused on Kerala and India. Built for Kerala PSC aspirants, students, and WhatsApp learning groups.

---

## 🚀 Key Features

- **⚡ 1-Minute Daily Quiz**: Exactly 3 daily questions (Q1: Kerala Current Affairs, Q2: India Current Affairs, Q3: Special Topic).
- **🔒 Guest Access**: Users answer immediately without creating an account.
- **📊 Instant Evaluation & Explanations**: Server-calculated scores (0-3) with clear factual explanations and news citations.
- **📱 WhatsApp Sharing**: Single-tap WhatsApp group score sharing.
- **🤖 Gemini AI Daily Generation**: Automated daily draft generation via Gemini API.
- **🛡️ Admin Editorial System**: JWT-authenticated portal to review, edit, approve, and publish quizzes.
- **🎨 Kerala Design Aesthetics**: Deep emerald green (`#065f46`), warm saffron orange (`#ea580c`), golden yellow, and custom visual motifs.

---

## 🛠️ Technology Stack

| Layer | Technology | Hosting Target |
|---|---|---|
| **Frontend** | Next.js 15 (App Router, Static Export), Tailwind CSS, Framer Motion | Cloudflare Pages (Free) |
| **Backend** | Go 1.22, Gin Framework, `pgxpool`, Structured `slog` | Koyeb Free Web Service |
| **Database** | PostgreSQL 16 (UUIDs, Indexes, FK constraints) | Neon Free PostgreSQL |
| **AI Generation** | Google Gemini API (`gemini-1.5-flash`) | Invoked from Go backend |
| **Automation** | GitHub Actions Workflow (`07:00 AM IST daily`) | GitHub Actions |

---

## 📁 Repository Structure

```
ThreeQ/
├── backend/                  # Go Gin REST API
│   ├── cmd/api/main.go       # Server entry point with graceful shutdown
│   ├── internal/             # Clean modular monolith packages
│   │   ├── admin/            # Admin handlers & dashboard endpoints
│   │   ├── auth/             # Admin authentication & JWT issuing
│   │   ├── config/           # Environment configuration loader
│   │   ├── database/         # Pgxpool PostgreSQL connection pool
│   │   ├── generation/       # Gemini AI daily quiz generator
│   │   ├── middleware/       # CORS, Request logging, Security, JWT auth
│   │   ├── quiz/             # Quiz business logic & repository
│   │   └── response/         # Standardized API response formatters
│   ├── migrations/           # PostgreSQL migration up/down SQL files
│   ├── Dockerfile            # Multi-stage security-hardened Docker container
│   ├── .env.example          # Environment variables template
│   └── go.mod                # Go module file
├── frontend/                 # Next.js App Router Web App
│   ├── app/                  # Pages: Home, Today, Date, Result, Archive, Admin
│   ├── components/           # Reusable UI components (Header, QuizCard, ResultCard, etc.)
│   ├── lib/                  # API client, LocalStorage manager, Utility formatters
│   ├── types/                # TypeScript interface definitions
│   ├── next.config.ts        # Configured with output: 'export'
│   ├── tailwind.config.ts    # Custom Kerala brand palette
│   └── package.json          # Dependencies
├── .github/workflows/        # Automated daily quiz generation cron
│   └── daily_quiz_generation.yml
└── README.md
```

---

## 💻 Local Development Setup

### 1. Database Setup (PostgreSQL)
Create a PostgreSQL database named `quiz_keralam` locally or obtain a Neon database URL. Execute `backend/migrations/000001_init_schema.up.sql`.

### 2. Backend Setup (Go)
```bash
cd backend
cp .env.example .env
go mod download
go run ./cmd/api
```
The API server will listen on `http://localhost:8080`.

### 3. Frontend Setup (Next.js)
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Sample API Requests

### 1. Get Today's Published Quiz
```bash
curl -X GET http://localhost:8080/api/v1/quizzes/today
```

### 2. Submit Quiz Answers
```bash
curl -X POST http://localhost:8080/api/v1/quizzes/{QUIZ_ID}/submit \
  -H "Content-Type: application/json" \
  -d '{
    "guest_id": "guest_123456",
    "answers": [
      { "question_id": "Q1_UUID", "selected_option": "B" },
      { "question_id": "Q2_UUID", "selected_option": "A" },
      { "question_id": "Q3_UUID", "selected_option": "A" }
    ]
  }'
```

### 3. Admin Login
```bash
curl -X POST http://localhost:8080/api/v1/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@quizkeralam.com",
    "password": "AdminSecurePassword123!"
  }'
```

---

## ☁️ Production Free-Tier Deployment Guide

1. **Database (Neon)**:
   - Create a free PostgreSQL instance on Neon.
   - Run the SQL migration script in the Neon SQL Editor.
2. **Backend (Koyeb)**:
   - Connect repository and build using `backend/Dockerfile`.
   - Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `FRONTEND_URL`).
3. **Frontend (Cloudflare Pages)**:
   - Connect `frontend/` directory.
   - Build command: `npm run build`, output directory: `out`.
   - Environment variable: `NEXT_PUBLIC_API_BASE_URL=https://your-backend.koyeb.app`.
# ThreeQ
