const now = new Date().toISOString();

export const demoAnalyticsSnapshots = [
  { _id: "as1", organizationId: "org-1", metricType: "revenue_trends", dataJSON: { labels: ["Jan", "Feb", "Mar", "Apr", "May"], values: [1200, 1900, 1500, 2200, 2400] }, generatedAt: now },
  { _id: "as2", organizationId: "org-1", metricType: "user_growth", dataJSON: { labels: ["W1", "W2", "W3", "W4"], values: [45, 52, 58, 65] }, generatedAt: now },
  { _id: "as3", organizationId: "org-1", metricType: "course_completion", dataJSON: { heatmap: [[80, 72], [65, 90], [55, 78]] }, generatedAt: now },
  { _id: "as4", organizationId: "org-1", metricType: "engagement_score", dataJSON: { score: 78, trend: "up" }, generatedAt: now },
];
