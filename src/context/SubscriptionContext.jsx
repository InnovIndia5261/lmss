import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import { demoPlans } from "@/lib/demoData/plans";
import { demoOrganizationSubscriptions, demoUsageTracking } from "@/lib/demoData/subscriptions";

const STORAGE_KEY = "lms_subscriptions";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return { subscriptions: demoOrganizationSubscriptions, usage: demoUsageTracking };
    return { subscriptions: [], usage: [] };
  } catch {
    return DEMO_MODE ? { subscriptions: demoOrganizationSubscriptions, usage: demoUsageTracking } : { subscriptions: [], usage: [] };
  }
};

export const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(getStored().subscriptions);
  const [usage, setUsage] = useState(getStored().usage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const plans = demoPlans;

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setSubscriptions(s.subscriptions);
    setUsage(s.usage);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const getSubscription = useCallback(
    (orgId = ORG_ID) => subscriptions.find((s) => s.organizationId === orgId),
    [subscriptions]
  );

  const getPlan = useCallback(
    (planId) => plans.find((p) => p._id === planId),
    [plans]
  );

  const getUsage = useCallback(
    (orgId, metric) => usage.find((u) => u.organizationId === orgId && u.metric === metric),
    [usage]
  );

  const isWithinLimit = useCallback(
    (orgId, metric, increment = 0) => {
      const u = getUsage(orgId, metric);
      const sub = getSubscription(orgId);
      const plan = sub ? getPlan(sub.planId) : null;
      if (!plan) return true;
      const limit = metric === "Users" ? plan.maxUsers : metric === "Courses" ? plan.maxCourses : plan.maxStorageMB;
      if (limit === -1) return true;
      const current = (u?.currentValue ?? 0) + increment;
      return current <= limit;
    },
    [getUsage, getSubscription, getPlan]
  );

  const getUsagePercent = useCallback(
    (orgId, metric) => {
      const u = getUsage(orgId, metric);
      const sub = getSubscription(orgId);
      const plan = sub ? getPlan(sub.planId) : null;
      if (!plan || !u) return 0;
      const limit = metric === "Users" ? plan.maxUsers : metric === "Courses" ? plan.maxCourses : plan.maxStorageMB;
      if (limit === -1) return 0;
      return Math.round((u.currentValue / limit) * 100);
    },
    [getUsage, getSubscription, getPlan]
  );

  const hasFeature = useCallback(
    (feature, orgId = ORG_ID) => {
      const sub = getSubscription(orgId);
      const plan = sub ? getPlan(sub.planId) : null;
      if (!plan) return false;
      const featureMap = { analytics: "plan-pro", liveClasses: "plan-pro", codeArena: "plan-pro", microLearning: "plan-starter" };
      const requiredPlan = featureMap[feature];
      if (!requiredPlan) return true;
      const order = ["plan-free", "plan-starter", "plan-pro", "plan-enterprise"];
      return order.indexOf(plan._id) >= order.indexOf(requiredPlan);
    },
    [getSubscription, getPlan]
  );

  const value = {
    plans,
    subscriptions,
    usage,
    loading,
    error,
    getSubscription,
    getPlan,
    getUsage,
    isWithinLimit,
    getUsagePercent,
    hasFeature,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
};
