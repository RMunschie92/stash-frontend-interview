//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
/**
 * @function formatStringForUrl
 * @description Formats a string to be URL-friendly by converting it to lowercase,
 * @param {string} str - The string to format for URL usage
 * @returns {string} - The formatted string suitable for use in a URL
 */
const formatStringForUrl = (str: string): string => {
  // Convert to lowercase
  let formattedStr = str.toLowerCase();

  // Encode spaces
  formattedStr = formattedStr.replace(/\s+/g, "%20");

  // Remove multiple consecutive hyphens
  formattedStr = formattedStr.replace(/-+/g, "-");

  // Trim hyphens from the start and end
  formattedStr = formattedStr.replace(/^-|-$/g, "");

  return formattedStr;
};

export default formatStringForUrl;
