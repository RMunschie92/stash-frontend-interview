//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import CalendarInput from "./CalendarInput";
import DatesSection from "./DatesSection";
import TravelersSection from "./TravelersSection";

// Assets
import iconCity from "../../assets/icon-city.png";
import iconHotel from "../../assets/icon-hotel.png";

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

  // Get memoized array of all hotel cities
  const allCities = useMemo(() => {
    return hotelData.map((hotel: Hotel) => hotel.city);
  }, [hotelData]);

  // Local state
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<ValuePiece>(null);
  const [checkOutDate, setCheckOutDate] = useState<ValuePiece>(null);
  const [citySearchMatches, setCitySearchMatches] = useState<string[]>([]);
  const [forceSearchResultsClosed, setForceSearchResultsClosed] =
    useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [showCalendars, setShowCalendars] = useState<boolean>(false);
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

    // If search results was forced closed, reset state value to ensure it can
    // be opened again
    if (forceSearchResultsClosed) {
      setForceSearchResultsClosed(false);
    }

    // Initialize cityMatches array to hold unique city matches.
    // This will be used to show all hotels in a city if the user searches for a city name
    // or a substring of a city name
    const cityMatches: string[] = [];
    // Look for substring match of city name in allCities memo
    allCities.forEach((city: string) => {
      // Add unique values into cityMatches array
      if (
        city.toLowerCase().includes(e.target.value.toLowerCase()) &&
        !cityMatches.includes(city)
      ) {
        cityMatches.push(city);
      }
    });

    // Filter data based on searchInput
    const results = hotelData.filter((hotel: Hotel) => {
      const nameMatch = hotel.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      const cityMatch = hotel.city
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      const comboMatch = `${hotel.name}, ${hotel.city}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      return cityMatch || nameMatch || comboMatch;
    });

    setCitySearchMatches(cityMatches);
    setSearchResults(results);
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
   * @function generateSearchResults
   * @description Generates the search results dropdown based on the filtered hotel data.
   * @returns {React.JSX.Element | null}
   */
  const generateSearchResults = (): React.JSX.Element | null => {
    // If results were forced closed, if no results, or input is less than 3
    // characters, return null
    if (
      forceSearchResultsClosed ||
      !searchResults ||
      searchResults.length === 0 ||
      searchInput.length < 3
    ) {
      return null;
    }

    // First populate results with hotel data
    const resultsToRender = searchResults.map((hotel: Hotel) => {
      return (
        <li key={hotel.id}>
          <button
            type="button"
            className="w-full text-left p-2 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => {
              setSearchInput(`${hotel.name}, ${hotel.city}`);
              setForceSearchResultsClosed(true);
            }}
          >
            <img
              src={iconHotel}
              alt=""
              aria-hidden="true"
              className="inline-block w-4 h-4 mr-2"
            />
            {hotel.name}, {hotel.city}
          </button>
        </li>
      );
    });

    // Add city matches to results if they exist
    if (citySearchMatches && citySearchMatches.length) {
      for (let i = 0; i < citySearchMatches.length; i++) {
        const cityMatch = citySearchMatches[i];

        resultsToRender.push(
          <li key={`city-match-${cityMatch.replace(/\s/g, "-")}`}>
            <button
              type="button"
              className="w-full text-left p-2 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setSearchInput("");
                setForceSearchResultsClosed(true);
              }}
            >
              <img
                src={iconCity}
                alt=""
                aria-hidden="true"
                className="inline-block w-4 h-4 mr-2"
              />
              {cityMatch}
            </button>
          </li>
        );
      }
    }

    // Return list of results
    return (
      <ul className="absolute top-14.5 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4">
        {resultsToRender}
      </ul>
    );
  };

  return (
    <form className="flex flex-col md:grid grid-cols-[1fr_1fr_1fr_.5fr] gap-4 p-4">
      <div className="relative">
        <input
          className="border border-gray-400 placeholder-black rounded-md p-2 w-full h-12.5"
          type="text"
          placeholder="Destination..."
          value={searchInput}
          onChange={(event) => handleSearch(event)}
        />
        {generateSearchResults()}
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
    </form>
  );
};

export default Search;
