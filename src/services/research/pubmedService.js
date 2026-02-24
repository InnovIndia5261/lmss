/**
 * PubMed / PubMed Central API service - structure only.
 * Do NOT call external APIs until backend integration is configured.
 * Prepares for: https://www.ncbi.nlm.nih.gov/home/develop/api/
 */

/**
 * Fetch research results from PubMed.
 * @param {string} query - Search query
 * @param {Object} options - { maxResults, retstart }
 * @returns {Promise<{ results: [], total: number }>}
 */
export const fetchPubmedResults = async (query, options = {}) => {
  // Placeholder - API integration to be implemented via backend
  // Backend will call: https://eutils.ncbi.nlm.nih.gov/entrez/eutils/...
  return { results: [], total: 0 };
};
