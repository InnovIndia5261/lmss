const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoEnrollments = [
  { _id: "en1", courseId: "c1", studentId: "s1", studentName: "John Doe", enrolledAt: daysAgo(55), progressPercent: 80 },
  { _id: "en2", courseId: "c1", studentId: "s2", studentName: "Jane Smith", enrolledAt: daysAgo(50), progressPercent: 100 },
  { _id: "en3", courseId: "c1", studentId: "s3", studentName: "Emily Davis", enrolledAt: daysAgo(45), progressPercent: 40 },
  { _id: "en4", courseId: "c1", studentId: "mock-user-123", studentName: "Explorer User", enrolledAt: daysAgo(30), progressPercent: 60 },
  { _id: "en5", courseId: "c2", studentId: "s1", studentName: "John Doe", enrolledAt: daysAgo(40), progressPercent: 75 },
  { _id: "en6", courseId: "c2", studentId: "s2", studentName: "Jane Smith", enrolledAt: daysAgo(35), progressPercent: 100 },
];
