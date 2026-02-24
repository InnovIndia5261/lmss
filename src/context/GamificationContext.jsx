import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import { demoXPTransactions, demoBadges, demoStudentBadges } from "@/lib/demoData";
import { getLevelFromXP, getXPProgressInLevel, getXPForNextLevel, XP_PER_LEVEL } from "@/shared/utils/xp";

const STORAGE_KEY = "lms_gamification";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { xpTransactions: demoXPTransactions, badges: demoBadges, studentBadges: demoStudentBadges };
    return { xpTransactions: [], badges: [], studentBadges: [] };
  } catch {
    return DEMO_MODE ? { xpTransactions: demoXPTransactions, badges: demoBadges, studentBadges: demoStudentBadges } : { xpTransactions: [], badges: [], studentBadges: [] };
  }
};

export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [xpTransactions, setXPTransactions] = useState(getStored().xpTransactions);
  const [badges, setBadges] = useState(getStored().badges);
  const [studentBadges, setStudentBadges] = useState(getStored().studentBadges);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setXPTransactions(s.xpTransactions);
    setBadges(s.badges);
    setStudentBadges(s.studentBadges);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getTotalXP = useCallback((studentId) => {
    return xpTransactions.filter((t) => t.studentId === studentId).reduce((a, t) => a + t.points, 0);
  }, [xpTransactions]);

  const getLeaderboard = useCallback(
    (limit = 10) => {
      const byStudent = {};
      xpTransactions.forEach((t) => {
        byStudent[t.studentId] = (byStudent[t.studentId] || 0) + t.points;
      });
      return Object.entries(byStudent)
        .map(([studentId, xp]) => ({ studentId, xp }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, limit);
    },
    [xpTransactions]
  );

  const getBadgesForStudent = useCallback(
    (studentId) => {
      const earned = studentBadges.filter((sb) => sb.studentId === studentId);
      return earned.map((sb) => badges.find((b) => b._id === sb.badgeId)).filter(Boolean);
    },
    [studentBadges, badges]
  );

  const addXP = useCallback((studentId, source, points) => {
    const newTx = { _id: `xp_${Date.now()}`, studentId, source, points, createdAt: new Date().toISOString() };
    const next = [newTx, ...xpTransactions];
    setXPTransactions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getStored(), xpTransactions: next }));
    return newTx;
  }, [xpTransactions]);

  const value = {
    xpTransactions,
    badges,
    studentBadges,
    loading,
    error,
    getTotalXP,
    getLevelFromXP,
    getXPProgressInLevel,
    getXPForNextLevel,
    XP_PER_LEVEL,
    getLeaderboard,
    getBadgesForStudent,
    addXP,
  };

  return <GamificationContext.Provider value={value}>{children}</GamificationContext.Provider>;
};
