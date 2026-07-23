# Quiz Keralam - Next.js Frontend

Responsive web application for Quiz Keralam ("3 Questions. 1 Minute. Every Day."), built using Next.js (App Router), TypeScript, Tailwind CSS, Lucide React, and Framer Motion.

## Features
- **Mobile-First Responsive Design**: Optimized for seamless daily quiz experience across mobile and desktop devices.
- **Guest Quiz Submission**: Answer 3 daily questions without an account, store draft answers in `localStorage`.
- **Kerala Design System**: Visual aesthetic featuring Deep Emerald Green, Warm Saffron Orange, Golden Yellow, and custom SVG background accents.
- **WhatsApp Integration**: Single-tap WhatsApp share button with URL-encoded score card template.
- **Admin Dashboard & Editor**: Management interface for draft generation, review, manual editing, approval, and live publication.
- **Static Export Compatible**: Configured for Cloudflare Pages static export (`output: 'export'`).

## Local Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Copy environment variables file
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start Next.js development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
