import React, { lazy, Suspense } from "react";

import { Route, Routes } from "react-router";
import Layout from "./Layout";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "../components/NotFoundPage";
import Loader from "../components/common/Loader";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const Transactions = lazy(() => import("../pages/Transactions"));
const Members = lazy(() => import("../pages/Members"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const Reports = lazy(() => import("../pages/Reports"));
const Favorites = lazy(() => import("../pages/Favorites"));
const CoursesPage = lazy(() => import("../features/courses/CoursesPage"));
const CourseDetailPage = lazy(() => import("../features/courses/CourseDetailPage"));
const CreateCoursePage = lazy(() => import("../features/courses/CreateCoursePage"));
const MyLearningPage = lazy(() => import("../features/courses/MyLearningPage"));
const AssignmentDetailPage = lazy(() => import("../features/assignments/AssignmentDetailPage"));
const ExamAttemptPage = lazy(() => import("../features/exams/ExamAttemptPage"));
const LeaderboardPage = lazy(() => import("../features/gamification/LeaderboardPage"));
const SkillTreePage = lazy(() => import("../features/skillTree/SkillTreePage"));
const LiveClassesPage = lazy(() => import("../features/liveClasses/LiveClassesPage"));
const PlagiarismReviewPage = lazy(() => import("../features/plagiarism/PlagiarismReviewPage"));
const CertificateVerifyPage = lazy(() => import("../features/certificates/CertificateVerifyPage"));
const PricingPage = lazy(() => import("../features/pricing/PricingPage"));
const DailyReviewPage = lazy(() => import("../features/microLearning/DailyReviewPage"));
const CodeArenaPage = lazy(() => import("../features/codeArena/CodeArenaPage"));
const AdminAnalyticsPage = lazy(() => import("../features/analytics/AdminAnalyticsPage"));
const ExternalLearningPage = lazy(() => import("../features/externalLearning/ExternalLearningPage"));
const ExternalPlatformDetailPage = lazy(() => import("../features/externalLearning/ExternalPlatformDetailPage"));
const ExternalLearningAdminPage = lazy(() => import("../features/externalLearning/ExternalLearningAdminPage"));
const ResearchPage = lazy(() => import("../features/researchHub/ResearchPage"));
const ResearchPlatformDetailPage = lazy(() => import("../features/researchHub/ResearchPlatformDetailPage"));
const MyResearchPage = lazy(() => import("../features/researchHub/MyResearchPage"));
const ResearchAdminPage = lazy(() => import("../features/researchHub/ResearchAdminPage"));
const AIInsightsDashboard = lazy(() => import("../features/ai/AIInsightsDashboard"));
const MetricsDashboard = lazy(() => import("../features/saasMetrics/MetricsDashboard"));
const CommunityPage = lazy(() => import("../features/community/CommunityPage"));
const CommunityCoursePage = lazy(() => import("../features/community/CommunityCoursePage"));
const OrganizationInsightsDashboard = lazy(() => import("../features/organization/OrganizationInsightsDashboard"));

const PageRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<ProtectedRoutes />}>
            <Route index element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/members" element={<Members />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/new" element={<CreateCoursePage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/courses/:courseId/assignments/:assignmentId" element={<AssignmentDetailPage />} />
            <Route path="/courses/:courseId/exams/:examId" element={<ExamAttemptPage />} />
            <Route path="/my-learning" element={<MyLearningPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/skill-tree" element={<SkillTreePage />} />
            <Route path="/live-classes" element={<LiveClassesPage />} />
            <Route path="/plagiarism" element={<PlagiarismReviewPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/daily-review" element={<DailyReviewPage />} />
            <Route path="/code-arena" element={<CodeArenaPage />} />
            <Route path="/external-learning" element={<ExternalLearningPage />} />
            <Route path="/external-learning/:platformId" element={<ExternalPlatformDetailPage />} />
            <Route path="/admin/external-learning" element={<ExternalLearningAdminPage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/research/:platformId" element={<ResearchPlatformDetailPage />} />
            <Route path="/my-research" element={<MyResearchPage />} />
            <Route path="/admin/research" element={<ResearchAdminPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/saas-metrics" element={<MetricsDashboard />} />
            <Route path="/admin/organizations/:id/insights" element={<OrganizationInsightsDashboard />} />
            <Route path="/ai-insights" element={<AIInsightsDashboard />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:courseId" element={<CommunityCoursePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/favorites" element={<Favorites />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify/:code" element={<CertificateVerifyPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default PageRoutes;
