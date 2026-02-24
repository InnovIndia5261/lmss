/**
 * Citation formatter utility for research resources.
 * Formats metadata into APA and MLA citation styles.
 * Metadata-only - no copyrighted content.
 */

/**
 * Format resource as APA 7th edition citation.
 * @param {Object} resource - { authors, title, publishedYear, platformName }
 * @returns {string} APA-formatted citation
 */
export const formatAPA = (resource) => {
  if (!resource) return "";
  const authors = Array.isArray(resource.authors) ? resource.authors : [resource.authors];
  const authorStr = authors.length > 1 ? `${authors[0]} et al.` : authors[0] || "Unknown";
  const year = resource.publishedYear || resource.published_year || "n.d.";
  const platform = resource.platformName || resource.platform?.name || "Open Access";
  return `${authorStr} (${year}). ${resource.title}. ${platform}.`;
};

/**
 * Format resource as MLA 9th edition citation.
 * @param {Object} resource - { authors, title, publishedYear, platformName }
 * @returns {string} MLA-formatted citation
 */
export const formatMLA = (resource) => {
  if (!resource) return "";
  const authors = Array.isArray(resource.authors) ? resource.authors : [resource.authors];
  const authorStr = authors[0] || "Unknown";
  const year = resource.publishedYear || resource.published_year || "n.d.";
  const platform = resource.platformName || resource.platform?.name || "Open Access";
  return `${authorStr}. "${resource.title}." ${platform}, ${year}.`;
};

/**
 * Get citation in specified format.
 * @param {Object} resource - Research resource
 * @param {'APA'|'MLA'} format - Citation format
 * @returns {string}
 */
export const getCitation = (resource, format = "APA") => {
  if (format === "MLA") return formatMLA(resource);
  return formatAPA(resource);
};
