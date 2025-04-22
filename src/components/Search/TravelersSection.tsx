//------------------------------------------------------------------------------
// Imports
//------------------------------------------------------------------------------
// Libraries
import React from "react";

//------------------------------------------------------------------------------
// Local Types & Interfaces
//------------------------------------------------------------------------------
type TravelersSectionProps = {
  adultsCount: number;
  childrenCount: number;
  isOpen?: boolean;
  setAdultsCount: (count: number) => void;
  setChildrenCount: (count: number) => void;
  setIsOpen: (show: boolean) => void;
};

//------------------------------------------------------------------------------
// Component
//------------------------------------------------------------------------------
/**
 * @component TravelersSection
 * @description A component that renders a section for selecting the number of travelers (adults and children).
 * @param {TravelersSectionProps} props - The properties for the component.
 * @param {number} props.adultsCount - The current count of adults.
 * @param {number} props.childrenCount - The current count of children.
 * @param {boolean} [props.isOpen=false] - Flag to determine if the section is open.
 * @param {Function} props.setAdultsCount - Callback function to set the count of adults.
 * @param {Function} props.setChildrenCount - Callback function to set the count of children.
 * @param {Function} props.setIsOpen - Callback function to toggle the open state of the section.
 * @returns
 */
const TravelersSection = ({
  adultsCount = 1,
  childrenCount = 0,
  isOpen = false,
  setAdultsCount,
  setChildrenCount,
  setIsOpen,
}: TravelersSectionProps) => {
  /**
   * @function generateButton
   * @description Generates a button for increasing or decreasing the count of adults or children.
   * @param {boolean} [decrement=false] - Flag to determine if the button is for decrementing the count.
   * @param {boolean} [forChildren=false] - Flag to determine if the button is for children or adults.
   * @param {Function} setter - Callback function to set the new count.
   * @returns {React.JSX.Element}
   */
  const generateButton = (
    decrement: boolean = false,
    forChildren: boolean = false,
    setter: (val: number) => void
  ): React.JSX.Element => {
    const commonNoun = forChildren ? "children" : "adults";
    const count = forChildren ? childrenCount : adultsCount;
    const action = decrement ? "Decrease" : "Increase";
    const ariaLabel = `${action} number of ${commonNoun} by 1`;

    // Set the new count based on the current count and whether it's incrementing
    // or decrementing
    let newCount;
    if (!forChildren && decrement && count === 1) {
      newCount = 1;
    } else {
      newCount = decrement ? (count > 0 ? count - 1 : 0) : count + 1;
    }

    // Determine if the button should be disabled
    let disabled = false;
    if (!decrement && count === 4) {
      disabled = true;
    } else if (
      (decrement && forChildren && count === 0) ||
      (decrement && !forChildren && count === 1)
    ) {
      disabled = true;
    }

    // Cap the count at 4
    if (newCount > 4) {
      newCount = 4;
    }

    // Set dynamic class value for flex-order
    const orderClassVal = decrement ? "order-1" : "order-3";

    return (
      <button
        type="button"
        className={`flex justify-center items-center leading-none bg-indigo-400 text-white rounded-md p-2 size-8 ${orderClassVal} hover:bg-indigo-500 transition-colors duration-300 disabled:bg-gray-400`}
        onClick={() => setter(newCount)}
        aria-label={ariaLabel}
        disabled={disabled}
        aria-disabled={disabled}
      >
        <span>{decrement ? "-" : "+"}</span>
      </button>
    );
  };

  /**
   * @function generateSpanCountText
   * @description Generates the text for the span element showing the counts of adults and children.
   * @returns {string}
   */
  const generateSpanCountText = (): string => {
    // If there are no children, return only adults count
    if (!childrenCount) {
      return adultsCount + " Adult" + (adultsCount !== 1 ? "s" : "");
    }

    // Otherwise return formatted string to account for singular/plural adults
    // and children.
    return (
      adultsCount +
      " Adult" +
      (adultsCount !== 1 ? "s" : "") +
      " & " +
      childrenCount +
      " Child" +
      (childrenCount !== 1 ? "ren" : "")
    );
  };

  /**
   * @function generateInputsSection
   * @description Generates the inputs section for adults and children counts. Returns null if the section is not open.
   * @returns {React.JSX.Element | null}
   */
  const generateInputsSection = (): React.JSX.Element | null => {
    if (!isOpen) {
      return null;
    }

    return (
      <section className="absolute top-13 left-0 w-full bg-white border border-gray-300 rounded-md p-4 shadow-lg">
        <div>
          <section className="flex width-full justify-between items-center mb-4">
            <label htmlFor="adults-input">Adults</label>
            <div className="grid grid-cols-3 gap-2 p-1 w-[8rem]">
              <input
                id="adults-input"
                className="order-2 text-center"
                type="number"
                value={adultsCount}
                readOnly
                aria-label="Amount of adults"
                min="1"
                max="4"
              />
              {generateButton(false, false, setAdultsCount)}
              {generateButton(true, false, setAdultsCount)}
            </div>
          </section>

          <section className="flex width-full justify-between items-center mb-4">
            <label htmlFor="children-input">Children</label>
            <div className="grid grid-cols-3 gap-2 p-1 w-[8rem]">
              <input
                id="children-input"
                className="order-2 text-center"
                type="number"
                value={childrenCount}
                readOnly
                max="4"
                aria-label="Amount of children"
              />
              {generateButton(false, true, setChildrenCount)}
              {generateButton(true, true, setChildrenCount)}
            </div>
          </section>
        </div>
      </section>
    );
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label className="absolute text-xs top-1 left-2">Travelers</label>
      <button
        type="button"
        className="border border-gray-400 rounded-md p-2 pt-4.25 h-12.5 w-full cursor-pointer"
        onClick={(event): void => {
          event.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="block w-fit">{generateSpanCountText()}</span>
      </button>
      {generateInputsSection()}
    </div>
  );
};

export default TravelersSection;
