/**
 * AI Service abstraction layer.
 * Supports: Mock AI | OpenAI API | Custom ML endpoint
 * API-ready design - no keys in frontend.
 */

const AI_MODE = import.meta.env.VITE_AI_MODE || "mock";

const MOCK_DELAY = 800;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/* ========== MOCK IMPLEMENTATIONS ========== */

const mockGenerateLearningPath = async (input) => {
  await delay(MOCK_DELAY);
  return {
    skillGaps: [
      { skill: "Data Structures", level: "Beginner", priority: "high" },
      { skill: "Algorithms", level: "Intermediate", priority: "medium" },
    ],
    suggestedCourses: [
      { id: "c1", title: "Advanced Algorithms", relevance: 0.92 },
      { id: "c2", title: "Data Structures Mastery", relevance: 0.88 },
    ],
    estimatedTimeToMastery: "4-6 weeks",
    readinessPercent: 72,
    careerPath: "Software Engineer",
  };
};

const mockGenerateQuiz = async (lessonContent, count = 5) => {
  await delay(MOCK_DELAY);
  return {
    questions: Array.from({ length: count }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Sample question ${i + 1} based on lesson content?`,
      options: ["A", "B", "C", "D"],
      correctIndex: 0,
    })),
  };
};

const mockSummarizeLesson = async (content) => {
  await delay(MOCK_DELAY);
  return "This lesson covers key concepts. Summary: Introduction to the topic, main principles, and practical applications. Key takeaways include foundational understanding and next steps.";
};

const mockExplainConcept = async (concept) => {
  await delay(MOCK_DELAY);
  return `In simple terms: ${concept} refers to a fundamental idea that builds the foundation for deeper understanding. Think of it as the building block that connects to more advanced topics.`;
};

const mockPredictDropoutRisk = async (userId, metrics) => {
  await delay(300);
  const { inactivityDays = 0, failedExams = 0, xpGrowth = 0 } = metrics || {};
  let score = 20;
  if (inactivityDays > 14) score += 35;
  else if (inactivityDays > 7) score += 20;
  if (failedExams > 2) score += 30;
  else if (failedExams > 0) score += 15;
  if (xpGrowth < 10) score += 20;
  score = Math.min(95, score);
  return { riskScore: score, level: score > 60 ? "high" : score > 35 ? "medium" : "low" };
};

const mockAnalyzeSkillGap = async (userSkills, targetRole) => {
  await delay(MOCK_DELAY);
  return {
    gaps: [
      { skill: "React Hooks", current: 40, target: 80, priority: 1 },
      { skill: "TypeScript", current: 20, target: 70, priority: 2 },
    ],
    overallReadiness: 55,
  };
};

/* ========== API IMPLEMENTATIONS (OpenAI/Custom) ========== */

const apiGenerate = async (endpoint, body) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/ai${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("AI request failed");
  return res.json();
};

/* ========== PUBLIC API ========== */

export const generateLearningPath = async (input) => {
  if (AI_MODE === "mock") return mockGenerateLearningPath(input);
  return apiGenerate("/learning-path", input);
};

export const generateQuiz = async (lessonContent, count = 5) => {
  if (AI_MODE === "mock") return mockGenerateQuiz(lessonContent, count);
  return apiGenerate("/quiz", { lessonContent, count });
};

export const summarizeLesson = async (content) => {
  if (AI_MODE === "mock") return mockSummarizeLesson(content);
  return apiGenerate("/summarize", { content });
};

export const explainConcept = async (concept) => {
  if (AI_MODE === "mock") return mockExplainConcept(concept);
  return apiGenerate("/explain", { concept });
};

export const predictDropoutRisk = async (userId, metrics) => {
  if (AI_MODE === "mock") return mockPredictDropoutRisk(userId, metrics);
  return apiGenerate("/dropout-risk", { userId, metrics });
};

export const analyzeSkillGap = async (userSkills, targetRole) => {
  if (AI_MODE === "mock") return mockAnalyzeSkillGap(userSkills, targetRole);
  return apiGenerate("/skill-gap", { userSkills, targetRole });
};
