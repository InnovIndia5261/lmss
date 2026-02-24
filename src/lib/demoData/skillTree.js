export const demoSkillNodes = [
  { _id: "sn1", title: "Programming Basics", description: "Variables, types, control flow", parentSkillId: null, requiredCourseId: "c1", unlockCondition: "CourseComplete", unlockValue: 1 },
  { _id: "sn2", title: "Functions", description: "Reusable code blocks", parentSkillId: "sn1", requiredCourseId: "c1", unlockCondition: "XP", unlockValue: 500 },
  { _id: "sn3", title: "Data Structures", description: "Arrays, stacks, queues", parentSkillId: "sn1", requiredCourseId: "c2", unlockCondition: "CourseComplete", unlockValue: 1 },
  { _id: "sn4", title: "Algorithms", description: "Sorting and searching", parentSkillId: "sn3", requiredCourseId: "c2", unlockCondition: "ExamPass", unlockValue: 1 },
  { _id: "sn5", title: "Web Fundamentals", description: "HTML, CSS, JS", parentSkillId: "sn1", requiredCourseId: "c3", unlockCondition: "CourseComplete", unlockValue: 1 },
  { _id: "sn6", title: "Advanced Programming", description: "OOP, patterns", parentSkillId: "sn2", requiredCourseId: null, unlockCondition: "XP", unlockValue: 2000 },
  { _id: "sn7", title: "System Design", description: "Architecture basics", parentSkillId: "sn4", requiredCourseId: null, unlockCondition: "XP", unlockValue: 3000 },
  { _id: "sn8", title: "Full Stack", description: "End-to-end development", parentSkillId: "sn5", requiredCourseId: null, unlockCondition: "XP", unlockValue: 2500 },
];

const now = new Date().toISOString();

export const demoStudentSkillProgress = [
  { _id: "ssp1", studentId: "s1", skillNodeId: "sn1", unlocked: true, unlockedAt: now },
  { _id: "ssp2", studentId: "s1", skillNodeId: "sn2", unlocked: true, unlockedAt: now },
  { _id: "ssp3", studentId: "s1", skillNodeId: "sn3", unlocked: true, unlockedAt: now },
  { _id: "ssp4", studentId: "s2", skillNodeId: "sn1", unlocked: true, unlockedAt: now },
  { _id: "ssp5", studentId: "s2", skillNodeId: "sn2", unlocked: true, unlockedAt: now },
  { _id: "ssp6", studentId: "s2", skillNodeId: "sn3", unlocked: true, unlockedAt: now },
  { _id: "ssp7", studentId: "s2", skillNodeId: "sn4", unlocked: true, unlockedAt: now },
  { _id: "ssp8", studentId: "mock-user-123", skillNodeId: "sn1", unlocked: true, unlockedAt: now },
];
