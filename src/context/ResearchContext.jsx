import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import {
  demoResearchPlatforms,
  demoResearchResources,
  demoResearchBookmarks,
  demoResearchClickLogs,
} from "@/lib/demoData/researchHub";
import { makeApiRequest } from "@/lib/api";
import { OrganizationContext } from "@/context/OrganizationContext";

const STORAGE_KEY = "lms_research_hub";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...parsed, searchLogs: parsed.searchLogs || [] };
    }
    if (DEMO_MODE)
      return {
        platforms: demoResearchPlatforms,
        resources: demoResearchResources,
        bookmarks: demoResearchBookmarks,
        clickLogs: demoResearchClickLogs,
        searchLogs: [],
      };
    return { platforms: [], resources: [], bookmarks: [], clickLogs: [], searchLogs: [] };
  } catch {
    return DEMO_MODE
      ? {
          platforms: demoResearchPlatforms,
          resources: demoResearchResources,
          bookmarks: demoResearchBookmarks,
          clickLogs: demoResearchClickLogs,
          searchLogs: [],
        }
      : { platforms: [], resources: [], bookmarks: [], clickLogs: [], searchLogs: [] };
  }
};

export const ResearchContext = createContext();

export const ResearchProvider = ({ children }) => {
  const { currentOrgId } = useContext(OrganizationContext);
  const [platforms, setPlatforms] = useState(getStored().platforms);
  const [resources, setResources] = useState(getStored().resources);
  const [bookmarks, setBookmarks] = useState(getStored().bookmarks);
  const [clickLogs, setClickLogs] = useState(getStored().clickLogs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setPlatforms(s.platforms);
    setResources(s.resources);
    setBookmarks(s.bookmarks);
    setClickLogs(s.clickLogs);
  }, []);

  const persist = useCallback((data) => {
    const current = getStored();
    const next = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (data.platforms !== undefined) setPlatforms(data.platforms);
    if (data.resources !== undefined) setResources(data.resources);
    if (data.bookmarks !== undefined) setBookmarks(data.bookmarks);
    if (data.clickLogs !== undefined) setClickLogs(data.clickLogs);
  }, []);

  useEffect(() => {
    if (DEMO_MODE) syncFromStore();
  }, []);

  useEffect(() => {
    window.addEventListener("demo-data-reset", syncFromStore);
    return () => window.removeEventListener("demo-data-reset", syncFromStore);
  }, [syncFromStore]);

  const getPlatforms = useCallback(
    (orgId) => {
      const oid = orgId || currentOrgId;
      return platforms.filter((p) => p.organizationId === oid && p.isActive);
    },
    [platforms, currentOrgId]
  );

  const getPlatformById = useCallback((id) => platforms.find((p) => p.id === id), [platforms]);

  const getResources = useCallback(
    (orgId) => {
      const oid = orgId || currentOrgId;
      return resources.filter((r) => r.organizationId === oid);
    },
    [resources, currentOrgId]
  );

  const getResourcesByPlatform = useCallback(
    (platformId, orgId) => {
      const oid = orgId || currentOrgId;
      return resources.filter((r) => r.platformId === platformId && r.organizationId === oid);
    },
    [resources, currentOrgId]
  );

  const trackSearch = useCallback((keyword) => {
    if (!keyword?.trim() || !DEMO_MODE) return;
    const current = getStored();
    const log = { keyword: keyword.trim(), searchedAt: new Date().toISOString() };
    const nextLogs = [...(current.searchLogs || []), log];
    const next = { ...current, searchLogs: nextLogs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const searchResources = useCallback(
    (filters = {}) => {
      const { keyword = "", category = "", platformId = "", year = "" } = filters;
      const oid = currentOrgId;
      return resources.filter((r) => {
        if (r.organizationId !== oid) return false;
        if (platformId && r.platformId !== platformId) return false;
        if (category && r.category !== category) return false;
        if (year && String(r.publishedYear) !== String(year)) return false;
        if (keyword) {
          const k = keyword.toLowerCase();
          const matchTitle = (r.title || "").toLowerCase().includes(k);
          const matchAbstract = (r.abstract || "").toLowerCase().includes(k);
          const matchAuthors = (r.authors || []).some((a) => String(a).toLowerCase().includes(k));
          const matchTags = (r.tags || []).some((t) => String(t).toLowerCase().includes(k));
          if (!matchTitle && !matchAbstract && !matchAuthors && !matchTags) return false;
        }
        return true;
      });
    },
    [resources, currentOrgId]
  );

  const getFeaturedResources = useCallback(
    (limit = 6, orgId) => {
      const oid = orgId || currentOrgId;
      return resources
        .filter((r) => r.organizationId === oid && r.isFeatured)
        .slice(0, limit);
    },
    [resources, currentOrgId]
  );

  const bookmarkResource = useCallback(
    (userId, resourceId) => {
      const exists = bookmarks.some((b) => b.userId === userId && b.resourceId === resourceId);
      if (exists) return;
      const newBookmark = {
        id: `rb-${Date.now()}`,
        userId,
        resourceId,
        savedAt: new Date().toISOString(),
      };
      const current = getStored();
      persist({ bookmarks: [...(current.bookmarks || []), newBookmark] });
    },
    [bookmarks, persist]
  );

  const removeBookmark = useCallback(
    (userId, resourceId) => {
      const current = getStored();
      const next = (current.bookmarks || []).filter(
        (b) => !(b.userId === userId && b.resourceId === resourceId)
      );
      persist({ bookmarks: next });
    },
    [persist]
  );

  const isBookmarked = useCallback(
    (userId, resourceId) =>
      bookmarks.some((b) => b.userId === userId && b.resourceId === resourceId),
    [bookmarks]
  );

  const getBookmarkedResources = useCallback(
    (userId) => {
      const ids = bookmarks.filter((b) => b.userId === userId).map((b) => b.resourceId);
      return resources.filter((r) => ids.includes(r.id));
    },
    [bookmarks, resources]
  );

  const trackClick = useCallback(
    (userId, platformId, resourceId) => {
      const log = {
        id: `rcl-${Date.now()}`,
        userId,
        platformId,
        resourceId,
        clickedAt: new Date().toISOString(),
      };
      const current = getStored();
      persist({ clickLogs: [...(current.clickLogs || []), log] });
    },
    [persist]
  );

  const openResourceUrl = useCallback(
    (resource, platform, userId) => {
      if (userId) trackClick(userId, platform?.id, resource.id);
      window.open(resource.externalUrl, "_blank", "noopener,noreferrer");
    },
    [trackClick]
  );

  const createPlatform = useCallback(
    async (data) => {
      if (DEMO_MODE) {
        const newPlatform = {
          ...data,
          id: `rp-${Date.now()}`,
          organizationId: data.organizationId || currentOrgId,
          isActive: data.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const current = getStored();
        persist({ platforms: [...(current.platforms || []), newPlatform] });
        return { response: { data: newPlatform } };
      }
      return makeApiRequest({
        endpoint: "/research/platforms",
        method: "POST",
        body: { ...data, organizationId: data.organizationId || currentOrgId },
      });
    },
    [currentOrgId, persist]
  );

  const createResource = useCallback(
    async (data) => {
      if (DEMO_MODE) {
        const newResource = {
          ...data,
          id: `rr-${Date.now()}`,
          organizationId: data.organizationId || currentOrgId,
          authors: data.authors || [],
          tags: data.tags || [],
          isFeatured: data.isFeatured ?? false,
          createdAt: new Date().toISOString(),
        };
        const current = getStored();
        persist({ resources: [...(current.resources || []), newResource] });
        return { response: { data: newResource } };
      }
      return makeApiRequest({
        endpoint: "/research/resources",
        method: "POST",
        body: { ...data, organizationId: data.organizationId || currentOrgId },
      });
    },
    [currentOrgId, persist]
  );

  const updatePlatform = useCallback(
    async (id, data) => {
      if (DEMO_MODE) {
        const current = getStored();
        const next = (current.platforms || []).map((p) =>
          p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
        );
        persist({ platforms: next });
        return { response: {} };
      }
      return makeApiRequest({ endpoint: `/research/platforms/${id}`, method: "PUT", body: data });
    },
    [persist]
  );

  const updateResource = useCallback(
    async (id, data) => {
      if (DEMO_MODE) {
        const current = getStored();
        const next = (current.resources || []).map((r) => (r.id === id ? { ...r, ...data } : r));
        persist({ resources: next });
        return { response: {} };
      }
      return makeApiRequest({ endpoint: `/research/resources/${id}`, method: "PUT", body: data });
    },
    [persist]
  );

  const deletePlatform = useCallback(
    async (id) => {
      if (DEMO_MODE) {
        const current = getStored();
        persist({ platforms: (current.platforms || []).filter((p) => p.id !== id) });
        return { response: {} };
      }
      return makeApiRequest({ endpoint: `/research/platforms/${id}`, method: "DELETE" });
    },
    [persist]
  );

  const deleteResource = useCallback(
    async (id) => {
      if (DEMO_MODE) {
        const current = getStored();
        persist({ resources: (current.resources || []).filter((r) => r.id !== id) });
        return { response: {} };
      }
      return makeApiRequest({ endpoint: `/research/resources/${id}`, method: "DELETE" });
    },
    [persist]
  );

  const getMostClickedPlatforms = useCallback(
    (limit = 5) => {
      const counts = {};
      clickLogs.forEach((l) => {
        if (l.platformId) counts[l.platformId] = (counts[l.platformId] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([platformId]) => platforms.find((p) => p.id === platformId))
        .filter(Boolean);
    },
    [clickLogs, platforms]
  );

  const getMostSearchedKeywords = useCallback(
    (limit = 10) => {
      const searchLogs = getStored().searchLogs || [];
      const counts = {};
      searchLogs.forEach((s) => {
        const k = (s.keyword || "").trim().toLowerCase();
        if (k) counts[k] = (counts[k] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([keyword, count]) => ({ keyword, count }));
    },
    []
  );

  const getMostBookmarkedResources = useCallback(
    (limit = 10) => {
      const counts = {};
      bookmarks.forEach((b) => {
        if (b.resourceId) counts[b.resourceId] = (counts[b.resourceId] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([resourceId]) => resources.find((r) => r.id === resourceId))
        .filter(Boolean);
    },
    [bookmarks, resources]
  );

  const value = {
    platforms,
    resources,
    bookmarks,
    clickLogs,
    loading,
    error,
    setLoading,
    setError,
    getPlatforms,
    getPlatformById,
    getResources,
    getResourcesByPlatform,
    searchResources,
    getFeaturedResources,
    bookmarkResource,
    removeBookmark,
    isBookmarked,
    getBookmarkedResources,
    trackClick,
    trackSearch,
    openResourceUrl,
    createPlatform,
    createResource,
    updatePlatform,
    updateResource,
    deletePlatform,
    deleteResource,
    getMostClickedPlatforms,
    getMostSearchedKeywords,
    getMostBookmarkedResources,
  };

  return <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>;
};

export const useResearch = () => {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error("useResearch must be used within ResearchProvider");
  return ctx;
};
