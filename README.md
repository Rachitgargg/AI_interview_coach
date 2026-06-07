# ApexCoach — AI Mock Interview Prep Engine

ApexCoach is a premium, dark-themed SaaS application designed to help professionals practice and excel at mock interview loops. Built with React and Vite, the platform uses a modern glassmorphic theme inspired by Linear and Vercel, featuring glowing mesh background animations and interactive tracks.

---

## 🌟 Key Features

### 🧠 Generative AI Grading
Grading is powered by the Google Gemini 2.5 Flash API. Responses are graded against professional standards:
* **STAR Method Structure**: Checking for context, actions, and results.
* **Role Terminology**: Evaluating domain-specific vocabulary.
* **Quantifiable Metrics**: Checking for measurable business outcomes and data points.

### 🛡️ Graceful Offline Fallback
In case of network issues, rate limits, or a missing API key, the platform seamlessly falls back to a **Local Rules Engine** that evaluates responses client-side and flags a notification banner.

### 💼 Four Specialized Tracks
ApexCoach features custom interview questionnaires and expectations tailored for:
1. **Frontend Engineer**: CSS, bundle optimizations, state management, render paths.
2. **Product Designer**: User flows, prototyping, usability feedback, design systems.
3. **Data Analyst**: Telemetry, reporting metrics, SQL pipelines, business trends.
4. **Backend Engineer**: API design, scale-out architectures, database caching, low-latency.

### 🎨 Premium SaaS Interface
* **Glassmorphism**: Translucent card panels using `backdrop-filter: blur(16px)` and thin glowing borders.
* **Ambient Animation**: Floating glowing mesh orbs dynamically moving behind components.
* **Session Stepper**: A clean step tracker (`Q1 ➔ Q2 ➔ Q3 ➔ Q4`) marking question progression.
* **100/100 Expected Answers**: Displays detailed expert-level sample answers side-by-side with your final feedback for optimal learning.

---

## 🛠️ Technology Stack

* **Core**: React 19, JavaScript (ES6+).
* **Tooling & Bundler**: Vite, ESLint.
* **Styling**: Modern CSS Variables, CSS Grid, Custom Animations.
* **AI Service**: Google Gemini API via standard `fetch`.

---

