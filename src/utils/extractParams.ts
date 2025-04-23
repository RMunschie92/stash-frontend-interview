//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Types
import { ValuePiece } from "../types";

interface Result {
  pathCity: string | null;
  pathHotelName: string | null;
  searchCheckIn: ValuePiece | null;
  searchCheckOut: ValuePiece | null;
  searchAdults: number;
  searchChildren: number;
}
//------------------------------------------------------------------------------
// Hook
//------------------------------------------------------------------------------
const extractParams = (params: URLSearchParams): Result => {
  const res: Result = {
    pathCity: null,
    pathHotelName: null,
    searchCheckIn: null,
    searchCheckOut: null,
    searchAdults: 1,
    searchChildren: 0,
  };

  // Get dates of next Friday and Sunday to serve as default check-in and check-out
  // dates if no dates are provided in the URL search parameters. This is done to
  // ensure that the user always has a valid date range to work with.
  const today: Date = new Date();
  const nextFriday: Date = new Date(today);
  // 5 is Friday, adjust to next Friday if today is not Friday
  nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7));
  const nextSunday: Date = new Date(nextFriday);
  // Set to Sunday (2 days after Friday)
  nextSunday.setDate(nextFriday.getDate() + 2);
  // Set check in date to 0 hours on Friday and check out date to 23:59:59 on Sunday
  nextFriday.setHours(0, 0, 0, 0);
  nextSunday.setHours(23, 59, 59);

  /**
   * @function convertToDate
   * @description Converts a string value to a Date object or returns null if the value is invalid
   * @param {string | null} value - The string value to convert to a Date object
   * @returns {ValuePiece} - Returns a Date object if valid, otherwise returns null
   */
  const convertToDate = (
    value: string | null,
    isCheckout: boolean = false
  ): ValuePiece => {
    // Default to next Friday for check-in and next Sunday for check-out
    if (!value) {
      return isCheckout ? nextSunday : nextFriday;
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return null; // Invalid date
    }

    // Set to 23:59:59 for checkout dates
    if (isCheckout) {
      date.setHours(23, 59, 59);
    }

    return date;
  };

  /**
   * @function extractPathParams
   * @description Extracts city and hotel name from the URL pathname
   * @param {string} pathname - The pathname from the URL
   * @returns { pathCity: string | null; pathHotelName: string | null } - Returns an object containing the city and hotel name if found, otherwise null
   */
  const extractPathParams = (
    pathname: string
  ): { pathCity: string | null; pathHotelName: string | null } => {
    const pathParts = pathname.split("/").filter(Boolean);

    let pathCity: string | null = null;
    let pathHotelName: string | null = null;

    if (pathParts[0] === "travel") {
      pathCity = pathParts[1] ? decodeURIComponent(pathParts[1]) : null;
    } else if (pathParts[0] === "hotel") {
      pathHotelName = pathParts[2] ? decodeURIComponent(pathParts[2]) : null;
    }

    return { pathCity, pathHotelName };
  };

  // Get & convert values via searchParams
  const searchCheckIn: ValuePiece | null = convertToDate(params.get("checkin"));
  const searchCheckOut: ValuePiece | null = convertToDate(
    params.get("checkout"),
    true
  );
  const searchAdults: number = params.has("adults")
    ? Number(params.get("adults"))
    : 1;
  const searchChildren: number = params.has("children")
    ? Number(params.get("children"))
    : 0;

  // Extract path parameters from the URL via helper
  const pathParams: { [key: string]: string | null } = extractPathParams(
    window.location.pathname
  );

  // Update default values in the result object
  res.pathCity = pathParams.pathCity;
  res.pathHotelName = pathParams.pathHotelName;
  res.searchCheckIn = searchCheckIn;
  res.searchCheckOut = searchCheckOut;
  res.searchAdults = searchAdults;
  res.searchChildren = searchChildren;

  return res;
};

export default extractParams;
