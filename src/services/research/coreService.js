/**
 * CORE API service - structure only.
 * Do NOT call external APIs until backend integration is configured.
 * Prepares for: https://core.ac.uk/documentation/api
 */

/**
 * Fetch research results from CORE.
 * @param {string} query - Search query
 * @param {Object} options - { page, pageSize }
 * @returns {Promise<{ results: [], total: number }>}
 */
export const fetchCoreResults = async (query, options = {}) => {
  // Placeholder - API integration to be implemented via backend
  // Backend will call: https://api.core.ac.uk/v3/...
  return { results: [], total: 0 };
};
