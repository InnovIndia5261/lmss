/**
 * Research API abstraction layer.
 * Fetches research results from platform-specific APIs.
 * All API calls should go through backend - no direct external API calls from frontend.
 */

import { fetchArxivResults } from "./arxivService";
import { fetchPubmedResults } from "./pubmedService";
import { fetchCoreResults } from "./coreService";

const PLATFORM_SERVICES = {
  "rp-arxiv": fetchArxivResults,
  "rp-pubmed": fetchPubmedResults,
  "rp-core": fetchCoreResults,
};

/**
 * Fetch research results for a given platform.
 * @param {string} query - Search query
 * @param {string} platformId - Platform identifier (e.g. rp-arxiv, rp-pubmed, rp-core)
 * @param {Object} options - Platform-specific options
 * @returns {Promise<{ results: [], total: number, platformId: string }>}
 */
export const fetchResearchResults = async (query, platformId, options = {}) => {
  const service = PLATFORM_SERVICES[platformId];
  if (!service) {
    return { results: [], total: 0, platformId };
  }
  const { results, total } = await service(query, options);
  return { results, total, platformId };
};

export { fetchArxivResults } from "./arxivService";
export { fetchPubmedResults } from "./pubmedService";
export { fetchCoreResults } from "./coreService";
export { formatAPA, formatMLA, getCitation } from "./citationFormatter";
