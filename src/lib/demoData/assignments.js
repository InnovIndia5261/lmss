const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000).toISOString();

export const demoAssignments = [
  { _id: "a1", courseId: "c1", organizationId: "org-1", title: "Hello World Program", description: "Write your first program.", dueDate: daysFromNow(7), maxMarks: 100, allowLateSubmission: true, latePenaltyPercent: 10, createdAt: daysAgo(55) },
  { _id: "a2", courseId: "c1", organizationId: "org-1", title: "Variables Exercise", description: "Practice with variables.", dueDate: daysAgo(2), maxMarks: 100, allowLateSubmission: true, latePenaltyPercent: 5, createdAt: daysAgo(50) },
  { _id: "a3", courseId: "c1", organizationId: "org-1", title: "Functions Assignment", description: "Create reusable functions.", dueDate: daysFromNow(14), maxMarks: 100, allowLateSubmission: false, latePenaltyPercent: 0, createdAt: daysAgo(40) },
  { _id: "a4", courseId: "c2", organizationId: "org-1", title: "Implement Stack", description: "Implement a stack data structure.", dueDate: daysFromNow(5), maxMarks: 100, allowLateSubmission: true, latePenaltyPercent: 15, createdAt: daysAgo(35) },
  { _id: "a5", courseId: "c2", organizationId: "org-1", title: "Binary Search Tree", description: "Implement BST operations.", dueDate: daysAgo(5), maxMarks: 100, allowLateSubmission: false, latePenaltyPercent: 0, createdAt: daysAgo(25) },
];
