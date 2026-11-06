# AI Interview Mocker 🎯

An intelligent, AI-powered mock interview application that simulates real-world technical and behavioral interviews. Powered by **Next.js 14**, **Google Gemini AI**, **Clerk Authentication**, and **Neon PostgreSQL with Drizzle ORM**.

---

## 🌟 Key Features

- **Tailored AI Questions**: Generate realistic interview questions customized to your specific job role, tech stack, and years of experience using Google Gemini.
- **Audio & Video Simulation**: Practice in a real interview environment with integrated webcam preview and browser-based speech-to-text recognition.
- **Answer Recording & Manual Fallback**: Record responses via your microphone with real-time transcription, or edit/type your answer directly.
- **Instant AI Feedback & Ratings**: Detailed breakdown comparing your response to the model answer, complete with constructive advice and an overall rating.
- **Session History & Review**: Review feedback and ratings from all past mock interviews on your dashboard.
- **User Authentication**: Secure sign-in and user management powered by Clerk.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: JavaScript / React 18
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Radix UI
- **AI Model**: Google Gemini API (`@google/generative-ai`)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [Neon](https://neon.tech/) Serverless PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Speech-to-Text**: `react-hook-speech-to-text` (Web Speech API)
- **Camera**: `react-webcam`
- **Icons & Notifications**: `lucide-react`, `sonner`

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/UdayDeshmukh45/Ai-interview-mocker-main.git
cd Ai-interview-mocker-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory based on `.env.example`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://user:password@host/database?sslmode=require

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=5
NEXT_PUBLIC_INFORMATION=Enable Video Web Cam and Microphone to Start your AI Generated Mock Interview...
NEXT_PUBLIC_QUESTION_NOTE=Click on Record Answer when you want to answer the question...
```

### 4. Push Database Schema

Ensure your database tables (`mockInterview` and `userAnswer`) are up to date:

```bash
npm run db:push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Scripts

| Script | Description |
|---|---|
| `npm run dev` | Runs the development server on `localhost:3000` |
| `npm run build` | Builds the production Next.js bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs Next.js ESLint checks |
| `npm run db:push` | Pushes Drizzle ORM schema to your Neon PostgreSQL database |
| `npm run db:studio` | Opens Drizzle Studio GUI for inspecting database rows |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
