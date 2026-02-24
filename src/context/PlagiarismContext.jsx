import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoPlagiarismReports } from "@/lib/demoData";
import { calculateSimilarity, DEFAULT_SIMILARITY_THRESHOLD } from "@/shared/utils/plagiarism";

const STORAGE_KEY = "lms_plagiarism";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { reports: demoPlagiarismReports };
    return { reports: [] };
  } catch {
    return DEMO_MODE ? { reports: demoPlagiarismReports } : { reports: [] };
  }
};

export const PlagiarismContext = createContext();

export const PlagiarismProvider = ({ children }) => {
  const [reports, setReports] = useState(getStored().reports);
  const [threshold, setThreshold] = useState(DEFAULT_SIMILARITY_THRESHOLD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    setReports(getStored().reports);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getFlaggedReports = useCallback(
    () => reports.filter((r) => r.flagged),
    [reports]
  );

  const getReportBySubmission = useCallback(
    (submissionId) => reports.find((r) => r.submissionId === submissionId),
    [reports]
  );

  const value = {
    reports,
    threshold,
    setThreshold,
    loading,
    error,
    getFlaggedReports,
    getReportBySubmission,
    calculateSimilarity,
  };

  return <PlagiarismContext.Provider value={value}>{children}</PlagiarismContext.Provider>;
};
