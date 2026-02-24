/**
 * SM-2 Spaced Repetition Algorithm
 * qualityScore: 0=Again, 1=Hard, 2=Good, 3=Easy
 */

const MIN_INTERVAL = 1;
const MIN_EASINESS = 1.3;
const DEFAULT_EASINESS = 2.5;

export const calculateNextReviewDate = (qualityScore, intervalDays = 0, easinessFactor = DEFAULT_EASINESS, repetitionCount = 0) => {
  if (qualityScore < 2) {
    return { nextInterval: MIN_INTERVAL, nextEasiness: easinessFactor, nextRepetition: 0 };
  }
  let newInterval;
  let newEasiness = easinessFactor + (0.1 - (3 - qualityScore) * (0.08 + (3 - qualityScore) * 0.02));
  newEasiness = Math.max(MIN_EASINESS, newEasiness);

  if (repetitionCount === 0) {
    newInterval = MIN_INTERVAL;
  } else if (repetitionCount === 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(intervalDays * newEasiness);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    nextInterval: newInterval,
    nextEasiness: newEasiness,
    nextRepetition: repetitionCount + 1,
    nextReviewDate: nextDate.toISOString(),
  };
};

export const QUALITY = { Again: 0, Hard: 1, Good: 2, Easy: 3 };
