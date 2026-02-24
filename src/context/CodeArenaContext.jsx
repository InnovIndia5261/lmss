import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoCodingProblems, demoCodeSubmissions, demoContests } from "@/lib/demoData/codeArena";

const STORAGE_KEY = "lms_codearena";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { problems: demoCodingProblems, submissions: demoCodeSubmissions, contests: demoContests };
    return { problems: [], submissions: [], contests: [] };
  } catch {
    return DEMO_MODE ? { problems: demoCodingProblems, submissions: demoCodeSubmissions, contests: demoContests } : { problems: [], submissions: [], contests: [] };
  }
};

export const CodeArenaContext = createContext();

export const CodeArenaProvider = ({ children }) => {
  const [problems, setProblems] = useState(getStored().problems);
  const [submissions, setSubmissions] = useState(getStored().submissions);
  const [contests, setContests] = useState(getStored().contests);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setProblems(s.problems);
    setSubmissions(s.submissions);
    setContests(s.contests);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    window.addEventListener("demo-data-reset", syncFromStore);
    return () => window.removeEventListener("demo-data-reset", syncFromStore);
  }, [syncFromStore]);

  const addSubmission = useCallback((sub) => {
    const current = getStored();
    const newSub = {
      problemId: sub.problemId,
      code: sub.code,
      status: sub.status,
      score: sub.score ?? 0,
      studentId: sub.studentId || "s1",
      language: sub.language || "javascript",
      _id: `cs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
    };
    const next = [...(current.submissions || []), newSub];
    const updated = { ...current, submissions: next };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSubmissions(next);
  }, []);

  const value = { problems, submissions, contests, addSubmission };

  return <CodeArenaContext.Provider value={value}>{children}</CodeArenaContext.Provider>;
};
