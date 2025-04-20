//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

// Types
import { Hotel } from "../types";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const Search = () => {
  // Get context data
  const hotelData = useOutletContext<Hotel[]>();

  // Local state
  const [textInput, setTextInput] = useState<string>("");
  const [results, setResults] = useState<Hotel[]>([]);

  /**
   * @function
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

  return (
    <form>
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Destination..."
          value={textInput}
          onChange={(event) => handleSearch(event)}
        />
        <button className="search-button">Search</button>
      </div>

      <button>Date Range</button>

      <button>Travelers</button>

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
