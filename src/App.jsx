import { useMemo, useState } from "react";

const professionOptions = [
  "Frontend Engineer",
  "Product Designer",
  "Data Analyst",
  "Backend Engineer",
];

const interviewQuestions = {
  "Frontend Engineer": [
    "Tell me about a time you improved a web app’s performance under a deadline.",
    "How do you decide what to optimize first when a page feels slow?",
    "Describe a time you worked with designers or product managers to improve usability.",
    "What metrics would you use to prove your performance fix actually helped users?",
  ],
  "Product Designer": [
    "How would you redesign a confusing checkout flow for first-time users?",
    "Describe a time you turned user feedback into a design change.",
    "How do you balance business goals with user needs in a design decision?",
    "What would you measure to know your redesign actually improved the experience?",
  ],
  "Data Analyst": [
    "How would you turn ambiguous business requirements into dashboard metrics?",
    "Describe a time you found a surprising insight in data and how you communicated it.",
    "How do you decide which KPIs matter most for a new report?",
    "What steps do you take to make sure your analysis is both accurate and actionable?",
  ],
  "Backend Engineer": [
    "How would you design a resilient API for peak traffic while keeping latency low?",
    "Describe a time you debugged a production issue under pressure.",
    "What trade-offs do you consider when choosing between speed, reliability, and cost?",
    "How do you verify that your backend changes are safe before releasing them?",
  ],
};

const sampleAnswerBank = {
  "Frontend Engineer": [
    "I improved a React dashboard by splitting the main bundle into lazy-loaded routes, memoizing repeated renders, and removing an expensive chart render. This cut initial load time by 35% and improved Lighthouse scores from 68 to 89.",
    "I would first measure where the page slows down, then focus on the highest-cost render path, the biggest asset, or the slowest API call. After identifying the bottleneck, I would test one change at a time and verify the impact with real metrics.",
    "I usually work with design and product teams to make usability trade-offs clear, because performance improvements should still support the user journey. I explain the proposed change, show the expected benefit, and validate whether it improves both speed and experience.",
    "I would use page load time, interaction latency, and Core Web Vitals to prove the optimization worked. If the numbers improve and the user flow feels smoother, the fix is successful.",
  ],
  "Product Designer": [
    "I would begin by mapping the checkout journey, observing where first-time users hesitate, and interviewing a small group of actual customers. Then I would turn that insight into a simple prototype and test the revised path with real users.",
    "I would prioritize the friction points that block conversion and make the most impact for the business. My goal is to reduce confusion while keeping the product simple and intuitive.",
    "I balance business goals and user needs by looking at both the customer problem and the commercial outcome. That helps me make design choices that are useful, credible, and feasible to ship.",
    "I would measure completion rate, drop-off at each step, and post-test confidence to confirm the redesign improved the experience. If those indicators improve, the design is working.",
  ],
  "Data Analyst": [
    "I would begin by clarifying the business goal, identifying the stakeholders, and defining the most important KPI. Then I would turn the request into a measurable reporting plan and validate the assumptions before building the dashboard.",
    "I found an unexpected trend by comparing customer retention against campaign category and timing. I communicated the insight with a simple chart and a short business recommendation that the team could act on immediately.",
    "I focus on metrics that connect directly to decision-making, not vanity numbers. That keeps the dashboard useful for leadership and operational teams.",
    "I validate accuracy by checking data quality, reviewing assumptions, and comparing results with the original source. I also explain the limitations clearly so the audience understands the confidence level.",
  ],
  "Backend Engineer": [
    "I would design the API for resilience by separating services, using retries and circuit breakers, and adding observability for failures. I would also test for peak traffic and autoscale the critical path before release.",
    "I handled a production incident by tracing the error path, isolating the failing dependency, and rolling back the risky change. That minimized downtime and helped the team restore service quickly.",
    "I consider cost, reliability, and latency every time I choose a design. The best solution balances speed for users with long-term stability for the business.",
    "I verify safety with load tests, feature flags, rollback plans, and staged releases. That gives me confidence that the change will behave as expected under real conditions.",
  ],
};

function gradeDemoAnswer(answer, question) {
  const normalized = answer.toLowerCase();
  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  const checks = {
    specificExample: /\b(i|we|our)\b.*\b(identified|used|implemented|launched|built|reduced|improved|designed)\b/.test(normalized),
    metric: /\b\d+%\b|\b\d+\s*(ms|seconds|minutes|days|users|customers|percent|%)\b/.test(normalized),
    impact: /\b(result|outcome|impact|improved|reduced|increased|cut|saved|boosted|benefit)\b/.test(normalized),
    reasoning: /\b(because|so|to|in order to|therefore|when|then)\b/.test(normalized),
    stakeholder: /\b(team|stakeholder|client|customer|user|audience|partner)\b/.test(normalized),
    structure: /\b(first|next|then|finally|after|before)\b/.test(normalized),
    enoughLength: wordCount >= 35,
  };

  const roleKeywords = {
    "Frontend Engineer": ["react", "bundle", "performance", "render", "lazy", "loading", "memo"],
    "Product Designer": ["user", "checkout", "design", "prototype", "journey", "feedback"],
    "Data Analyst": ["metric", "dashboard", "kpi", "data", "insight", "stakeholder"],
    "Backend Engineer": ["api", "latency", "scalability", "queue", "reliability", "server"],
    "Marketing Manager": ["campaign", "conversion", "lead", "roi", "audience", "ad"],
    "Project Manager": ["stakeholder", "timeline", "priority", "release", "risk", "roadmap"],
    "UX Researcher": ["research", "interview", "insight", "prototype", "user", "design"],
  }[question.role] || [];

  const roleMatch = roleKeywords.filter((keyword) => normalized.includes(keyword)).length;

  let score = 45;
  score += checks.specificExample ? 12 : 0;
  score += checks.metric ? 14 : 0;
  score += checks.impact ? 10 : 0;
  score += checks.reasoning ? 6 : 0;
  score += checks.stakeholder ? 6 : 0;
  score += checks.structure ? 6 : 0;
  score += checks.enoughLength ? 6 : 0;
  score += Math.min(10, roleMatch * 2);

  score = Math.max(45, Math.min(98, Math.round(score)));

  const strengths = [];
  const strengthTags = [];
  if (checks.specificExample) {
    strengths.push("You gave a concrete example rather than a vague statement.");
    strengthTags.push("Concrete examples");
  }
  if (checks.metric) {
    strengths.push("You included measurable detail or a numeric outcome.");
    strengthTags.push("Measured results");
  }
  if (checks.impact) {
    strengths.push("You described the business or user impact clearly.");
    strengthTags.push("Impact focus");
  }
  if (checks.reasoning) {
    strengths.push("Your answer explained why you made the choice.");
    strengthTags.push("Clear reasoning");
  }
  if (checks.stakeholder) {
    strengths.push("You referenced the right audience or stakeholders.");
    strengthTags.push("Stakeholder awareness");
  }
  if (roleMatch >= 2) {
    strengths.push("Your answer used role-specific language that fits the prompt.");
    strengthTags.push("Role fit");
  }

  const improvements = [];
  const weaknessTags = [];
  if (!checks.metric) {
    improvements.push("Add one concrete metric or result to strengthen your answer.");
    weaknessTags.push("More metrics");
  }
  if (!checks.impact) {
    improvements.push("Explain the impact on users, revenue, or efficiency.");
    weaknessTags.push("Impact detail");
  }
  if (!checks.reasoning) {
    improvements.push("Connect your steps with why they mattered.");
    weaknessTags.push("Clearer reasoning");
  }
  if (!checks.structure) {
    improvements.push("Use a simple sequence like first, then, and finally.");
    weaknessTags.push("Better structure");
  }
  if (!checks.enoughLength) {
    improvements.push("Expand the answer slightly so it feels complete and confident.");
    weaknessTags.push("More detail");
  }

  const summary =
    score >= 85
      ? "Strong answer: you clearly explained the situation, action, and outcome with enough detail to sound prepared."
      : score >= 70
        ? "Solid answer: you have the right structure, but adding one measurable result and a sharper business impact would make it stronger."
        : "Good start: your answer is relevant, but it needs more specificity, evidence, and outcome language to sound interview-ready.";

  return {
    score,
    summary,
    strengths: strengths.length ? strengths : ["You answered the prompt directly."],
    improvements: improvements.length ? improvements : ["Keep practicing with measurable examples and a clear outcome statement."],
    strengthTags,
    weaknessTags,
    sampleAnswer: sampleAnswerBank[question.role]?.[question.index] || "",
  };
}

async function gradeAnswersWithGemini(selectedProfession, questions, answers) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }

  const prompt = `You are a professional, friendly, and expert AI Interview Coach.
Grade the candidate's answers for a mock interview for the role: "${selectedProfession}".

Here are the questions and the candidate's responses:
${questions.map((q, idx) => `
Question ${idx + 1}: ${q}
Candidate's Answer: ${answers[idx]?.answer || ""}
`).join('\n')}

Analyze their responses and evaluate their performance.
Return a structured JSON object with the exact fields below.

JSON Schema:
{
  "score": number (between 45 and 98, representing average interview score),
  "summary": string (brief, encouraging yet critical overall assessment of their interview),
  "strengths": [string] (list of 3-4 specific strengths demonstrated across the answers),
  "improvements": [string] (list of 3-4 constructive action points for improvement),
  "strengthProfile": [
    {
      "label": string (a short 1-2 word tag like "Metrics", "Structure", "Concrete Examples"),
      "count": number (number of times they displayed this strength, between 1 and 4),
      "width": number (percentage width for progress bar, between 25 and 100)
    }
  ],
  "weaknessProfile": [
    {
      "label": string (a short 1-2 word tag like "Lacks Metrics", "Vague Examples", "No Impact"),
      "count": number (number of times they showed this weakness, between 1 and 4),
      "width": number (percentage width for progress bar, between 25 and 100)
    }
  ],
  "sampleAnswers": [
    {
      "question": string (the question text),
      "answer": string (a perfect 100/100 model answer that the candidate could have given for this question, showing specific examples and metrics)
    }
  ]
}

Only return the JSON object, do not return any other text.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No response text from Gemini");
  }

  return JSON.parse(text);
}

const Icons = {
  frontend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19C3 20.66 7.03 22 12 22C16.97 22 21 20.66 21 19V5" />
      <path d="M3 12C3 13.66 7.03 15 12 15C16.97 15 21 13.66 21 12" />
    </svg>
  )
};

const professionDetails = {
  "Frontend Engineer": {
    icon: Icons.frontend,
    description: "Web optimization, rendering paths, state machines, browser performance.",
  },
  "Product Designer": {
    icon: Icons.pen,
    description: "User flows, mockup prototyping, UX research, wireframing, design systems.",
  },
  "Data Analyst": {
    icon: Icons.chart,
    description: "KPI telemetry, dashboard reporting, SQL queries, user behavior analytics.",
  },
  "Backend Engineer": {
    icon: Icons.database,
    description: "API design, scalability, queue structures, database caching, low-latency.",
  }
};

function App() {
  const [selectedProfession, setSelectedProfession] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);

  const scoreTone = useMemo(() => {
    if (!result) return "score-idle";
    return result.score >= 80 ? "score-good" : result.score >= 60 ? "score-mid" : "score-low";
  }, [result]);

  const currentQuestion = selectedProfession
    ? interviewQuestions[selectedProfession][currentQuestionIndex]
    : "";

  const progressValue = selectedProfession ? ((currentQuestionIndex + 1) / 4) * 100 : 0;
  const completedCount = selectedProfession ? Math.min(currentQuestionIndex + 1, 4) : 0;
  const remainingCount = selectedProfession ? 4 - completedCount : 4;

  const startSession = () => {
    setHasStarted(true);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
    setAnswers([]);
    setResult(null);
    setShowSampleAnswer(false);
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const nextAnswers = [...answers, { answer: currentAnswer.trim(), role: selectedProfession }];
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < interviewQuestions[selectedProfession].length) {
      setAnswers(nextAnswers);
      setCurrentAnswer("");
      setCurrentQuestionIndex(nextIndex);
      return;
    }

    setAnswers(nextAnswers);
    setLoading(true);

    try {
      const questions = interviewQuestions[selectedProfession];
      const aiResult = await gradeAnswersWithGemini(selectedProfession, questions, nextAnswers);
      setResult({
        ...aiResult,
        isAI: true,
      });
    } catch (error) {
      console.error("Gemini grading failed, falling back to local grading:", error);
      
      const scoredAnswers = nextAnswers.map((entry, index) => gradeDemoAnswer(entry.answer, { role: entry.role, index }));
      const averageScore = Math.round(scoredAnswers.reduce((sum, item) => sum + item.score, 0) / scoredAnswers.length);
      const criticism = [
        ...new Set(scoredAnswers.flatMap((item) => item.improvements).slice(0, 4)),
      ];
      const strengthProfile = Object.entries(scoredAnswers.flatMap((item) => item.strengthTags).reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label, count]) => ({ label, count, width: Math.max(18, Math.round((count / scoredAnswers.length) * 100)) }));
      const weaknessProfile = Object.entries(scoredAnswers.flatMap((item) => item.weaknessTags).reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {})).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([label, count]) => ({ label, count, width: Math.max(18, Math.round((count / scoredAnswers.length) * 100)) }));

      setResult({
        score: averageScore,
        summary: `You completed 4 questions for ${selectedProfession}. Your average score reflects how clearly you explained your experience, used evidence, and framed outcomes.`,
        strengths: scoredAnswers.flatMap((item) => item.strengths).slice(0, 4),
        improvements: criticism,
        strengthProfile,
        weaknessProfile,
        sampleAnswers: (sampleAnswerBank[selectedProfession] || []).map((ans, idx) => ({
          question: interviewQuestions[selectedProfession]?.[idx] || "",
          answer: ans
        })),
        isAI: false,
        errorMsg: error.message === "API_KEY_MISSING" ? "API key not found" : "API request failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="bg-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>
        <header className="navbar">
          <div className="nav-container">
            <div className="nav-brand">
              <svg className="nav-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="logo-text">ApexCoach</span>
              <span className="logo-beta">Beta</span>
            </div>
          </div>
        </header>
        <main className="app-shell loading-shell">
          <div className="loading-card panel">
            <div className="spinner"></div>
            <h2>AI Coach is analyzing your answers...</h2>
            <p className="muted-copy">This will take a few seconds as Gemini reviews your performance and generates tailored model answers.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="bg-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <header className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <svg className="nav-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span className="logo-text">ApexCoach</span>
            <span className="logo-beta">Beta</span>
          </div>

          <div className="nav-actions">
            <span className="user-indicator">
              <span className="dot online"></span>
              Rachit
            </span>
          </div>
        </div>
      </header>

      <main className="app-shell">
        <section className="hero-card panel clean-hero">
          <div>
            <p className="eyebrow">Interactive Engine</p>
            <h1>Elevate your mock prep with a premium AI coach.</h1>
            <p className="lede">
              Select a specialized track, answer four focused core questions, and receive deep analytical grading powered by Gemini AI.
            </p>
          </div>
        </section>

        <section className="content-grid single-column">
          <article className="panel left-panel clean-start-card">
            <div className="panel-heading-vertical">
              <p className="eyebrow">Configuration</p>
              <h2>Select your track</h2>
              <p className="panel-subtitle-copy">Choose your profession to load customized interview modules.</p>
            </div>

            <div className="profession-grid">
              {professionOptions.map((option) => {
                const details = professionDetails[option] || { icon: Icons.frontend, description: "" };
                const isActive = selectedProfession === option;
                return (
                  <button
                    type="button"
                    key={option}
                    className={`profession-card-btn ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedProfession(option);
                      setHasStarted(false);
                      setCurrentQuestionIndex(0);
                      setCurrentAnswer("");
                      setAnswers([]);
                      setResult(null);
                      setShowSampleAnswer(false);
                    }}
                  >
                    <div className="prof-card-icon-wrapper">{details.icon}</div>
                    <div className="prof-card-text">
                      <span className="prof-card-title">{option}</span>
                      <span className="prof-card-desc">{details.description}</span>
                    </div>
                    {isActive && <div className="prof-card-active-dot"></div>}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className="primary-btn start-btn-glow"
              onClick={startSession}
              disabled={!selectedProfession}
            >
              <span>Start Practice Session</span>
              <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </article>

          <article className="panel right-panel clean-session-card">
            {!selectedProfession ? (
              <div className="right-panel-preview">
                <div className="preview-grid-wrapper">
                  <div className="preview-header">
                    <p className="eyebrow">Apex Assessment Engine</p>
                    <h2>Session Focus Areas</h2>
                    <p className="muted-copy">Complete a session to get measured across four core dimensions evaluated by elite tech teams.</p>
                  </div>
                  <div className="preview-cards-grid">
                    <div className="preview-card">
                      <div className="preview-card-icon text-teal">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <h3>Behavioral Fit</h3>
                      <p>Structured checks for story pacing, context framing, and communication style.</p>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-icon text-emerald">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="16 18 22 12 16 6"></polyline>
                          <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                      </div>
                      <h3>Technical Specifics</h3>
                      <p>Evaluates domain vocabulary, terminology, and modern concepts for your specific role.</p>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-icon text-cyan">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                          <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                        </svg>
                      </div>
                      <h3>Impact & Telemetry</h3>
                      <p>Validates key metrics, business outcomes, and quantifiable data in your answers.</p>
                    </div>
                    <div className="preview-card">
                      <div className="preview-card-icon text-purple">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                      <h3>Generative AI Grading</h3>
                      <p>Leverages Gemini 2.5 Flash to provide score summaries and model answers.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : !hasStarted ? (
              <div className="empty-state track-ready-state">
                <div className="empty-state-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="eyebrow">Session configured</p>
                <h2>Ready to practice: {selectedProfession}</h2>
                <p className="muted-copy">
                  We've loaded 4 customized questions. Start the session to begin answering under mock conditions.
                </p>
                <button type="button" className="primary-btn start-btn-glow" onClick={startSession}>
                  Start Mock Session
                </button>
              </div>
            ) : result ? (
              <section className="feedback-card">
                <div className="feedback-header">
                  <div>
                    <div className="badge-row">
                      <p className="eyebrow">Final review</p>
                      <span className={`engine-badge ${result.isAI ? 'ai-badge' : 'local-badge'}`}>
                        {result.isAI ? 'Gemini AI Graded' : 'Local Rules Graded'}
                      </span>
                    </div>
                    <h3>{selectedProfession} interview summary</h3>
                  </div>
                  <span className={`score-pill ${scoreTone}`}>{result.score}/100</span>
                </div>
                {result.errorMsg && (
                  <div className="api-error-banner">
                    <span>⚠️ AI grading failed ({result.errorMsg}). Fell back to offline rules.</span>
                  </div>
                )}
                <p className="summary-copy">{result.summary}</p>
                <div className="feedback-grid">
                  <article>
                    <h4>What went well</h4>
                    <ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                  <article>
                    <h4>Criticism</h4>
                    <ul>{result.improvements.map((item) => <li key={item}>{item}</li>)}</ul>
                  </article>
                </div>

                <div className="analytics-grid">
                  <article className="analytics-card">
                    <h4>Your strength profile</h4>
                    {(result.strengthProfile || []).map((item) => (
                      <div className="bar-row" key={item.label}>
                        <span>{item.label}</span>
                        <div className="bar-track"><span className="bar-fill bar-good" style={{ width: `${item.width}%` }} /></div>
                        <strong>{item.count}x</strong>
                      </div>
                    ))}
                  </article>

                  <article className="analytics-card">
                    <h4>Your weakness profile</h4>
                    {(result.weaknessProfile || []).map((item) => (
                      <div className="bar-row" key={item.label}>
                        <span>{item.label}</span>
                        <div className="bar-track"><span className="bar-fill bar-weak" style={{ width: `${item.width}%` }} /></div>
                        <strong>{item.count}x</strong>
                      </div>
                    ))}
                  </article>

                  <article className="analytics-card">
                    <h4>Expected Answers for a 100/100 Score</h4>
                    <div className="expected-answers-list">
                      {(result.sampleAnswers || []).map((item, idx) => (
                        <div key={idx} className="expected-answer-item">
                          <p className="expected-question"><strong>Q{idx + 1}: {item.question}</strong></p>
                          <p className="expected-answer">{item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>
                <div className="button-row" style={{ marginTop: 24 }}>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setSelectedProfession("");
                      setCurrentQuestionIndex(0);
                      setCurrentAnswer("");
                      setAnswers([]);
                      setResult(null);
                      setShowSampleAnswer(false);
                    }}
                  >
                    Choose another profession
                  </button>
                </div>
              </section>
            ) : (
              <>
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Live interviewer</p>
                    <h2>{selectedProfession}</h2>
                  </div>
                  <span className="pill">Q {currentQuestionIndex + 1} / 4</span>
                </div>

                <div className="stepper-card">
                  <div className="stepper-progress-info">
                    <strong>Progress tracker</strong>
                    <span>{completedCount} done · {remainingCount} left</span>
                  </div>
                  <div className="stepper">
                    {[0, 1, 2, 3].map((idx) => {
                      const isActive = idx === currentQuestionIndex;
                      const isCompleted = idx < currentQuestionIndex;
                      return (
                        <div key={idx} className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                          <div className="step-circle">{isCompleted ? "✓" : idx + 1}</div>
                          <span className="step-label">Q{idx + 1}</span>
                          {idx < 3 && <div className="step-connector"></div>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <p className="prompt-box">{currentQuestion}</p>

                <label className="field-label" htmlFor="answer">Your answer</label>
                <textarea
                  id="answer"
                  className="answer-box"
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Answer as if you are speaking in a real interview."
                />

                <div className="button-row">
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={submitAnswer}
                    disabled={!currentAnswer.trim()}
                  >
                    {currentQuestionIndex === interviewQuestions[selectedProfession].length - 1 ? "Finish interview" : "Next question"}
                  </button>
                  <button
                    type="button"
                    className="ghost-btn"
                    onClick={() => {
                      setHasStarted(false);
                      setCurrentAnswer("");
                      setAnswers([]);
                      setCurrentQuestionIndex(0);
                      setResult(null);
                      setShowSampleAnswer(false);
                    }}
                  >
                    Restart
                  </button>
                </div>
              </>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;