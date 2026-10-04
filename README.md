# AI Interview Preparation Platform ⚡

A modern, full-stack AI-driven web application designed for engineering students and job seekers to prepare for technical and HR interviews, practice MCQs, solve coding problems, receive instant multi-dimensional AI evaluations, and track preparation progress.

---

## 🚀 Key Features

### 1. **AI Mock Interviews**
- **Custom Setup**: Configure interview rounds by domain (*Technical*, *HR*, *Mixed*), difficulty (*Easy*, *Medium*, *Hard*), question count, and specific topics (*Java, Python, JS, DSA, DBMS, OS, Networks, OOP, HR*).
- **Interactive Interface**: Live timer, question audio reader (Text-to-Speech), and speech dictation support (Speech-to-Text).
- **Multi-Dimensional AI Evaluation**: Evaluates answers on **Overall Score**, **Technical Score**, **Communication Score**, **Relevance Score**, and **Confidence Score**.
- **Model Answer Benchmarks**: Compares user responses against benchmark exemplary model answers with actionable coaching tips.

### 2. **Technical MCQ Practice**
- Filter questions by CS topic & difficulty level.
- Interactive quiz flow with timer and single-question display.
- Instant score computation & detailed explanations for correct vs. incorrect answers.

### 3. **Coding Practice Sandbox**
- Real-world DSA & algorithm problems (*Two Sum, Valid Anagram, Reverse LinkedList, Maximum Subarray, Binary Search*).
- Embedded code editor with language selection (*JavaScript, Python, Java*).
- Test cases execution with detailed pass/fail breakdown.

### 4. **Performance Analytics Dashboard**
- Interactive **Recharts** charts showing score trajectory over time, topic mastery, and weekly preparation activity.
- Identified **Strengths**, **Weaknesses**, and **Recommended Revision Topics**.
- Recent interview attempt logs.

### 5. **Admin Portal**
- Full administrator control panel to manage registered users, add/delete MCQs, and add/delete coding questions.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router v6, Axios, Recharts, Lucide Icons.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Mongoose.
- **Database**: MongoDB (Local or automatic `MongoMemoryServer` fallback).
- **AI Integration**: Google Gemini API REST Service with fallback Mock Evaluator engine.

---

## 📁 Folder Structure

```
/ashish project
├── /backend
│   ├── /controllers     # Auth, User, Question, MCQ, Coding, Interview, Dashboard, AI controllers
│   ├── /middleware      # JWT auth & Admin RBAC middleware
│   ├── /models          # User, Question, CodingQuestion, Interview, PracticeSubmission models
│   ├── /routes          # Express REST API routes
│   ├── /services        # AI evaluation service module (Gemini API + Mock fallback)
│   ├── .env             # Environment configuration
│   ├── package.json     # Node dependencies
│   ├── seed.js          # Database seed script (20+ MCQs, 10+ Coding, 20+ Interview Qs)
│   └── server.js        # Express application entry point
│
└── /frontend
    ├── /src
    │   ├── /components  # Navbar, Footer, ProtectedRoute, AdminRoute
    │   ├── /context     # AuthContext with JWT session management
    │   ├── /pages       # Landing, Login, Register, Dashboard, Setup, MockInterview, Evaluation, History, MCQ, Coding, Profile, Admin
    │   ├── /services    # Axios API client module
    │   ├── App.jsx      # Route declarations
    │   ├── main.jsx     # Entry point
    │   └── index.css    # Tailwind CSS & glassmorphism theme
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ⚡ Quick Start & Run Commands

### 1. Start the Backend Server

```bash
cd backend
npm install
npm run seed       # Seed initial database with users, MCQs & coding problems
npm run dev        # Starts server on http://localhost:5000
```

> **Note**: If local MongoDB is not running, the backend automatically spins up an in-memory database (`MongoMemoryServer`) so the application runs seamlessly out-of-the-box!

### 2. Start the Frontend Application

Open a second terminal window:

```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server on http://localhost:3000
```

---

## 🔑 Demo Login Credentials

You can use these pre-configured accounts or register your own:

- 🎓 **Student Demo**: `student@prep.com` / `student123`
- 🛡️ **Admin Demo**: `admin@prep.com` / `admin123`
