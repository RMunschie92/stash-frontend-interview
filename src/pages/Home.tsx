//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

// Components
import Search from "../components/Search/Search";

// Types
import { Hotel } from "../types";

// Utils
import convertToSnakeCase from "../utils/convertToSnakeCase";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
const Index = () => {
  // Get context data
  const hotelData: Hotel[] = useOutletContext<Hotel[]>();

  // Local state
  const [sortedByCity, setSortedByCity] = useState<Record<string, Hotel[]>>({});

  /**
   * Executed when the component mounts or when hotelData changes.
   * - Sorts the hotels alphabetically by city.
   * - Groups hotels by city and updates the state.
   */
  useEffect(() => {
    const newState: { [key: string]: Hotel[] } = {};

    // Sort hotels alphabetically by city
    hotelData.sort((a, b) => a.city.localeCompare(b.city));

    for (const hotel of hotelData) {
      if (!newState[hotel.city]) {
        newState[hotel.city] = [];
      }
      newState[hotel.city].push(hotel);
    }

    setSortedByCity(newState);
  }, [hotelData]);

  /**
   * @function generateMainContent
   * @description Generates the main content of the page, displaying hotels grouped by city.
   * @returns {React.JSX.Element}
   */
  const generateMainContent = (): React.JSX.Element => {
    // Show loading state while sortedByCity is empty
    if (!Object.keys(sortedByCity).length) {
      return <h2 className="text-2xl">Loading...</h2>;
    }

    return (
      <>
        <h2 id="hotels-list-heading" className="text-2xl mb-4">
          Our Partner Hotels
        </h2>

        <ul
          aria-labelledby="hotels-list-heading"
          className="grid grid-cols-2 md:grid-cols-3 pb-10 gap-y-8 gap-x-4"
        >
          {Object.entries(sortedByCity).map(([city, hotels]) => (
            <li key={city}>
              <h3
                id={`${convertToSnakeCase(city)}-list-heading`}
                className="text-xl mb-1 font-semibold text-orange-600"
              >
                {city}
              </h3>
              <ul aria-labelledby={`${convertToSnakeCase(city)}-list-heading`}>
                {hotels.map((hotel) => (
                  <li key={hotel.id} className="not-last:mb-2">
                    <a
                      className="text-sky-600 w-fit hover:text-sky-800 transition:color duration-300"
                      href={`/hotel/${encodeURIComponent(
                        hotel.city
                      )}/${encodeURIComponent(hotel.name)}`}
                    >
                      {hotel.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <>
      <Search />

      <div className="mb-6">
        <h1 className="text-4xl mb-2 text-orange-600">
          Discover the best independent hotels.
        </h1>
        <p>
          Browse our selection of independent hotels across the country. We
          partner with the best independent hotels to offer you a unique and
          personalized travel experience.
        </p>
      </div>

      {generateMainContent()}
    </>
  );
};

export default Index;
