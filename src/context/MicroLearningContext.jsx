import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoFlashcards, demoSpacedRepetitionLogs } from "@/lib/demoData/flashcards";
import { calculateNextReviewDate, QUALITY } from "@/shared/utils/spacedRepetition";

const STORAGE_KEY = "lms_microlearning";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { flashcards: demoFlashcards, logs: demoSpacedRepetitionLogs };
    return { flashcards: [], logs: [] };
  } catch {
    return DEMO_MODE ? { flashcards: demoFlashcards, logs: demoSpacedRepetitionLogs } : { flashcards: [], logs: [] };
  }
};

export const MicroLearningContext = createContext();

export const MicroLearningProvider = ({ children }) => {
  const [flashcards, setFlashcards] = useState(getStored().flashcards);
  const [logs, setLogs] = useState(getStored().logs);
  const [loading, setLoading] = useState(false);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setFlashcards(s.flashcards);
    setLogs(s.logs);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    window.addEventListener("demo-data-reset", syncFromStore);
    return () => window.removeEventListener("demo-data-reset", syncFromStore);
  }, [syncFromStore]);

  const getDueToday = useCallback(
    (studentId) => {
      const today = new Date().toDateString();
      return flashcards.filter((fc) => {
        const reviewDate = new Date(fc.nextReviewDate).toDateString();
        return reviewDate <= today;
      });
    },
    [flashcards]
  );

  const markReview = useCallback(
    (flashcardId, studentId, result) => {
      const fc = flashcards.find((f) => f._id === flashcardId);
      if (!fc) return;
      const quality = QUALITY[result] ?? 2;
      const { nextInterval, nextEasiness, nextRepetition, nextReviewDate } = calculateNextReviewDate(
        quality,
        fc.intervalDays,
        fc.easinessFactor ?? 2.5,
        fc.repetitionCount
      );
      const updated = flashcards.map((f) =>
        f._id === flashcardId
          ? { ...f, nextReviewDate, intervalDays: nextInterval, repetitionCount: nextRepetition }
          : f
      );
      setFlashcards(updated);
      const newLog = { _id: `srl_${Date.now()}`, studentId, flashcardId, result, reviewedAt: new Date().toISOString() };
      setLogs((p) => {
        const next = [...p, newLog];
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ flashcards: updated, logs: next }));
        return next;
      });
    },
    [flashcards]
  );

  const dueCount = useCallback(
    (studentId) => getDueToday(studentId).length,
    [getDueToday]
  );

  const value = { flashcards, logs, getDueToday, markReview, dueCount };

  return <MicroLearningContext.Provider value={value}>{children}</MicroLearningContext.Provider>;
};
