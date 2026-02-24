const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoExamAttempts = [
  { _id: "ea1", examId: "e1", studentId: "s1", studentName: "John Doe", answers: {}, score: 85, startedAt: daysAgo(25), completedAt: daysAgo(25), status: "Completed", passed: true },
  { _id: "ea2", examId: "e1", studentId: "s2", studentName: "Jane Smith", answers: {}, score: 95, startedAt: daysAgo(24), completedAt: daysAgo(24), status: "Completed", passed: true },
  { _id: "ea3", examId: "e1", studentId: "s3", studentName: "Emily Davis", answers: {}, score: 45, startedAt: daysAgo(23), completedAt: daysAgo(23), status: "Completed", passed: false },
  { _id: "ea4", examId: "e2", studentId: "s1", studentName: "John Doe", answers: {}, score: 42, startedAt: daysAgo(15), completedAt: daysAgo(15), status: "Completed", passed: true },
  { _id: "ea5", examId: "e2", studentId: "s2", studentName: "Jane Smith", answers: {}, score: 48, startedAt: daysAgo(14), completedAt: daysAgo(14), status: "Completed", passed: true },
];
