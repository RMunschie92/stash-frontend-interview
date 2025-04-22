//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
import { ValuePiece } from "../types";

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------
/**
 * @function formatDate
 * @description Formats a date to a string in the format "MMM DD" (e.g., "Apr 23").
 * @param {ValuePiece} date - The date to format.
 * @param {boolean} includeYear - Whether to include the year in the formatted string.
 * @returns {string}
 */
const formatDate = (date: ValuePiece, includeYear: boolean): string => {
  if (!date) return "";

  const options: { [key: string]: string } = {
    month: "short",
    day: "2-digit",
  };

  if (includeYear) {
    options.year = "numeric";
  }
  return date.toLocaleDateString("en-US", options);
};

export default formatDate;
