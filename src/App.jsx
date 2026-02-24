import React from "react";
import { BrowserRouter } from "react-router";
import PageRoutes from "./routes/Routes";
import AuthProvider from "./context/AuthContext";
import MembersProvider from "./context/MembersContext";
import { BooksProvider } from "./context/BooksContext";
import { AcademicsProvider } from "./context/AcademicsContext";
import { PerformanceProvider } from "./context/PerformanceContext";
import { GamificationProvider } from "./context/GamificationContext";
import { SkillTreeProvider } from "./context/SkillTreeContext";
import { LiveClassesProvider } from "./context/LiveClassesContext";
import { CertificateProvider } from "./context/CertificateContext";
import { PlagiarismProvider } from "./context/PlagiarismContext";
import { OrganizationProvider } from "./context/OrganizationContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { MicroLearningProvider } from "./context/MicroLearningContext";
import { CodeArenaProvider } from "./context/CodeArenaContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { ExternalLearningProvider } from "./context/ExternalLearningContext";
import { ResearchProvider } from "./context/ResearchContext";
import { AIProvider } from "./context/AIContext";
import { SaaSAnalyticsProvider } from "./context/SaaSAnalyticsContext";
import { CommunityProvider } from "./context/CommunityContext";
import { ToastContainer } from "react-toastify";
import NotificationContainer from "./components/common/Notification";

const App = () => {
  return (
    <NotificationContainer>
      <AuthProvider>
        <OrganizationProvider>
        <SubscriptionProvider>
        <ThemeProvider>
        <MembersProvider>
          <BooksProvider>
            <AcademicsProvider>
            <PerformanceProvider>
            <GamificationProvider>
            <SkillTreeProvider>
            <LiveClassesProvider>
            <CertificateProvider>
            <PlagiarismProvider>
            <MicroLearningProvider>
            <CodeArenaProvider>
            <ExternalLearningProvider>
            <ResearchProvider>
            <AIProvider>
            <SaaSAnalyticsProvider>
            <CommunityProvider>
            <AnalyticsProvider>
            <BrowserRouter>
              <PageRoutes />
            </BrowserRouter>
            </AnalyticsProvider>
            </CommunityProvider>
            </SaaSAnalyticsProvider>
            </AIProvider>
            </ResearchProvider>
            </ExternalLearningProvider>
            </CodeArenaProvider>
            </MicroLearningProvider>
            </PlagiarismProvider>
            </CertificateProvider>
            </LiveClassesProvider>
            </SkillTreeProvider>
            </GamificationProvider>
            </PerformanceProvider>
            </AcademicsProvider>
          </BooksProvider>
        </MembersProvider>
        </ThemeProvider>
        </SubscriptionProvider>
        </OrganizationProvider>
      </AuthProvider>
      <ToastContainer />
    </NotificationContainer>
  );
};

export default App;
