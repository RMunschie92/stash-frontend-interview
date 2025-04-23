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

// Utils
import decodeUrlString from "../utils/decodeUrlString";
import formatStringForUrl from "../utils/formatStringForUrl";

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
/**
 * @component MicrositeLayout
 * @description This component renders a microsite layout for a specific hotel.
 * It displays the hotel name, image, pricing information, and placeholder sections.
 * @returns {React.JSX.Element} - JSX element representing the microsite layout
 */
const MicrositeLayout = (): React.JSX.Element => {
  // Get context data
  const hotelData: Hotel[] = useOutletContext<Hotel[]>();

  // Get the current location and extract the city from the URL
  const location = useLocation();
  let hotel: string = location.pathname.split("/").pop() || "unknown";

  // Decode the hotel name from the URL
  hotel = decodeUrlString(hotel);

  // Get data for the specific hotel
  const hotelInfo = hotelData.find(
    (h) => formatStringForUrl(h.name) === formatStringForUrl(hotel)
  );

  // If hotelInfo is not found, display a pseudo error message
  if (!hotelInfo) {
    return (
      <div>
        <Search />
        <h1 className="text-2xl text-orange-600 font-semibold">
          Hotel not found
        </h1>
        <p className="text-lg pt-2">
          Please check the URL or search for another hotel.
        </p>
      </div>
    );
  }

  /**
   * @function generatePrice
   * @description Generates the price section for the hotel. Displays the daily rate and member rate if applicable
   * @returns {React.JSX.Element} - JSX element representing the price section
   */
  const generatePrice = (): React.JSX.Element => {
    let dailyRateEl: React.JSX.Element | null = null;
    let dailyRateClass: string = "text-gray-700 mt-auto semibold";

    if (hotelInfo.has_member_rate) {
      dailyRateEl = (
        <div className="flex gap-2 text-lg">
          <p>Member rate: </p>
          <span className="text-green-600 font-semibold">
            ${(hotelInfo.daily_rate * 0.9).toFixed(2)} per night
          </span>
        </div>
      );
      dailyRateClass += " line-through";
    }

    return (
      <div className="my-4">
        <p className={dailyRateClass}>
          Rooms averaging ${hotelInfo.daily_rate} per night.
        </p>
        {dailyRateEl}
      </div>
    );
  };

  /**
   * @function generatePlaceholderSection
   * @description Generates a placeholder section with a title and paragraphs
   * @param {number} index - The index of the section to generate
   * @returns {React.JSX.Element} - JSX element representing a section with a title and paragraphs
   */
  const generatePlaceholderSection = (index: number): React.JSX.Element => {
    const p: React.JSX.Element = (
      <p className="text-lg mb-4">
        Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus
        mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
        tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
        Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit
        semper vel class aptent taciti sociosqu. Ad litora torquent per conubia
        nostra inceptos himenaeos.
      </p>
    );

    // Determine the number of paragraphs based on the index
    const count: number = index % 2 === 0 ? 1 : 2;

    return (
      <section className={index !== 0 ? "mt-4" : ""}>
        <h2 className="text-xl mb-2 text-orange-600">
          Lorem ipsum dolor sit amet
        </h2>
        {Array.from({ length: count }, (_, i) => (
          <React.Fragment key={i}>{p}</React.Fragment>
        ))}
      </section>
    );
  };

  return (
    <>
      <PageTitle title={`${hotelInfo.name} | ${hotelInfo.city}`} />
      <Search />

      <h1 className="text-3xl text-orange-600 font-semibold">
        {hotelInfo.name}
      </h1>
      <p className="text-xl mt-2">{hotelInfo.city}</p>
      <img
        className="rounded-lg mt-4"
        src={hotelInfo.image}
        alt=""
        aria-hidden="true"
      />

      {generatePrice()}

      {[1, 2, 3, 4].map((i) => generatePlaceholderSection(i))}
    </>
  );
};

export default MicrositeLayout;
