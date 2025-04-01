import PreviousSVGArrow from "./buttons/PreviousSVGArrow";
import NextSVGArrow from "./buttons/NextSVGArrow";
import { getMonthName } from "../../backend/helpers/api";

export default function MonthSelector({
  handleChange,
  targetMonth,
  targetYear,
}) {
  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
      {/* Month Selector Layout */}
      <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
        <div className="flex items-center text-gray-900">
          {/* Previous Month Button */}
          <button
            type="button"
            onClick={() => handleChange("prev")}
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Previous month</span>
            <PreviousSVGArrow />
          </button>

          {/* Current Month Display */}
          <div className="flex-auto text-sm text-green-700 font-semibold">
            {targetYear}, {getMonthName(targetMonth)}
          </div>

          {/* Next Month Button */}
          <button
            type="button"
            onClick={() => handleChange("next")}
            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Next month</span>
            <NextSVGArrow />
          </button>
        </div>
      </div>
    </div>
  );
}
