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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
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
      <main className="app-shell loading-shell">
        <div className="loading-card panel">
          <div className="spinner"></div>
          <h2>AI Coach is analyzing your answers...</h2>
          <p className="muted-copy">This will take a few seconds as Gemini reviews your performance and generates tailored model answers.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-card panel clean-hero">
        <div>
          <p className="eyebrow">AI Interview Coach</p>
          <h1>Practice interviews with a calm, professional coaching experience.</h1>
          <p className="lede">
            Select a role, answer four focused questions, and receive a clear final review tailored to your professional profile.
          </p>
        </div>
      </section>

      <section className="content-grid single-column">
        <article className="panel left-panel clean-start-card">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Start here</p>
              <h2>Choose your profession</h2>
            </div>
            <span className="pill">Clean mode</span>
          </div>

          <div className="start-card-stack">
            <label className="field-label" htmlFor="profession">Profession</label>
            <select
              id="profession"
              className="answer-box select-box"
              value={selectedProfession}
            onChange={(e) => {
              setSelectedProfession(e.target.value);
              setHasStarted(false);
              setCurrentQuestionIndex(0);
              setCurrentAnswer("");
              setAnswers([]);
              setResult(null);
              setShowSampleAnswer(false);
            }}
          >
            <option value="">Select a profession</option>
              {professionOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="primary-btn start-btn"
            onClick={startSession}
            disabled={!selectedProfession}
          >
            Start interview
          </button>
        </article>

        <article className="panel right-panel clean-session-card">
          {!selectedProfession ? (
            <div className="empty-state">
              <p className="eyebrow">Ready</p>
              <h2>Select a profession to begin your interview session.</h2>
              <p className="muted-copy">The coach will ask four focused questions, one at a time, and then give you a final score and criticism.</p>
            </div>
          ) : !hasStarted ? (
            <div className="empty-state">
              <p className="eyebrow">Session ready</p>
              <h2>You selected {selectedProfession}.</h2>
              <p className="muted-copy">Press start to begin the four-question interview and receive your final review afterward.</p>
              <button type="button" className="primary-btn" onClick={startSession}>Start interview</button>
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
              <div className="button-row" style={{ marginTop: 10 }}>
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

              <div className="progress-card">
                <div className="progress-copy">
                  <strong>Progress tracker</strong>
                  <span>{completedCount} done · {remainingCount} left</span>
                </div>
                <div className="progress-track"><span style={{ width: `${progressValue}%` }} /></div>
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
  );
}

export default App;