import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoLiveSessions } from "@/lib/demoData";

const STORAGE_KEY = "lms_live_classes";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { sessions: demoLiveSessions };
    return { sessions: [] };
  } catch {
    return DEMO_MODE ? { sessions: demoLiveSessions } : { sessions: [] };
  }
};

export const LiveClassesContext = createContext();

export const LiveClassesProvider = ({ children }) => {
  const [sessions, setSessions] = useState(getStored().sessions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    setSessions(getStored().sessions);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getUpcomingSessions = useCallback(
    () => sessions.filter((s) => s.status === "Scheduled" && new Date(s.scheduledAt) > new Date()).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)),
    [sessions]
  );

  const value = {
    sessions,
    loading,
    error,
    getUpcomingSessions,
  };

  return <LiveClassesContext.Provider value={value}>{children}</LiveClassesContext.Provider>;
};
