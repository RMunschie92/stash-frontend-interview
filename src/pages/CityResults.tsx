//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React from "react";
import { useLocation, useOutletContext } from "react-router-dom";

// Components
import PageTitle from "../components/PageTitle/PageTitle";
import Search from "../components/Search/Search";

// Types
import { Hotel } from "../types";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const CityResults = () => {
  // Get context data
  const hotelData = useOutletContext<Hotel[]>();

  // Get the current location and extract the city from the URL
  const location = useLocation();
  const city = location.pathname.split("/").pop();

  /**
   * @function generateListItem
   * @description Generates a list item for a hotel
   * @param {Hotel} hotel - Hotel object to generate list item for
   * @returns {React.JSX.Element} - JSX element representing a hotel list item
   */
  const generateListItem = (hotel: Hotel): React.JSX.Element => {
    const ratePrice: React.JSX.Element | null = hotel.has_member_rate ? (
      <div className="flex gap-2">
        <p>Member rate: </p>
        <span className="text-green-600 font-semibold">
          ${(hotel.daily_rate * 0.9).toFixed(2)} per night
        </span>
      </div>
    ) : null;

    let dailyRateClass: string = "text-gray-700 mt-auto semibold";
    if (hotel.has_member_rate) {
      dailyRateClass += " text-sm line-through";
    }

    return (
      <li
        key={hotel.id}
        className="flex flex-col sm:grid grid-cols-[1fr_2fr] mb-4 gap-2 sm:gap-3 border border-gray-300 rounded-lg"
      >
        <img
          src={hotel.image}
          alt={hotel.name}
          className="block w-full h-58 lg:h-52 object-cover rounded-t-md sm:rounded-t-none sm:rounded-l-md"
        />
        <div className="flex flex-col justify-between gap-2 sm:pr-1">
          <div className="px-2 sm:px-0 sm:pt-2">
            <h2 className="text-xl text-orange-600 font-semibold">
              {hotel.name}
            </h2>
            <p>{hotel.city}</p>
          </div>
          <div className="flex flex-col gap-2 px-2 sm:pl-0 mt-auto pb-2 sm:items-end">
            <p className={dailyRateClass}>
              ${hotel.daily_rate.toFixed(2)} avg. nightly price
            </p>
            {ratePrice}
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <PageTitle title={`Hotels in ${city}`} />
      <main className="font-mulish p-4 pt-6 lg:max-w-[1000px] mx-auto">
        <Search />

        <h1 className="text-2xl font-light mb-2">
          The Best Independent Hotels in{" "}
          <span className="font-bold text-orange-600">{city}</span>
        </h1>

        <p className="text-xl font-light">
          Earn the most points at the best independent hotels
        </p>

        <ul className="flex flex-col sm:grid grid-cols-1 gap-4 mt-4">
          {hotelData.map((hotel: Hotel) => {
            if (city === hotel.city) {
              return generateListItem(hotel);
            }
          })}
        </ul>
      </main>
    </>
  );
};

export default CityResults;
