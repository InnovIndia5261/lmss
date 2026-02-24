import React, { createContext, useState, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoSaaSMetrics } from "@/lib/demoData/saasMetrics";

const STORAGE_KEY = "lms_saas_metrics";

const getStored = () => {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
    return DEMO_MODE ? demoSaaSMetrics : null;
  } catch {
    return DEMO_MODE ? demoSaaSMetrics : null;
  }
};

export const SaaSAnalyticsContext = createContext();

export const SaaSAnalyticsProvider = ({ children }) => {
  const [metrics, setMetrics] = useState(getStored());
  const [loading, setLoading] = useState(false);

  const getMRR = useCallback(() => metrics?.mrr ?? 0, [metrics]);
  const getARR = useCallback(() => metrics?.arr ?? 0, [metrics]);
  const getActiveUsers = useCallback(() => metrics?.activeUsers ?? 0, [metrics]);
  const getChurnRate = useCallback(() => metrics?.churnRate ?? 0, [metrics]);
  const getPlanDistribution = useCallback(() => metrics?.planDistribution ?? [], [metrics]);
  const getFeatureUsage = useCallback(() => metrics?.featureUsage ?? [], [metrics]);
  const getOrgMetrics = useCallback(() => metrics?.organizations ?? [], [metrics]);
  const getTrends = useCallback(() => metrics?.trends ?? {}, [metrics]);

  const exportCSV = useCallback(() => {
    const rows = [
      ["Metric", "Value"],
      ["MRR", getMRR()],
      ["ARR", getARR()],
      ["Active Users", getActiveUsers()],
      ["Churn Rate %", getChurnRate()],
      ...(getPlanDistribution().map((p) => [p.plan, `${p.count} seats, $${p.revenue}`])),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saas-metrics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getMRR, getARR, getActiveUsers, getChurnRate, getPlanDistribution]);

  const value = {
    metrics,
    loading,
    getMRR,
    getARR,
    getActiveUsers,
    getChurnRate,
    getPlanDistribution,
    getFeatureUsage,
    getOrgMetrics,
    getTrends,
    exportCSV,
  };

  return <SaaSAnalyticsContext.Provider value={value}>{children}</SaaSAnalyticsContext.Provider>;
};
