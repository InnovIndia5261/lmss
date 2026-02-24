/**
 * XP & Gamification utilities.
 * Level = floor(totalXP / 1000)
 */

export const XP_PER_ACTION = {
  LessonComplete: 50,
  Assignment: 100,
  Exam: 150,
  ExamPass: 50,
  Bonus: 25,
  StreakDay: 10,
};

export const XP_PER_LEVEL = 1000;

export const getLevelFromXP = (totalXP) => Math.floor(totalXP / XP_PER_LEVEL) || 1;

export const getXPProgressInLevel = (totalXP) => totalXP % XP_PER_LEVEL;

export const getXPForNextLevel = (totalXP) => XP_PER_LEVEL - getXPProgressInLevel(totalXP);
