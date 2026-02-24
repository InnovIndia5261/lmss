import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoSkillNodes, demoStudentSkillProgress } from "@/lib/demoData";

const STORAGE_KEY = "lms_skilltree";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { nodes: demoSkillNodes, studentProgress: demoStudentSkillProgress };
    return { nodes: [], studentProgress: [] };
  } catch {
    return DEMO_MODE ? { nodes: demoSkillNodes, studentProgress: demoStudentSkillProgress } : { nodes: [], studentProgress: [] };
  }
};

export const SkillTreeContext = createContext();

export const SkillTreeProvider = ({ children }) => {
  const [nodes, setNodes] = useState(getStored().nodes);
  const [studentProgress, setStudentProgress] = useState(getStored().studentProgress);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setNodes(s.nodes);
    setStudentProgress(s.studentProgress);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const isSkillUnlocked = useCallback(
    (skillNodeId, studentId) => {
      return studentProgress.some((p) => p.skillNodeId === skillNodeId && p.studentId === studentId && p.unlocked);
    },
    [studentProgress]
  );

  const getUnlockedCount = useCallback(
    (studentId) => studentProgress.filter((p) => p.studentId === studentId && p.unlocked).length,
    [studentProgress]
  );

  const value = {
    nodes,
    studentProgress,
    loading,
    error,
    isSkillUnlocked,
    getUnlockedCount,
  };

  return <SkillTreeContext.Provider value={value}>{children}</SkillTreeContext.Provider>;
};
