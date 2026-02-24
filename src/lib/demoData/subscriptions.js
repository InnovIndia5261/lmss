const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000).toISOString();

export const demoOrganizationSubscriptions = [
  { _id: "sub1", organizationId: "org-1", planId: "plan-pro", status: "Active", startedAt: now.toISOString(), expiresAt: daysFromNow(365), paymentProvider: "stripe", stripeCustomerId: null, stripeSubscriptionId: null },
];

export const demoUsageTracking = [
  { _id: "ut1", organizationId: "org-1", metric: "Users", currentValue: 5, limitValue: 100 },
  { _id: "ut2", organizationId: "org-1", metric: "Courses", currentValue: 3, limitValue: 50 },
  { _id: "ut3", organizationId: "org-1", metric: "Storage", currentValue: 256, limitValue: 10240 },
];
