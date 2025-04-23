//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
/**
 * @function capitalizeWordsInString
 * @description Capitalizes the first letter of each word in a string.
 * @param {string} str - The string to capitalize words in
 * @returns {string} - The string with each word capitalized
 */
const capitalizeWordsInString = (str: string): string => {
  // Capitalize the first letter of each word in the string
  str = str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Handle hyphenated words
  // This will capitalize the first letter of each word after a hyphen
  // and ensure the first word is also capitalized
  str.split("-").forEach((word, index) => {
    if (index > 0) {
      str = str.replace(word, word.charAt(0).toUpperCase() + word.slice(1));
    }
  });

  return str;
};

export default capitalizeWordsInString;
