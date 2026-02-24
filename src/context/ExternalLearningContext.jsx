import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { DEMO_MODE } from "@/shared/utils/demo";
import { demoExternalPlatforms, demoExternalCourses, demoExternalClickLogs } from "@/lib/demoData/externalLearning";
import { buildAffiliateUrl } from "@/shared/utils/affiliateUrl";
import { makeApiRequest } from "@/lib/api";
import { OrganizationContext } from "@/context/OrganizationContext";

const STORAGE_KEY = "lms_external_learning";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    if (DEMO_MODE)
      return {
        platforms: demoExternalPlatforms,
        courses: demoExternalCourses,
        clickLogs: demoExternalClickLogs,
      };
    return { platforms: [], courses: [], clickLogs: [] };
  } catch {
    return DEMO_MODE
      ? { platforms: demoExternalPlatforms, courses: demoExternalCourses, clickLogs: demoExternalClickLogs }
      : { platforms: [], courses: [], clickLogs: [] };
  }
};

export const ExternalLearningContext = createContext();

export const ExternalLearningProvider = ({ children }) => {
  const { currentOrgId } = useContext(OrganizationContext);
  const [platforms, setPlatforms] = useState(getStored().platforms);
  const [courses, setCourses] = useState(getStored().courses);
  const [clickLogs, setClickLogs] = useState(getStored().clickLogs);

  const syncFromStore = useCallback(() => {
    const s = getStored();
    setPlatforms(s.platforms);
    setCourses(s.courses);
    setClickLogs(s.clickLogs);
  }, []);

  const persist = useCallback((data) => {
    const current = getStored();
    const next = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (data.platforms !== undefined) setPlatforms(data.platforms);
    if (data.courses !== undefined) setCourses(data.courses);
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

  const getCoursesByPlatform = useCallback(
    (platformId, orgId) => {
      const oid = orgId || currentOrgId;
      return courses.filter((c) => c.platformId === platformId && c.organizationId === oid);
    },
    [courses, currentOrgId]
  );

  const getCourses = useCallback(
    (orgId) => {
      const oid = orgId || currentOrgId;
      return courses.filter((c) => c.organizationId === oid);
    },
    [courses, currentOrgId]
  );

  const getFeaturedCourses = useCallback(
    (limit = 5, orgId) => {
      const oid = orgId || currentOrgId;
      return courses
        .filter((c) => c.organizationId === oid && c.isFeatured)
        .slice(0, limit);
    },
    [courses, currentOrgId]
  );

  const getPlatformById = useCallback(
    (id) => platforms.find((p) => p.id === id),
    [platforms]
  );

  const trackClick = useCallback(
    (userId, platformId, courseId) => {
      const log = {
        id: `cl-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        userId,
        platformId,
        courseId,
        clickedAt: new Date().toISOString(),
      };
      const current = getStored();
      const nextLogs = [...(current.clickLogs || []), log];
      persist({ clickLogs: nextLogs });
    },
    [persist]
  );

  const openCourseUrl = useCallback(
    (course, platform, userId) => {
      const url = buildAffiliateUrl(
        course.externalUrl,
        platform?.affiliateTag,
        platform?.affiliateTrackingEnabled
      );
      if (userId) trackClick(userId, platform?.id, course.id);
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [trackClick]
  );

  const createPlatform = useCallback(
    async (data) => {
      if (DEMO_MODE) {
        const newPlatform = {
          ...data,
          id: `ep-${Date.now()}`,
          organizationId: data.organizationId || currentOrgId,
          isActive: data.isActive ?? true,
          createdAt: new Date().toISOString(),
        };
        const current = getStored();
        const next = [...current.platforms, newPlatform];
        persist({ platforms: next });
        return { response: { data: newPlatform } };
      }
      return makeApiRequest({
        endpoint: "/external-learning/platforms",
        method: "POST",
        body: { ...data, organizationId: data.organizationId || currentOrgId },
      });
    },
    [currentOrgId, persist]
  );

  const createCourse = useCallback(
    async (data) => {
      if (DEMO_MODE) {
        const newCourse = {
          ...data,
          id: `ec-${Date.now()}`,
          organizationId: data.organizationId || currentOrgId,
          tags: data.tags || [],
          isFeatured: data.isFeatured ?? false,
          createdAt: new Date().toISOString(),
        };
        const current = getStored();
        const next = [...current.courses, newCourse];
        persist({ courses: next });
        return { response: { data: newCourse } };
      }
      return makeApiRequest({
        endpoint: "/external-learning/courses",
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
        const next = current.platforms.map((p) => (p.id === id ? { ...p, ...data } : p));
        persist({ platforms: next });
        return { response: { data: next.find((p) => p.id === id) } };
      }
      return makeApiRequest({
        endpoint: `/external-learning/platforms/${id}`,
        method: "PUT",
        body: data,
      });
    },
    [persist]
  );

  const updateCourse = useCallback(
    async (id, data) => {
      if (DEMO_MODE) {
        const current = getStored();
        const next = current.courses.map((c) => (c.id === id ? { ...c, ...data } : c));
        persist({ courses: next });
        return { response: { data: next.find((c) => c.id === id) } };
      }
      return makeApiRequest({
        endpoint: `/external-learning/courses/${id}`,
        method: "PUT",
        body: data,
      });
    },
    [persist]
  );

  const deletePlatform = useCallback(
    async (id) => {
      if (DEMO_MODE) {
        const current = getStored();
        const next = current.platforms.filter((p) => p.id !== id);
        persist({ platforms: next });
        return { response: {} };
      }
      return makeApiRequest({
        endpoint: `/external-learning/platforms/${id}`,
        method: "DELETE",
      });
    },
    [persist]
  );

  const deleteCourse = useCallback(
    async (id) => {
      if (DEMO_MODE) {
        const current = getStored();
        const next = current.courses.filter((c) => c.id !== id);
        persist({ courses: next });
        return { response: {} };
      }
      return makeApiRequest({
        endpoint: `/external-learning/courses/${id}`,
        method: "DELETE",
      });
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

  const getMostClickedCourses = useCallback(
    (limit = 5) => {
      const counts = {};
      clickLogs.forEach((l) => {
        if (l.courseId) counts[l.courseId] = (counts[l.courseId] || 0) + 1;
      });
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([courseId]) => courses.find((c) => c.id === courseId))
        .filter(Boolean);
    },
    [clickLogs, courses]
  );

  const value = {
    platforms,
    courses,
    clickLogs,
    getPlatforms,
    getCoursesByPlatform,
    getCourses,
    getFeaturedCourses,
    getPlatformById,
    trackClick,
    openCourseUrl,
    createPlatform,
    createCourse,
    updatePlatform,
    updateCourse,
    deletePlatform,
    deleteCourse,
    getMostClickedPlatforms,
    getMostClickedCourses,
    buildAffiliateUrl,
  };

  return (
    <ExternalLearningContext.Provider value={value}>
      {children}
    </ExternalLearningContext.Provider>
  );
};

export const useExternalLearning = () => {
  const ctx = useContext(ExternalLearningContext);
  if (!ctx) throw new Error("useExternalLearning must be used within ExternalLearningProvider");
  return ctx;
};
