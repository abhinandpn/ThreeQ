# ThreeQ Frontend (Pure HTML5, CSS3, Vanilla JS)

Pure lightweight static frontend for **ThreeQ** (3 Questions. 1 Minute. Every Day). Built with zero node dependencies or framework compilers.

## 📁 File Structure

```
frontend/
├── index.html               # Home / Landing page
├── quiz.html                # Today's Quiz / Stepper page
├── quiz-date.html           # Quiz by Date page
├── result.html              # Quiz Result & Explanations page
├── archive.html             # Previous Quizzes Archive page
├── leaderboard.html         # Leaderboard page
├── profile.html             # Profile page
├── settings.html            # Settings page
├── about.html               # About page
├── 404.html                 # 404 Page
├── admin-login.html         # Admin Login page
├── admin-dashboard.html     # Admin Dashboard page
├── admin-quizzes.html       # Admin Quizzes List page
├── admin-quiz-new.html      # Admin Manual Quiz Creator page
├── admin-quiz-edit.html     # Admin Quiz Review & Editor page
├── admin-stats.html        # Admin Analytics & System Logs page
├── css/
│   └── styles.css           # Complete vanilla CSS design system
├── js/
│   ├── config.js            # API base URL configuration
│   ├── storage.js           # LocalStorage state management
│   ├── api.js               # Fetch API client (Go Backend)
│   ├── confetti.js          # Canvas confetti script
│   └── app.js               # Shared header/footer layout
└── README.md
```

## 🚀 How to Run Locally

You can serve this pure HTML/CSS/JS frontend using **any static web server** or Python:

```bash
cd frontend
python3 -m http.server 3000
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

> Ensure your Go backend API is running on `http://localhost:8080` (`cd backend && go run ./cmd/api/main.go`).
