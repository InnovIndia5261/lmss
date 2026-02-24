const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoExams = [
  {
    _id: "e1",
    courseId: "c1",
    organizationId: "org-1",
    title: "Midterm Exam",
    description: "Covers weeks 1-6",
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 60,
    randomizeQuestions: true,
    showResultsImmediately: true,
    allowMultipleAttempts: false,
    createdAt: daysAgo(30),
  },
  {
    _id: "e2",
    courseId: "c2",
    organizationId: "org-1",
    title: "Data Structures Quiz",
    description: "Arrays, stacks, queues",
    durationMinutes: 45,
    totalMarks: 50,
    passingMarks: 30,
    randomizeQuestions: true,
    showResultsImmediately: true,
    allowMultipleAttempts: true,
    createdAt: daysAgo(20),
  },
];
