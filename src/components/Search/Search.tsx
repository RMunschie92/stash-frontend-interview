//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

// Components
import CalendarInput from "./CalendarInput";
import DatesSection from "./DatesSection";
import TravelersSection from "./TravelersSection";

// Assets
import iconCity from "../../assets/icon-city.png";
import iconHotel from "../../assets/icon-hotel.png";

// Types
import { Hotel, ValuePiece } from "../../types";

// Utils
import capitalizeWordsInString from "../../utils/capitalizeWordsInString";
import extractParams from "../../utils/extractParams";
import formatDate from "../../utils/formatDate";
import formatStringForUrl from "../../utils/formatStringForUrl";

//------------------------------------------------------------------------------
// Local Types & Interfaces
//------------------------------------------------------------------------------
type CityData = {
  name: string;
  lowerCase: string;
};

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
  const allCities: CityData[] = useMemo(() => {
    return hotelData.map((hotel: Hotel): CityData => {
      return { name: hotel.city, lowerCase: hotel.city.toLowerCase() };
    });
  }, [hotelData]);

  // Local state (includes state passed down to child components)
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [checkInDate, setCheckInDate] = useState<ValuePiece>(null);
  const [checkOutDate, setCheckOutDate] = useState<ValuePiece>(null);
  const [citySearchMatches, setCitySearchMatches] = useState<CityData[]>([]);
  const [forceSearchResultsClosed, setForceSearchResultsClosed] =
    useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(true);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [searchHotelSelection, setSearchHotelSelection] =
    useState<Hotel | null>(null);
  const [searchCitySelection, setSearchCitySelection] = useState<string | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [showSearchError, setShowSearchError] = useState<boolean>(false);
  const [showCalendars, setShowCalendars] = useState<boolean>(false);
  const [showTravelersInputs, setShowTravelersInputs] =
    useState<boolean>(false);

  // Initialize refs as needed
  const searchErrorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchParams] = useSearchParams();

  /**
   * Executes on component mount to set initial state values.
   * - It sets the `isFirstRender` state to false after the initial render.
   */
  useEffect(() => {
    // Flip `isFirstRender` state flag
    setIsFirstRender(false);
  }, []);

  /**
   * Executes on component mount and when `hotelData` or `searchParams` change.
   * - It extracts parameters from the search params and sets initial values for search input, hotel selection, city selection, check-in date, check-out date, adults count, and children count.
   * - It checks if the `pathCity` or `pathHotelName` parameters are present and updates the respective state variables accordingly.
   * - It also sets default values for check-in and check-out dates, adults, and children based on the extracted parameters.
   */
  useEffect(() => {
    // If this is the first render, set initial values based on parsedParams
    if (isFirstRender) {
      const viaParams = extractParams(searchParams);

      if (viaParams.pathCity) {
        setSearchInput(capitalizeWordsInString(viaParams.pathCity));
        setSearchCitySelection(viaParams.pathCity);
      }

      if (viaParams.pathHotelName) {
        // If a hotel name is provided, set the search input to the hotel name
        setSearchInput(capitalizeWordsInString(viaParams.pathHotelName));
        // Find the hotel in the hotel data
        const selectedHotel: Hotel | undefined = hotelData.find(
          (hotel: Hotel) =>
            viaParams.pathHotelName &&
            hotel.name.toLowerCase() === viaParams.pathHotelName.toLowerCase()
        );
        // If the hotel is found, set it as the selected hotel
        if (selectedHotel) {
          setSearchHotelSelection(selectedHotel);
        }
      }

      // Note that default values are set in extractParams util in the event
      // that no search params are provided for check-in, check-out, adults, or children
      // (most crucial for check-in and check-out dates)
      setCheckInDate(viaParams.searchCheckIn);
      setCheckOutDate(viaParams.searchCheckOut);
      setAdultsCount(viaParams.searchAdults);
      setChildrenCount(viaParams.searchChildren);
    }
  }, [hotelData, isFirstRender, searchParams]);

  /**
   * @function handleSubmit
   * @description Handles the form submission event for searching hotels.
   * @param {React.MouseEvent<HTMLButtonElement>} event - The click event from the submit button.
   * @returns {void}
   */
  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    // If no hotel or city is selected, show error
    if (!searchHotelSelection && !searchCitySelection) {
      setShowSearchError(true);
      return;
    }

    // Format check in and check out dates to be MM-DD-YYYY
    let formattedCheckIn: string = formatDate(checkInDate, true);
    let formattedCheckOut: string = formatDate(checkOutDate, true);
    // Replace spaces and commas with dashes for URL compatibility
    formattedCheckIn = formatStringForUrl(formattedCheckIn);
    formattedCheckOut = formatStringForUrl(formattedCheckOut);

    // If user select a hotel, redirect to the microsite for that hotel
    if (searchHotelSelection) {
      const { city, name } = searchHotelSelection;
      const formattedCity: string = formatStringForUrl(city);
      const formattedName: string = formatStringForUrl(name);
      // Redirect to the microsite for the selected hotel
      // "hotel/:city/:hotelName?:checkin&:checkout&:adults&:children"
      window.location.href = `/hotel/${formattedCity}/${formattedName}?checkin=${formattedCheckIn}&checkout=${formattedCheckOut}&adults=${adultsCount}&children=${childrenCount}`;
      return;
    }

    const formattedSearchCity: string = formatStringForUrl(
      searchCitySelection || ""
    );

    // Otherwise, redirect to the city results page
    // "travel/:city?:checkin&:checkout&:adults&:children",
    window.location.href = `/travel/${formattedSearchCity}?checkin=${formattedCheckIn}&checkout=${formattedCheckOut}&adults=${adultsCount}&children=${childrenCount}`;
  };

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
    const cityMatches: CityData[] = [];
    // Create a map to track unique city names to prevent duplicate entries
    // This is used to ensure that we do not add the same city multiple times
    // to the cityMatches array. Necessary since we can't compare objects directly.
    const cityMatchNames = new Map<string, boolean>();
    // Look for substring match of city name in allCities memo
    allCities.forEach((city: CityData) => {
      if (
        city.lowerCase.includes(e.target.value.toLowerCase()) &&
        !cityMatchNames.has(city.name)
      ) {
        cityMatchNames.set(city.name, true);
        cityMatches.push(city);
      }
    });

    // Filter data based on searchInput
    const results = hotelData.filter((hotel: Hotel): boolean => {
      const nameMatch: boolean = hotel.name
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      const cityMatch: boolean = hotel.city
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      const comboMatch: boolean = `${hotel.name}, ${hotel.city}`
        .toLowerCase()
        .includes(e.target.value.toLowerCase());

      return cityMatch || nameMatch || comboMatch;
    });

    // Finally update state with results and city matches
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
    // If dates is not an array of two dates, return early
    if (!Array.isArray(dates) || dates.length !== 2 || !dates[0] || !dates[1]) {
      return;
    }

    // Determine if user selected the same date for check-in and check-out
    const datesAreTheSame: boolean =
      dates[0].toLocaleDateString() === dates[1].toLocaleDateString();

    // If dates are the same, add one day to checkout date
    if (datesAreTheSame) {
      dates[1] = new Date(dates[1]);
      dates[1].setDate(dates[1].getDate() + 1);
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

    // Set boolean to determine if there are city matches based on search input
    const hasCityMatches: boolean =
      citySearchMatches && citySearchMatches.length > 0;

    // First populate results with hotel data
    const resultsToRender: React.JSX.Element[] = searchResults.map(
      (hotel: Hotel, index: number) => {
        const dynamicAttributes: { [key: string]: () => void } = {};
        if (!hasCityMatches && index === searchResults.length - 1) {
          // If this is the last item in the list and there are no city matches,
          // add a blur handler to the last item to close the results when it loses focus
          dynamicAttributes["onBlur"] = () => setForceSearchResultsClosed(true);
        }

        return (
          <li key={hotel.id}>
            <button
              type="button"
              className="w-full text-left p-2 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setSearchInput(`${hotel.name}, ${hotel.city}`);
                setSearchHotelSelection(hotel);
                setSearchCitySelection(null);
                setForceSearchResultsClosed(true);
              }}
              {...dynamicAttributes}
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
      }
    );

    // Add city matches to results if they exist
    if (hasCityMatches) {
      for (let i = 0; i < citySearchMatches.length; i++) {
        const cityMatch: CityData = citySearchMatches[i];

        const dynamicAttributes: { [key: string]: () => void } = {};
        if (i === citySearchMatches.length - 1) {
          // If this is the last item in the list  add a blur handler to the last
          // item to close the results when it loses focus
          dynamicAttributes["onBlur"] = () => setForceSearchResultsClosed(true);
        }

        resultsToRender.push(
          <li
            key={`city-match-${cityMatch.lowerCase.replace(/\s/g, "-")}`}
            role="presentation"
          >
            <button
              type="button"
              role="option"
              className="w-full text-left p-2 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setSearchInput(cityMatch.name);
                setSearchHotelSelection(null);
                setSearchCitySelection(cityMatch.name);
                setForceSearchResultsClosed(true);
              }}
              {...dynamicAttributes}
            >
              <img
                src={iconCity}
                alt=""
                aria-hidden="true"
                className="inline-block w-4 h-4 mr-2"
              />
              {cityMatch.name}
            </button>
          </li>
        );
      }
    }

    // Return list of results
    return (
      <ul
        id="search-results-list"
        className="absolute top-14.5 left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg p-4"
        role="listbox"
        aria-label="Search result options"
      >
        {resultsToRender}
      </ul>
    );
  };

  /**
   * @function generateNoSearchError
   * @description Generates an error message when user tries to submit form while no destination is selected.
   * @returns {React.JSX.Element | null}
   */
  const generateNoSearchError = (): React.JSX.Element | null => {
    if (!showSearchError) {
      return null;
    }

    return (
      <div ref={searchErrorRef} className="col-span-4 grid grid-cols-subgrid">
        <div className="flex justify-between col-start-1 md:col-end-3 lg:col-end-2 bg-red-300 p-4 rounded-md mt-2">
          <p>Please select a destination.</p>
          <button
            className="underline"
            onClick={() => {
              setShowSearchError(false);
              if (searchInputRef.current) {
                searchInputRef.current.focus();
              }
            }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <form className="relative flex flex-col md:grid grid-cols-[1fr_1fr_1fr_.5fr] gap-4 mb-8">
      {generateNoSearchError()}

      <div className="relative">
        <label className="sr-only" htmlFor="search-input">
          Search for a hotel or city
        </label>
        <input
          id="search-input"
          className="border border-gray-400 placeholder-black rounded-md p-2 w-full h-12.5"
          type="text"
          placeholder="Destination..."
          autoComplete="off"
          aria-autocomplete="list"
          role="combobox"
          aria-expanded={!forceSearchResultsClosed && searchInput.length >= 3}
          aria-controls="search-results-list"
          value={searchInput}
          onChange={(event) => handleSearch(event)}
          onFocus={() => {
            setShowTravelersInputs(false);
            setShowCalendars(false);
          }}
          ref={searchInputRef}
        />
        {generateSearchResults()}
      </div>

      <DatesSection
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        showCalendars={showCalendars}
        setShowCalendars={(val: boolean) => {
          // If section is being opened, ensure travelers inputs are closed
          if (val) {
            setShowTravelersInputs(false);
            setForceSearchResultsClosed(true);
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
          if (val) {
            setShowCalendars(false);
            setForceSearchResultsClosed(true);
          }
          setShowTravelersInputs(val);
        }}
      />

      <button
        className="h-12.5 w-full bg-sky-600 rounded p-2 font-white text-white hover:bg-sky-500 transition-colors duration-300"
        type="submit"
        onClick={(event) => handleSubmit(event)}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
