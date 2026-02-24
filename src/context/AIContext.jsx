import React, { createContext, useState, useCallback, useContext } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import * as aiService from "@/services/aiService";
import { GamificationContext } from "@/context/GamificationContext";
import { AcademicsContext } from "@/context/AcademicsContext";

const STORAGE_KEY = "lms_ai";
const USAGE_KEY = "lms_ai_usage";

const getStoredRecommendations = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
};

const getStoredUsage = () => {
  try {
    const s = localStorage.getItem(USAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
};

const trackUsage = (userId, type, tokens = 100) => {
  const usage = getStoredUsage();
  const key = userId || "anonymous";
  if (!usage[key]) usage[key] = {};
  if (!usage[key][type]) usage[key][type] = { count: 0, tokens: 0 };
  usage[key][type].count += 1;
  usage[key][type].tokens += tokens;
  localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
};

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const { getTotalXP } = useContext(GamificationContext);
  const { enrollments, getCourseProgress } = useContext(AcademicsContext);
  const [recommendations, setRecommendations] = useState(getStoredRecommendations());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateLearningPath = useCallback(
    async (userId, userData = {}) => {
      setLoading(true);
      setError(null);
      try {
        const totalXP = getTotalXP(userId);
        const enrolled = enrollments?.filter((e) => e.studentId === userId) || [];
        const progress = enrolled.map((e) => ({
          courseId: e.courseId,
          progress: getCourseProgress?.(e.courseId, userId) || 0,
        }));
        const result = await aiService.generateLearningPath({
          totalXP,
          enrollments: enrolled.length,
          progress,
          ...userData,
        });
        const stored = { ...result, userId, generatedAt: new Date().toISOString() };
        setRecommendations(stored);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        trackUsage(userId, "learning_path", 500);
        return result;
      } catch (err) {
        setError(err.message || "Failed to generate learning path");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getTotalXP, enrollments, getCourseProgress]
  );

  const getLearningPath = useCallback((userId) => {
    const r = getStoredRecommendations();
    return r?.userId === userId ? r : null;
  }, []);

  const predictDropoutRisk = useCallback(async (userId, metrics) => {
    try {
      return await aiService.predictDropoutRisk(userId, metrics);
    } catch {
      return { riskScore: 0, level: "low" };
    }
  }, []);

  const summarizeLesson = useCallback(async (content, userId) => {
    trackUsage(userId, "summarize", 200);
    return aiService.summarizeLesson(content);
  }, []);

  const generateQuizFromLesson = useCallback(async (content, count, userId) => {
    trackUsage(userId, "quiz", 300);
    return aiService.generateQuiz(content, count);
  }, []);

  const explainConcept = useCallback(async (concept, userId) => {
    trackUsage(userId, "explain", 150);
    return aiService.explainConcept(concept);
  }, []);

  const getUsageForUser = useCallback((userId) => {
    const usage = getStoredUsage();
    return usage[userId] || {};
  }, []);

  const value = {
    recommendations,
    loading,
    error,
    generateLearningPath,
    getLearningPath,
    predictDropoutRisk,
    summarizeLesson,
    generateQuizFromLesson,
    explainConcept,
    getUsageForUser,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
