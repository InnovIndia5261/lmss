const now = new Date();
const daysFromNow = (d) => new Date(now.getTime() + d * 86400000).toISOString();

export const demoFlashcards = [
  { _id: "fc1", courseId: "c1", organizationId: "org-1", question: "What is a variable?", answer: "A named storage location for data", difficulty: 1, nextReviewDate: daysFromNow(1), intervalDays: 1, repetitionCount: 0 },
  { _id: "fc2", courseId: "c1", organizationId: "org-1", question: "What does const mean?", answer: "Constant - value cannot be reassigned", difficulty: 2, nextReviewDate: daysFromNow(3), intervalDays: 3, repetitionCount: 2 },
  { _id: "fc3", courseId: "c1", organizationId: "org-1", question: "What is a loop?", answer: "A structure that repeats code until a condition is met", difficulty: 1, nextReviewDate: daysFromNow(0), intervalDays: 1, repetitionCount: 0 },
  { _id: "fc4", courseId: "c2", organizationId: "org-1", question: "What is LIFO?", answer: "Last In First Out - stack behavior", difficulty: 2, nextReviewDate: daysFromNow(2), intervalDays: 2, repetitionCount: 1 },
  { _id: "fc5", courseId: "c2", organizationId: "org-1", question: "What is FIFO?", answer: "First In First Out - queue behavior", difficulty: 2, nextReviewDate: daysFromNow(5), intervalDays: 5, repetitionCount: 3 },
];

export const demoSpacedRepetitionLogs = [
  { _id: "srl1", studentId: "s1", flashcardId: "fc1", result: "Good", reviewedAt: new Date().toISOString() },
  { _id: "srl2", studentId: "s1", flashcardId: "fc2", result: "Easy", reviewedAt: new Date().toISOString() },
];
