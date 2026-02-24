export const demoPlans = [
  { _id: "plan-free", name: "Free", priceMonthly: 0, priceYearly: 0, maxUsers: 5, maxCourses: 2, maxStorageMB: 100, features: ["Basic courses", "5 users"], isCustom: false },
  { _id: "plan-starter", name: "Starter", priceMonthly: 29, priceYearly: 290, maxUsers: 25, maxCourses: 10, maxStorageMB: 1024, features: ["All Free", "25 users", "10 courses", "1GB storage"], isCustom: false },
  { _id: "plan-pro", name: "Pro", priceMonthly: 99, priceYearly: 990, maxUsers: 100, maxCourses: 50, maxStorageMB: 10240, features: ["All Starter", "100 users", "50 courses", "10GB storage", "Analytics", "Live classes"], isCustom: false },
  { _id: "plan-enterprise", name: "Enterprise", priceMonthly: 299, priceYearly: 2990, maxUsers: -1, maxCourses: -1, maxStorageMB: 102400, features: ["Unlimited", "White-label", "API", "Support"], isCustom: false },
];
