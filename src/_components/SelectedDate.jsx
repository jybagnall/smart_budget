import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { getMonthName } from "../helperFunctions";

import Loading from "../components/alerts/Loading";
import AllDatesDropDown from "./AllDatesDropDown";
import { useTargetMonth } from "../contexts/TargetMonthContext";

export default function SelectedDate({ allDates, handleSelectedDateId }) {
  const [showOptions, setShowOptions] = useState(false);
  const { targetMonth, targetYear } = useTargetMonth();

  const handleShowOptions = () => {
    setShowOptions((show) => !show);
  };

  return (
    <header>
      <div className="w-full px-4 sm:px-6 lg:px-0 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
        <div className="flex justify-start relative">
          <div
            onClick={handleShowOptions}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <h1 className="text-2xl font-bold tracking-tight text-sky-700 flex items-center transition-all duration-200 hover:text-sky-600 hover:underline">
              {targetMonth !== null && targetYear !== null ? (
                `${getMonthName(targetMonth)}, ${targetYear}`
              ) : (
                <Loading />
              )}
            </h1>
            {allDates.length > 1 && (
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 text-gray-500 hover:text-gray-700 cursor-pointer sm:size-4"
              />
            )}

            <div className="relative z-10">
              {showOptions && (
                <AllDatesDropDown
                  allDates={allDates}
                  setShowOptions={setShowOptions}
                  handleSelectedDateId={handleSelectedDateId}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
