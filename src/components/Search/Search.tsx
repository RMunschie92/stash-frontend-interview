//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import CalendarInput from "./CalendarInput";
import DatesSection from "./DatesSection";
import TravelersSection from "./TravelersSection";

// Types
import { Hotel, ValuePiece } from "../../types";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
/**
 * @component Search
 * @description A component that renders a search form for hotels, including destination input, date selection, and travelers section.
 * @returns {React.JSX.Element} - Returns the search form with inputs and results.
 */
const Search = (): React.JSX.Element => {
  // Get context data
  const hotelData = useOutletContext<Hotel[]>();

  // Local state
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<ValuePiece>(null);
  const [checkOutDate, setCheckOutDate] = useState<ValuePiece>(null);
  const [results, setResults] = useState<Hotel[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showCalendars, setShowCalendars] = useState<boolean>(true);
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
    setSearchInput(e.target.value);

    // Filter data based on searchInput
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

  return (
    <form className="flex flex-col md:grid grid-cols-[1fr_1fr_1fr_.5fr] gap-4 p-4">
      <div className="search-container">
        <input
          className="border border-gray-400 placeholder-black rounded-md p-2 w-full h-12.5"
          type="text"
          placeholder="Destination..."
          value={searchInput}
          onChange={(event) => handleSearch(event)}
        />
      </div>

      <DatesSection
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        showCalendars={showCalendars}
        setShowCalendars={(val: boolean) => {
          // If section is being opened, ensure travelers inputs are closed
          if (val && showTravelersInputs) {
            setShowTravelersInputs(false);
          }
          setShowCalendars(val);
        }}
      >
        <CalendarInput
          callback={handleDateChange}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          isOpen={showCalendars}
        />
      </DatesSection>

      <TravelersSection
        adultsCount={adultsCount}
        childrenCount={childrenCount}
        isOpen={showTravelersInputs}
        setAdultsCount={setAdultsCount}
        setChildrenCount={setChildrenCount}
        setIsOpen={(val: boolean) => {
          // If section is being opened, ensure calendars are closed
          if (val && showCalendars) {
            setShowCalendars(false);
          }
          setShowTravelersInputs(val);
        }}
      />

      <button
        className="h-12.5 w-full bg-indigo-400 rounded p-2 font-white text-white hover:bg-indigo-500 transition-colors duration-300"
        type="submit"
      >
        Search
      </button>

      {/* Temporary for use during component implementation */}
      {/* <ul>
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
      </ul> */}
    </form>
  );
};

export default Search;
