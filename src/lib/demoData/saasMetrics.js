export const demoSaaSMetrics = {
  mrr: 12450,
  arr: 149400,
  activeUsers: 342,
  churnRate: 2.4,
  planDistribution: [
    { plan: "Free", count: 120, revenue: 0 },
    { plan: "Starter", count: 85, revenue: 2465 },
    { plan: "Pro", count: 42, revenue: 4158 },
    { plan: "Enterprise", count: 8, revenue: 2392 },
  ],
  featureUsage: [
    { feature: "AI Calls", count: 12500, limit: 50000 },
    { feature: "Exams Taken", count: 3420, limit: 10000 },
    { feature: "Code Submissions", count: 2100, limit: 5000 },
  ],
  organizations: [
    { id: "org-1", name: "Acme Learning", seats: 45, used: 38, mrr: 99, aiCalls: 1200 },
    { id: "org-2", name: "Tech Corp", seats: 100, used: 92, mrr: 299, aiCalls: 4500 },
  ],
  trends: {
    mrr: [11000, 11500, 11800, 12200, 12450],
    users: [310, 320, 328, 335, 342],
    churn: [3.1, 2.8, 2.6, 2.5, 2.4],
  },
};
