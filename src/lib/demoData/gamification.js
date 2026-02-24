const now = new Date();
const daysAgo = (d) => new Date(now.getTime() - d * 86400000).toISOString();

export const demoXPTransactions = [
  { _id: "xp1", studentId: "s1", source: "LessonComplete", points: 50, createdAt: daysAgo(5) },
  { _id: "xp2", studentId: "s1", source: "Assignment", points: 100, createdAt: daysAgo(4) },
  { _id: "xp3", studentId: "s1", source: "Exam", points: 150, createdAt: daysAgo(3) },
  { _id: "xp4", studentId: "s1", source: "ExamPass", points: 50, createdAt: daysAgo(3) },
  { _id: "xp5", studentId: "s1", source: "LessonComplete", points: 50, createdAt: daysAgo(2) },
  { _id: "xp6", studentId: "s2", source: "LessonComplete", points: 50, createdAt: daysAgo(4) },
  { _id: "xp7", studentId: "s2", source: "Assignment", points: 100, createdAt: daysAgo(3) },
  { _id: "xp8", studentId: "s2", source: "Exam", points: 150, createdAt: daysAgo(2) },
  { _id: "xp9", studentId: "s2", source: "StreakDay", points: 10, createdAt: daysAgo(1) },
  { _id: "xp10", studentId: "mock-user-123", source: "LessonComplete", points: 50, createdAt: daysAgo(2) },
  { _id: "xp11", studentId: "mock-user-123", source: "Bonus", points: 25, createdAt: daysAgo(1) },
];

export const demoBadges = [
  { _id: "b1", title: "First Steps", description: "Complete your first lesson", icon: "🎯", conditionType: "LessonComplete", conditionValue: 1 },
  { _id: "b2", title: "Scholar", description: "Earn 1000 XP", icon: "📚", conditionType: "XP", conditionValue: 1000 },
  { _id: "b3", title: "Exam Master", description: "Pass an exam", icon: "🏆", conditionType: "ExamPass", conditionValue: 1 },
  { _id: "b4", title: "Course Champion", description: "Complete a course", icon: "⭐", conditionType: "CourseCompletion", conditionValue: 1 },
  { _id: "b5", title: "Week Warrior", description: "7-day activity streak", icon: "🔥", conditionType: "Streak", conditionValue: 7 },
];

export const demoStudentBadges = [
  { _id: "sb1", badgeId: "b1", studentId: "s1", earnedAt: daysAgo(10) },
  { _id: "sb2", badgeId: "b2", studentId: "s1", earnedAt: daysAgo(8) },
  { _id: "sb3", badgeId: "b3", studentId: "s1", earnedAt: daysAgo(5) },
  { _id: "sb4", badgeId: "b1", studentId: "s2", earnedAt: daysAgo(9) },
  { _id: "sb5", badgeId: "b4", studentId: "s2", earnedAt: daysAgo(3) },
  { _id: "sb6", badgeId: "b1", studentId: "mock-user-123", earnedAt: daysAgo(2) },
];
