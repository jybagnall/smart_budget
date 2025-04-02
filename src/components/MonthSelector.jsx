import PreviousSVGArrow from "./buttons/PreviousSVGArrow";
import NextSVGArrow from "./buttons/NextSVGArrow";
import { getMonthName } from "../helperFunctions";

export default function MonthSelector({
  handleChange,
  targetMonth,
  targetYear,
}) {
  return (
    <div className="mt-2 w-full flex items-center justify-center text-gray-900">
      {/* Previous Month Button */}
      <button
        type="button"
        onClick={() => handleChange("prev")}
        className="-m-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Previous month</span>
        <PreviousSVGArrow />
      </button>

      {/* Current Month Display */}
      <div className="mx-4 text-sm text-green-700 font-semibold">
        {targetYear}, {getMonthName(targetMonth)}
      </div>

      {/* Next Month Button */}
      <button
        type="button"
        onClick={() => handleChange("next")}
        className="-m-1.5 flex items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
      >
        <span className="sr-only">Next month</span>
        <NextSVGArrow />
      </button>
    </div>
  );
}
