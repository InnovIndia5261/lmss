/**
 * AI Service abstraction layer.
 * Backend-ready: calls go to API, no keys in frontend.
 * VITE_AI_PROVIDER=openai | custom
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || "openai";

export const generateAIResponse = async (prompt, context = {}) => {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      body: JSON.stringify({ prompt, context, provider: AI_PROVIDER }),
    });
    const data = await response.json();
    return data?.result || null;
  } catch {
    return null;
  }
};

export const generateExamQuestions = async (topic, count, difficulty) =>
  generateAIResponse(`Generate ${count} ${difficulty} exam questions about ${topic}`, { type: "exam_questions" });

export const generateAssignmentFeedback = async (submissionText, rubric) =>
  generateAIResponse(`Provide feedback for: ${submissionText}`, { type: "feedback", rubric });

export const generatePerformanceSummary = async (scores, topics) =>
  generateAIResponse("Summarize performance", { type: "performance", scores, topics });

export const detectWeakTopics = async (attempts) =>
  generateAIResponse("Detect weak topics from attempts", { type: "weak_topics", attempts });

export const generateRecommendations = async (completedCourses, preferences) =>
  generateAIResponse("Recommend next courses", { type: "recommendations", completedCourses, preferences });
