import { DEMO_MODE } from "@/shared/utils/demo";
import {
  demoCourses,
  demoLessons,
  demoAssignments,
  demoSubmissions,
  demoExams,
  demoQuestions,
  demoEnrollments,
  demoLessonCompletions,
  demoExamAttempts,
  demoPerformanceProfiles,
  demoXPTransactions,
  demoBadges,
  demoStudentBadges,
  demoSkillNodes,
  demoStudentSkillProgress,
  demoLiveSessions,
  demoPlagiarismReports,
  demoCertificates,
} from "./index";
import { demoOrganizationSubscriptions, demoUsageTracking } from "./subscriptions";
import { demoOrganizations } from "./organizations";
import { demoFlashcards, demoSpacedRepetitionLogs } from "./flashcards";
import { demoCodingProblems, demoCodeSubmissions, demoContests } from "./codeArena";
import { demoAnalyticsSnapshots } from "./analytics";
import { demoExternalPlatforms, demoExternalCourses, demoExternalClickLogs } from "./externalLearning";
import {
  demoResearchPlatforms,
  demoResearchResources,
  demoResearchBookmarks,
  demoResearchClickLogs,
} from "./researchHub";
import { demoCommunityPosts, demoComments, demoReputation, demoMentors, demoFollows } from "./community";
import { demoSaaSMetrics } from "./saasMetrics";

const STORAGE_KEYS = {
  academics: "lms_academics",
  performance: "lms_performance",
  gamification: "lms_gamification",
  skillTree: "lms_skilltree",
  liveClasses: "lms_live_classes",
  plagiarism: "lms_plagiarism",
  certificates: "lms_certificates",
  subscriptions: "lms_subscriptions",
  organizations: "lms_organizations",
  microlearning: "lms_microlearning",
  codearena: "lms_codearena",
  analytics: "lms_analytics",
  externalLearning: "lms_external_learning",
  researchHub: "lms_research_hub",
  community: "lms_community",
  ai: "lms_ai",
  aiUsage: "lms_ai_usage",
  saasMetrics: "lms_saas_metrics",
};

const getInitialAcademics = () => ({
  courses: demoCourses,
  lessons: demoLessons,
  assignments: demoAssignments,
  submissions: demoSubmissions,
  exams: demoExams,
  questions: demoQuestions,
  enrollments: demoEnrollments,
  lessonCompletions: demoLessonCompletions,
  examAttempts: demoExamAttempts,
});

const getInitialPerformance = () => ({
  profiles: demoPerformanceProfiles,
});

const getInitialGamification = () => ({
  xpTransactions: demoXPTransactions,
  badges: demoBadges,
  studentBadges: demoStudentBadges,
});

const getInitialSkillTree = () => ({
  nodes: demoSkillNodes,
  studentProgress: demoStudentSkillProgress,
});

const getInitialLiveClasses = () => ({
  sessions: demoLiveSessions,
});

const getInitialPlagiarism = () => ({
  reports: demoPlagiarismReports,
});

const getInitialCertificates = () => ({
  certificates: demoCertificates,
});

const getInitialSubscriptions = () => ({
  subscriptions: demoOrganizationSubscriptions,
  usage: demoUsageTracking,
});

const getInitialOrganizations = () => demoOrganizations;

const getInitialMicrolearning = () => ({
  flashcards: demoFlashcards,
  logs: demoSpacedRepetitionLogs,
});

const getInitialCodeArena = () => ({
  problems: demoCodingProblems,
  submissions: demoCodeSubmissions,
  contests: demoContests,
});

const getInitialAnalytics = () => demoAnalyticsSnapshots;

const getInitialExternalLearning = () => ({
  platforms: demoExternalPlatforms,
  courses: demoExternalCourses,
  clickLogs: demoExternalClickLogs,
});

const getInitialResearchHub = () => ({
  platforms: demoResearchPlatforms,
  resources: demoResearchResources,
  bookmarks: demoResearchBookmarks,
  clickLogs: demoResearchClickLogs,
  searchLogs: [],
});

const getInitialCommunity = () => ({
  posts: demoCommunityPosts,
  comments: demoComments,
  reputation: demoReputation,
  mentors: demoMentors,
  follows: demoFollows,
});

export const resetDemoData = () => {
  if (!DEMO_MODE) return;
  localStorage.setItem(STORAGE_KEYS.academics, JSON.stringify(getInitialAcademics()));
  localStorage.setItem(STORAGE_KEYS.performance, JSON.stringify(getInitialPerformance()));
  localStorage.setItem(STORAGE_KEYS.gamification, JSON.stringify(getInitialGamification()));
  localStorage.setItem(STORAGE_KEYS.skillTree, JSON.stringify(getInitialSkillTree()));
  localStorage.setItem(STORAGE_KEYS.liveClasses, JSON.stringify(getInitialLiveClasses()));
  localStorage.setItem(STORAGE_KEYS.plagiarism, JSON.stringify(getInitialPlagiarism()));
  localStorage.setItem(STORAGE_KEYS.certificates, JSON.stringify(getInitialCertificates()));
  localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(getInitialSubscriptions()));
  localStorage.setItem(STORAGE_KEYS.organizations, JSON.stringify(getInitialOrganizations()));
  localStorage.setItem(STORAGE_KEYS.microlearning, JSON.stringify(getInitialMicrolearning()));
  localStorage.setItem(STORAGE_KEYS.codearena, JSON.stringify(getInitialCodeArena()));
  localStorage.setItem(STORAGE_KEYS.analytics, JSON.stringify(getInitialAnalytics()));
  localStorage.setItem(STORAGE_KEYS.externalLearning, JSON.stringify(getInitialExternalLearning()));
  localStorage.setItem(STORAGE_KEYS.researchHub, JSON.stringify(getInitialResearchHub()));
  localStorage.setItem(STORAGE_KEYS.community, JSON.stringify(getInitialCommunity()));
  localStorage.setItem(STORAGE_KEYS.saasMetrics, JSON.stringify(demoSaaSMetrics));
  localStorage.removeItem(STORAGE_KEYS.ai);
  localStorage.removeItem(STORAGE_KEYS.aiUsage);
  window.dispatchEvent(new CustomEvent("demo-data-reset"));
  window.location.reload();
};
