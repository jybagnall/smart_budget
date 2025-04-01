import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { getMonthName } from "../../backend/helpers/api";
import Loading from "../components/alerts/Loading";
import AllDatesDropDown from "./AllDatesDropDown";

export default function SelectedDate({
  handleShowOptions,
  targetMonth,
  targetYear,
  showOptions,
  allDates,
  handleSelectedDateId,
}) {
  return (
    <header>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-start">
          <div
            onClick={handleShowOptions}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <h1 className="text-2xl font-bold tracking-tight text-sky-700 flex items-center transition-all duration-200 hover:text-sky-600 hover:underline">
              {targetMonth ? (
                `${getMonthName(targetMonth)}, ${targetYear}`
              ) : (
                <Loading />
              )}
            </h1>
            <ChevronDownIcon
              aria-hidden="true"
              className="size-5 text-gray-500 hover:text-gray-700 cursor-pointer sm:size-4"
            />
            {showOptions && (
              <AllDatesDropDown
                allDates={allDates}
                handleSelectedDateId={handleSelectedDateId}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
