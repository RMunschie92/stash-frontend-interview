//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React from "react";

// Types
import { ValuePiece } from "../../types";

//------------------------------------------------------------------------------
// Local Types & Interfaces
//------------------------------------------------------------------------------
type DatesSectionProps = {
  checkInDate: ValuePiece;
  checkOutDate: ValuePiece;
  children: React.ReactNode;
  showCalendars?: boolean;
  setShowCalendars: (show: boolean) => void;
};

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
/**
 * @component DatesSection
 * @description A component that renders a section for selecting the number of Dates (adults and children).
 * @param {DatesSectionProps} props - The properties for the component.
 * @param {ValuePiece} props.checkInDate - The selected check-in date.
 * @param {ValuePiece} props.checkOutDate - The selected check-out date.
 * @param {React.ReactNode} props.children - The children to render inside the section.
 * @param {boolean} [props.showCalendars=false] - Flag to determine if the calendars should be shown.
 * @param {Function} props.setShowCalendars - Callback function to set the visibility of the calendars.
 * @returns
 */
const DatesSection = ({
  checkInDate,
  checkOutDate,
  children,
  showCalendars = false,
  setShowCalendars,
}: DatesSectionProps) => {
  // Don't render if children prop is not provided
  if (!children) {
    return null;
  }

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
    <div className="relative flex flex-col">
      <label className="absolute text-xs top-1 left-2" htmlFor="dates-input">
        Dates
      </label>
      <input
        type="text"
        id="dates-input"
        value={`${formatDate(checkInDate)} - ${formatDate(checkOutDate)}`}
        readOnly
        className={"sr-only"}
      />
      <button
        className="border border-gray-400 rounded-md p-2 pt-4 h-12 w-full cursor-pointer"
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
        <span aria-hidden="true" className="block w-fit">
          {formatDate(checkInDate)} - {formatDate(checkOutDate)}
        </span>
      </button>
      {children}
    </div>
  );
};

export default DatesSection;
