import React, { createContext, useState, useEffect, useCallback } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { makeApiRequest } from "@/lib/api";
import { demoOrganizations } from "@/lib/demoData/organizations";

const STORAGE_KEY = "lms_organizations";
const ORG_ID = "org-1";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE) return demoOrganizations;
    return [];
  } catch {
    return DEMO_MODE ? demoOrganizations : [];
  }
};

export const OrganizationContext = createContext();

export const OrganizationProvider = ({ children }) => {
  const [organizations, setOrganizations] = useState(getStored());
  const [currentOrgId, setCurrentOrgId] = useState(ORG_ID);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    setOrganizations(getStored());
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    const handleReset = () => syncFromStore();
    window.addEventListener("demo-data-reset", handleReset);
    return () => window.removeEventListener("demo-data-reset", handleReset);
  }, [syncFromStore]);

  const currentOrg = organizations.find((o) => o._id === currentOrgId) || organizations[0];

  const getOrgById = useCallback(
    (id) => organizations.find((o) => o._id === id),
    [organizations]
  );

  const hasFeatureFlag = useCallback(
    (flag, orgId) => {
      const org = orgId ? getOrgById(orgId) : currentOrg;
      return org?.featureFlags?.[flag] ?? false;
    },
    [currentOrg, getOrgById]
  );

  const value = {
    organizations,
    currentOrg,
    currentOrgId,
    setCurrentOrgId,
    loading,
    error,
    getOrgById,
    hasFeatureFlag,
  };

  return <OrganizationContext.Provider value={value}>{children}</OrganizationContext.Provider>;
};
