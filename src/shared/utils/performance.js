/**
 * Performance analytics utilities.
 * Backend-ready for future ML integration.
 */

export const calculateLearningSpeed = (submissions, examAttempts) => {
  const graded = submissions.filter((s) => s.marks != null);
  const attempts = examAttempts.filter((a) => a.status === "Completed");
  if (graded.length + attempts.length === 0) return 50;
  const total = graded.length + attempts.length;
  const avgScore =
    (graded.reduce((a, s) => a + (s.marks || 0), 0) + attempts.reduce((a, e) => a + e.score, 0)) /
    total;
  return Math.min(100, Math.round(avgScore));
};

export const detectWeakTopics = (submissions, questions, topicTagField = "topicTag") => {
  const wrongByTopic = {};
  submissions.forEach((s) => {
    const q = questions.find((q) => q.assignmentId === s.assignmentId || q.examId === s.examId);
    if (q && s.marks != null && s.marks < (q.marks || 10) * 0.6) {
      const topic = q[topicTagField] || "General";
      wrongByTopic[topic] = (wrongByTopic[topic] || 0) + 1;
    }
  });
  return Object.entries(wrongByTopic)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);
};
