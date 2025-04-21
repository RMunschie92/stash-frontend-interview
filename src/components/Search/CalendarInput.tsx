//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React, { useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

//------------------------------------------------------------------------------
// Types & Interfaces
//------------------------------------------------------------------------------
type ValuePiece = Date | null | undefined;

interface CalendarInputProps {
  isOpen: boolean;
  callback: (dates: ValuePiece | [ValuePiece, ValuePiece]) => void;
  checkInDate?: ValuePiece;
  checkOutDate?: ValuePiece;
}

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
/**
 * @component CalendarInput
 * @description A component that renders a calendar input for selecting check-in and check-out dates.
 * @param {CalendarInputProps} props - The properties for the component.
 * @param {Function} props.callback - Callback function to handle date selection.
 * @param {ValuePiece} props.checkInDate - The selected check-in date.
 * @param {ValuePiece} props.checkOutDate - The selected check-out date.
 * @param {boolean} [props.isOpen=false] - Flag to determine if the calendar inputs should be displayed.
 * @returns {React.JSX.Element | null} - Returns the calendar inputs or null if not open or dates are not provided.
 */
const CalendarInput = ({
  callback,
  checkInDate,
  checkOutDate,
  isOpen = false,
}: CalendarInputProps): React.JSX.Element | null => {
  // Initialize a ref for the calendar input
  const calendarRef = useRef<HTMLInputElement | null>(null);

  /**
   * @function useEffect
   * @description Focuses the calendar input when the component mounts and isOpen is true.
   */
  useEffect(() => {
    // If the calendarRef is set and the calendar is open, focus on the calendar input
    // for accessibility and user experience
    if (calendarRef.current && isOpen) {
      calendarRef.current.focus();
    }
  }, [isOpen]);

  // Don't render if required props are not passed
  if (!isOpen || !checkInDate || !checkOutDate) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Calendar
          inputRef={calendarRef}
          selectRange={true}
          onChange={callback}
          showDoubleView={true}
          value={[checkInDate, checkOutDate]}
        />
      </div>
    </div>
  );
};

export default CalendarInput;
