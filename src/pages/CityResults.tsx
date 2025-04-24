//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React from "react";
import {
  useLocation,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";

// Components
import PageTitle from "../components/PageTitle/PageTitle";
import Search from "../components/Search/Search";

// Types
import { Hotel } from "../types";

// Utils
import decodeUrlString from "../utils/decodeUrlString";
import formatStringForUrl from "../utils/formatStringForUrl";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const CityResults = () => {
  // Get context data
  const hotelData = useOutletContext<Hotel[]>();

  // Get the current location and extract the city from the URL
  const location = useLocation();
  let city: string = location.pathname.split("/").pop() || "unknown";

  // Decode the city name from the URL
  city = decodeUrlString(city);

  // Get search parameters from the URL
  const [searchParams] = useSearchParams();

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

    // Construct URL to hotel's microsite page
    // "hotel/:city/:hotelName?:checkin&:checkout&:adults&:children"
    const formattedCity: string = formatStringForUrl(city);
    const formattedName: string = formatStringForUrl(hotel.name);
    let hotelUrl: string = `/hotel/${formattedCity}/${formattedName}?`;

    // Iterate over searchParams and add each to the URL
    for (const param of searchParams.entries()) {
      const [key, value] = param;
      if (value) {
        hotelUrl += `${key}=${value}&`;
      }
    }

    return (
      <li key={hotel.id}>
        <a
          href={hotelUrl}
          className="flex flex-col sm:grid grid-cols-[1fr_2fr] mb-4 gap-2 sm:gap-3 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300 sm:rounded-md sm:hover:rounded-lg sm:hover:shadow-md sm:overflow-hidden"
        >
          <img
            src={hotel.image}
            alt={hotel.name}
            className="block w-full h-58 lg:h-52 object-cover rounded-t-md sm:rounded-t-none sm:rounded-l-md"
            width={739}
            height={493}
            sizes={"(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
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
        </a>
      </li>
    );
  };

  // Filter hotels based on the city
  const hotelsInCity = hotelData.filter((hotel: Hotel) => hotel.city === city);

  // If no hotels are found in the city, display a message
  // and a search component
  if (hotelsInCity.length === 0) {
    return (
      <>
        <PageTitle title={`No Hotels Found in ${city}`} />
        <Search />
        <h1 className="text-2xl font-light mb-2">
          No Hotels Found in{" "}
          <span className="font-bold text-orange-600">{city}</span>
        </h1>
        <p className="text-xl font-light">
          We couldn't find any hotels in this city. Please try a different city.
        </p>
      </>
    );
  }

  return (
    <>
      <PageTitle title={`Hotels in ${city}`} />
      <Search />

      <h1 className="text-2xl font-light mb-2">
        The Best Independent Hotels in{" "}
        <span className="font-bold text-orange-600">{city}</span>
      </h1>

      <p className="text-xl font-light">
        Earn the most points at the best independent hotels
      </p>

      <section>
        <h2 id="hotel-count" className="text-xl font-semibold mt-4">
          {`${hotelsInCity.length} ${
            hotelsInCity.length > 1 ? "hotels" : "hotel"
          }
          found`}
        </h2>

        <ul
          aria-labelledby="hotel-count"
          className="flex flex-col sm:grid grid-cols-1 gap-4 mt-4"
        >
          {hotelsInCity.map((hotel: Hotel) => generateListItem(hotel))}
        </ul>
      </section>
    </>
  );
};

export default CityResults;
