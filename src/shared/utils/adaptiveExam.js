/**
 * Adaptive exam question selection.
 * If correct → increase difficulty; if wrong → decrease.
 */

export const DIFFICULTY_ORDER = ["Easy", "Medium", "Hard"];

export const getNextAdaptiveQuestion = (previousCorrect, currentDifficulty, availableQuestions) => {
  const idx = DIFFICULTY_ORDER.indexOf(currentDifficulty);
  let nextDifficulty;
  if (previousCorrect && idx < DIFFICULTY_ORDER.length - 1) {
    nextDifficulty = DIFFICULTY_ORDER[idx + 1];
  } else if (!previousCorrect && idx > 0) {
    nextDifficulty = DIFFICULTY_ORDER[idx - 1];
  } else {
    nextDifficulty = currentDifficulty;
  }
  const candidates = availableQuestions.filter((q) => q.difficulty === nextDifficulty);
  return candidates[Math.floor(Math.random() * candidates.length)] || availableQuestions[0];
};

export const getDifficultyWeight = (difficulty) => {
  switch (difficulty) {
    case "Easy": return 1;
    case "Medium": return 1.5;
    case "Hard": return 2;
    default: return 1;
  }
};
