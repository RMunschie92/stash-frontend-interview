/**
 * @function decodeUrlString
 * @description Decodes a URL-encoded string and capitalizes each word.
 * @param {string} url - The URL-encoded string to decode
 * @returns {string} - The decoded string with capitalized words
 */
const decodeUrlString = (url: string): string => {
  // Decode the URL-encoded string
  let decodedString = decodeURIComponent(url);

  // Replace hyphens with spaces
  // decodedString = decodedString.replace(/-/g, " ");
  const splitChar = decodedString.includes(" ") ? " " : "-";

  // Capitalize each word in the string
  decodedString = decodedString
    .split(splitChar)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(splitChar);

  return decodedString;
};

export default decodeUrlString;
