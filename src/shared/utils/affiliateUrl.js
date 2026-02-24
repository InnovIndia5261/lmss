/**
 * Builds external URL with optional affiliate tag appended.
 * @param {string} baseUrl - Original URL (course or platform)
 * @param {string|null} affiliateTag - Optional affiliate parameter
 * @param {boolean} affiliateTrackingEnabled - Whether to append tag
 * @returns {string} Final URL with affiliate params if applicable
 */
export const buildAffiliateUrl = (baseUrl, affiliateTag, affiliateTrackingEnabled = false) => {
  if (!baseUrl) return "#";
  if (!affiliateTrackingEnabled || !affiliateTag) return baseUrl;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("ref", affiliateTag);
    return url.toString();
  } catch {
    return baseUrl;
  }
};
