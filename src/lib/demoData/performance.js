const now = new Date().toISOString();

export const demoPerformanceProfiles = [
  { _id: "pf1", studentId: "s1", studentName: "John Doe", organizationId: "org-1", overallScore: 88, strengths: ["Variables", "Functions"], weaknesses: ["Algorithms"], learningSpeedScore: 85, consistencyScore: 90, riskLevel: "Low", lastAnalyzedAt: now },
  { _id: "pf2", studentId: "s2", studentName: "Jane Smith", organizationId: "org-1", overallScore: 95, strengths: ["Data Structures", "Algorithms"], weaknesses: [], learningSpeedScore: 92, consistencyScore: 98, riskLevel: "Low", lastAnalyzedAt: now },
  { _id: "pf3", studentId: "s3", studentName: "Emily Davis", organizationId: "org-1", overallScore: 52, strengths: ["Variables"], weaknesses: ["Functions", "Loops", "Data Structures"], learningSpeedScore: 45, consistencyScore: 40, riskLevel: "High", lastAnalyzedAt: now },
  { _id: "pf4", studentId: "mock-user-123", studentName: "Explorer User", organizationId: "org-1", overallScore: 72, strengths: ["Variables", "Arrays"], weaknesses: ["Advanced Topics"], learningSpeedScore: 68, consistencyScore: 65, riskLevel: "Medium", lastAnalyzedAt: now },
];
