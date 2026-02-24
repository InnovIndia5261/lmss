import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import { demoPerformanceProfiles } from "@/lib/demoData";

const STORAGE_KEY = "lms_performance";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { profiles: demoPerformanceProfiles };
    return { profiles: [] };
  } catch {
    return DEMO_MODE ? { profiles: demoPerformanceProfiles } : { profiles: [] };
  }
};

export const PerformanceContext = createContext();

export const PerformanceProvider = ({ children }) => {
  const [profiles, setProfiles] = useState(getStored().profiles);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    setProfiles(getStored().profiles);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getProfileByStudent = useCallback(
    (studentId) => profiles.find((p) => p.studentId === studentId),
    [profiles]
  );

  const getRiskStudents = useCallback(
    () => profiles.filter((p) => p.riskLevel === "High" || p.riskLevel === "Medium"),
    [profiles]
  );

  const value = {
    profiles,
    loading,
    error,
    getProfileByStudent,
    getRiskStudents,
  };

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};
