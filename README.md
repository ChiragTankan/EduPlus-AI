# EDU Plus 🎓

> **EDU Plus** is a next-generation AI-powered learning and academic mastery platform designed for modern students, educators, and lifelong learners.

---

## 🚀 Key Features

1. **AI Study Tutor (Interactive Chat)**
   - Powered by Gemini AI.
   - Provides real-time explanations, homework guidance, study strategies, and interactive Q&A.

2. **Personalized Study Roadmaps**
   - Instantly generates custom, step-by-step academic learning modules tailored to any subject or target level (e.g. Computer Science, Quantum Computing, Data Analytics).

3. **Curriculum Insights**
   - Live AI analysis highlighting key 2026 academic disciplines, core competencies, and practical hands-on project ideas.

4. **Interactive Study Area & Module Generator**
   - Generates multi-part lessons complete with theory, practical exercises, interactive quizzes, and instant grading feedback.

5. **Verified Digital Certificates**
   - Automated certificate generation upon module completion, complete with verification seals and printable formats.

6. **AI Mock Interview (Under Fine-Tuning)**
   - Voice and scenario-based interview simulation module designed to test subject comprehension and interview readiness.

---

## 🛠 Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React Icons.
- **Backend Service:** Node.js, Express.js (custom full-stack runner with Vite middleware & production bundling).
- **AI Service Integration:** `@google/genai` SDK using `gemini-2.5-flash` model.
- **Authentication & Fallback:** Clerk React Integration with built-in seamless Demo Auth fallback.

---

## 🏃 Local Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Production Build & Start:**
   ```bash
   npm run build
   npm start
   ```
