//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
/**
 * @function convertToKebabCase
 * @description Converts a string to snake_case format.
 * @param str
 * @returns
 */
const convertToKebabCase = (str: string): string => {
  return str
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
    .toLowerCase(); // Convert to lowercase
};

export default convertToKebabCase;
