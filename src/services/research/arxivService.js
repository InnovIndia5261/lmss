/**
 * arXiv API service - structure only.
 * Do NOT call external APIs until backend integration is configured.
 * Prepares for: https://arxiv.org/help/api
 */

/**
 * Fetch research results from arXiv.
 * @param {string} query - Search query
 * @param {Object} options - { maxResults, start }
 * @returns {Promise<{ results: [], total: number }>}
 */
export const fetchArxivResults = async (query, options = {}) => {
  // Placeholder - API integration to be implemented via backend
  // Backend will call: http://export.arxiv.org/api/query?search_query=...
  return { results: [], total: 0 };
};
