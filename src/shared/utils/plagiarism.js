/**
 * Basic text similarity (placeholder for future AI service).
 * Uses word overlap percentage.
 */

export const calculateSimilarity = (textA, textB) => {
  if (!textA || !textB) return 0;
  const wordsA = new Set(textA.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(textB.toLowerCase().split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let matches = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) matches++;
  });
  const union = new Set([...wordsA, ...wordsB]).size;
  return Math.round((matches / Math.min(wordsA.size, wordsB.size)) * 100);
};

export const DEFAULT_SIMILARITY_THRESHOLD = 70;
