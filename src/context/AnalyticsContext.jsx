import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoAnalyticsSnapshots } from "@/lib/demoData/analytics";

const STORAGE_KEY = "lms_analytics";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return demoAnalyticsSnapshots;
    return [];
  } catch {
    return DEMO_MODE ? demoAnalyticsSnapshots : [];
  }
};

export const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [snapshots, setSnapshots] = useState(getStored());

  const syncFromStore = useCallback(() => setSnapshots(getStored()), []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    window.addEventListener("demo-data-reset", syncFromStore);
    return () => window.removeEventListener("demo-data-reset", syncFromStore);
  }, [syncFromStore]);

  const getSnapshot = useCallback(
    (metricType, orgId = "org-1") => snapshots.find((s) => s.organizationId === orgId && s.metricType === metricType),
    [snapshots]
  );

  const value = { snapshots, getSnapshot };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};
