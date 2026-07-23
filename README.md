# ThreeQ ⚡

> **3 Questions. 1 Minute. Every Day.**

ThreeQ is a daily current-affairs and general-knowledge micro-quiz platform. Users can answer three questions without creating an account, receive instant scores and explanations, and share their results. An authenticated admin portal supports quiz review, editing, approval, and publishing.

## Live Application

- **Frontend:** [https://abhinandpn.github.io/ThreeQ/](https://abhinandpn.github.io/ThreeQ/)
- **Backend health:** [https://threeq-1dnj.onrender.com/api/v1/health](https://threeq-1dnj.onrender.com/api/v1/health)

The Render free service may take up to a minute to wake after a period of inactivity.

## Features

- Three-question daily quiz
- Guest access with locally saved draft answers
- Server-side scoring
- Answer explanations and source citations
- Quiz archive and date-based quizzes
- Result sharing through WhatsApp
- JWT-protected admin portal
- Manual quiz creation and editing
- Draft, approved, and published workflows
- Gemini-assisted daily draft generation
- Scheduled generation with GitHub Actions
- PostgreSQL persistence with Neon
- Responsive static frontend

## Technology Stack

| Layer | Technology | Hosting |
|---|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript | GitHub Pages |
| Backend | Go 1.22, Gin, pgxpool | Render Free Web Service |
| Database | PostgreSQL | Neon Free |
| AI | Gemini API | Google AI Studio Free Tier |
| Automation | GitHub Actions | GitHub |

## Repository Structure

```text
ThreeQ/
├── .github/
│   └── workflows/
│       └── daily_quiz_generation.yml
├── backend/
│   ├── cmd/api/main.go
│   ├── internal/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── database/
│   │   ├── generation/
│   │   ├── middleware/
│   │   ├── quiz/
│   │   └── response/
│   ├── migrations/
│   ├── Dockerfile
│   └── go.mod
├── docs/
│   ├── css/styles.css
│   ├── js/
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── confetti.js
│   │   └── storage.js
│   ├── index.html
│   ├── quiz.html
│   ├── result.html
│   └── admin-*.html
├── render.yaml
└── README.md
```

## Local Development

### Requirements

- Go 1.22 or later
- PostgreSQL, or a Neon connection string
- Python 3 or another static file server

### 1. Configure the backend

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Configure the required values:

```dotenv
PORT=8080
APP_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRY_MINUTES=1440
ADMIN_SEED_NAME=ThreeQ Admin
ADMIN_SEED_EMAIL=admin@example.com
ADMIN_SEED_PASSWORD=replace-with-a-strong-password
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.5-flash-lite
FRONTEND_URL=http://localhost:3000
ADMIN_GENERATION_KEY=replace-with-another-random-secret
```

Environment files and credentials must never be committed.

### 2. Create the database schema

Execute the following migration in PostgreSQL or the Neon SQL Editor:

```text
backend/migrations/000001_init_schema.up.sql
```

### 3. Start the backend

The backend reads environment variables from the process. Load `backend/.env` into the current shell, then run:

```bash
cd backend
set -a
source .env
set +a
go run ./cmd/api
```

Verify:

```text
http://localhost:8080/api/v1/health
```

### 4. Start the frontend

For local development, change `docs/js/config.js` temporarily:

```js
API_BASE_URL: 'http://localhost:8080',
```

Then serve the `docs` directory:

```bash
cd docs
python3 -m http.server 3000
```

Open [http://localhost:3000](http://localhost:3000).

Restore the production API URL before committing:

```js
API_BASE_URL: 'https://threeq-1dnj.onrender.com',
```

## API Endpoints

### Public

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/health` | Service and database health |
| GET | `/api/v1/quizzes/today` | Get today's published quiz |
| GET | `/api/v1/quizzes/date/:date` | Get a published quiz by date |
| GET | `/api/v1/quizzes` | List published quizzes |
| POST | `/api/v1/quizzes/:id/submit` | Submit answers and calculate score |
| GET | `/api/v1/attempts/:id` | Get an attempt result |
| POST | `/api/v1/admin/auth/login` | Admin login |

### Protected admin routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/admin/dashboard` | Dashboard statistics |
| GET | `/api/v1/admin/quizzes` | List all quizzes |
| POST | `/api/v1/admin/quizzes` | Create a quiz |
| GET | `/api/v1/admin/quizzes/:id` | Get quiz details |
| PUT | `/api/v1/admin/quizzes/:id` | Update a quiz |
| DELETE | `/api/v1/admin/quizzes/:id` | Delete a draft |
| POST | `/api/v1/admin/quizzes/:id/approve` | Approve a quiz |
| POST | `/api/v1/admin/quizzes/:id/publish` | Publish a quiz |
| POST | `/api/v1/admin/quizzes/:id/unpublish` | Unpublish a quiz |
| POST | `/api/v1/admin/quizzes/generate` | Generate an AI-assisted draft |

## Deployment

### GitHub Pages

GitHub Pages is configured to publish:

```text
Branch: main
Directory: /docs
```

Every push affecting `docs/` updates the frontend.

### Render

The Go backend is deployed as a free Render Web Service:

```text
Root directory: backend
Build command: go build -tags netgo -ldflags '-s -w' -o app ./cmd/api
Start command: ./app
Health check: /api/v1/health
```

Required Render environment variables:

```text
APP_ENV
DATABASE_URL
JWT_SECRET
JWT_EXPIRY_MINUTES
ADMIN_SEED_NAME
ADMIN_SEED_EMAIL
ADMIN_SEED_PASSWORD
GEMINI_API_KEY
GEMINI_MODEL
FRONTEND_URL
ADMIN_GENERATION_KEY
```

### Neon

The production database uses a pooled Neon PostgreSQL connection string stored as `DATABASE_URL` in Render.

### GitHub Actions

The daily workflow runs at 01:30 UTC, corresponding to 07:00 AM IST. It requires these repository secrets:

```text
BACKEND_API_URL
ADMIN_GENERATION_KEY
```

Generated quizzes are saved as drafts and should be reviewed before publishing.

## Testing

Run the backend test suite:

```bash
cd backend
go test ./...
go vet ./...
```

Check frontend JavaScript syntax:

```bash
node --check docs/js/config.js
node --check docs/js/api.js
node --check docs/js/app.js
node --check docs/js/storage.js
```

## Security

- Never commit database URLs, passwords, JWT secrets, or API keys.
- Keep AI-generated quizzes as drafts until reviewed.
- Rotate any credential accidentally exposed in screenshots or logs.
- Use HTTPS production origins in `FRONTEND_URL`.
- Store production secrets only in Render and GitHub repository secrets.

## License

No license has been specified yet.
