const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoLessonCompletions = [
  { _id: "lc1", lessonId: "l1", studentId: "s1", completedAt: daysAgo(54) },
  { _id: "lc2", lessonId: "l2", studentId: "s1", completedAt: daysAgo(53) },
  { _id: "lc3", lessonId: "l3", studentId: "s1", completedAt: daysAgo(52) },
  { _id: "lc4", lessonId: "l4", studentId: "s1", completedAt: daysAgo(50) },
  { _id: "lc5", lessonId: "l1", studentId: "s2", completedAt: daysAgo(49) },
  { _id: "lc6", lessonId: "l2", studentId: "s2", completedAt: daysAgo(48) },
  { _id: "lc7", lessonId: "l3", studentId: "s2", completedAt: daysAgo(47) },
  { _id: "lc8", lessonId: "l4", studentId: "s2", completedAt: daysAgo(46) },
  { _id: "lc9", lessonId: "l5", studentId: "s2", completedAt: daysAgo(45) },
  { _id: "lc10", lessonId: "l1", studentId: "s3", completedAt: daysAgo(44) },
  { _id: "lc11", lessonId: "l2", studentId: "s3", completedAt: daysAgo(43) },
  { _id: "lc12", lessonId: "l1", studentId: "mock-user-123", completedAt: daysAgo(29) },
  { _id: "lc13", lessonId: "l2", studentId: "mock-user-123", completedAt: daysAgo(28) },
  { _id: "lc14", lessonId: "l3", studentId: "mock-user-123", completedAt: daysAgo(27) },
];
