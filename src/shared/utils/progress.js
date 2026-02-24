/**
 * Calculate course progress based on lessons completed.
 * @param {string} courseId
 * @param {Array} lessons - Lessons for the course
 * @param {Array} completions - Lesson completions for the student
 * @param {string} studentId
 * @returns {number} Progress percentage 0-100
 */
export const calcCourseProgress = (courseId, lessons, completions, studentId) => {
  const courseLessons = lessons.filter((l) => l.courseId === courseId);
  if (courseLessons.length === 0) return 0;
  const completed = completions.filter(
    (c) => c.studentId === studentId && courseLessons.some((l) => l._id === c.lessonId)
  ).length;
  return Math.round((completed / courseLessons.length) * 100);
};

/**
 * Apply late penalty to assignment marks.
 * @param {number} marks - Raw marks
 * @param {number} maxMarks
 * @param {number} penaltyPercent
 * @returns {number} Final marks after penalty
 */
export const applyLatePenalty = (marks, maxMarks, penaltyPercent) => {
  const penalty = (maxMarks * penaltyPercent) / 100;
  return Math.max(0, marks - penalty);
};
