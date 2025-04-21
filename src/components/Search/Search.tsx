//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import CalendarInput from "./CalendarInput";

// Types
import { Hotel } from "../../types";

type ValuePiece = Date | null | undefined;

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const Search = () => {
  // Get context data
  const hotelData = useOutletContext<Hotel[]>();

  // Local state
  const [textInput, setTextInput] = useState<string>("");
  const [results, setResults] = useState<Hotel[]>([]);
  const [showCalendars, setShowCalendars] = useState<boolean>(false);
  const [checkInDate, setCheckInDate] = useState<ValuePiece>(null);
  const [checkOutDate, setCheckOutDate] = useState<ValuePiece>(null);
  const [showTravelersInputs, setShowTravelersInputs] =
    useState<boolean>(false);

  /**
   * Side effect:
   * @description Initializes the check-in and check-out dates to the next Friday and Sunday respectively.
   * - This effect runs once when the component mounts.
   */
  useEffect(() => {
    // Get date of upcoming Friday
    const today = new Date();
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7)); // 5 is Friday, adjust to next Friday if today is not Friday

    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2); // Set to Sunday (2 days after Friday)

    setCheckInDate(nextFriday);
    setCheckOutDate(nextSunday);
  }, []);

  /**
   * @function handleSearch
   * @description Handles the search input change event and filtering of the hotel data based on the input value and updates the results.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
   * @returns {void}
   */
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // Prevent default form submission
    e.preventDefault();

    // Update text input state
    setTextInput(e.target.value);

    // Filter data based on textInput
    const results = hotelData.filter((hotel: Hotel) => {
      return hotel.city.toLowerCase().includes(e.target.value.toLowerCase());
    });

    setResults(results);
  };

  /**
   * @function handleDateChange
   * @description Handles the date selection from the calendar inputs.
   * @param {ValuePiece | [ValuePiece, ValuePiece]} dates - The selected dates, either a single date or a range of two dates.
   * @returns {void}
   */
  const handleDateChange = (
    dates: ValuePiece | [ValuePiece, ValuePiece]
  ): void => {
    if (!Array.isArray(dates) || dates.length !== 2) {
      return;
    }

    setCheckInDate(dates[0]);
    setCheckOutDate(dates[1]);
  };

  /**
   * @function formatDate
   * @description Formats a date to a string in the format "MMM DD" (e.g., "Apr 23").
   * @param {ValuePiece} date - The date to format.
   * @returns {string}
   */
  const formatDate = (date: ValuePiece): string => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <form className="flex gap-4">
      <div className="search-container">
        <input
          className="border border-gray-300 rounded-md p-2 w-full"
          type="text"
          placeholder="Destination..."
          value={textInput}
          onChange={(event) => handleSearch(event)}
        />
      </div>

      <div>
        <label htmlFor="dates-input">Dates</label>
        <input
          type="text"
          id="dates-input"
          value={`${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`}
          className={"sr-only"}
        />
        <button
          className="border border-gray-300 rounded-md p-2 w-full cursor-pointer"
          onClick={(event): void => {
            event.preventDefault();
            setShowCalendars(!showCalendars);
          }}
          type="button"
          aria-haspopup="true"
          aria-expanded={showCalendars}
        >
          <span className="sr-only">
            {showCalendars
              ? "Collapse calendar for input"
              : "Open calendar for input"}
          </span>
          <span aria-hidden="true">
            {formatDate(checkInDate)} - {formatDate(checkOutDate)}
          </span>
        </button>
        <CalendarInput
          callback={handleDateChange}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          isOpen={showCalendars}
        />
      </div>

      <div>
        <button
          className="border border-gray-300 rounded-md p-2 w-full cursor-pointer"
          type="button"
          onClick={(event): void => {
            event.preventDefault();
            setShowTravelersInputs(!showTravelersInputs);
          }}
          aria-haspopup="true"
          aria-expanded={showTravelersInputs}
        >
          Travelers
        </button>
      </div>

      <button className="search-button" type="submit">
        Search
      </button>

      {/* Temporary for use during component implementation */}
      <ul>
        {results.map((hotel: Hotel) => {
          return (
            <li key={hotel.id}>
              <img src={hotel.image} alt={hotel.name} />
              <h2>{hotel.name}</h2>
              <p>{hotel.city}</p>
              <p>${hotel.daily_rate} per night</p>
              {hotel.has_member_rate && <span>Member Rate Available</span>}
            </li>
          );
        })}
      </ul>
    </form>
  );
};

export default Search;
