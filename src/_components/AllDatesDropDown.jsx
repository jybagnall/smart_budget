//import { ChevronDownIcon } from "@heroicons/react/16/solid";

import { getMonthName } from "../../backend/helpers/api";

export default function AllDatesDropDown({ allDates, handleSelectedDateId }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-45 mt-1 w-34 rounded-md shadow-lg bg-white ring-1 ring-sky-900 ring-opacity-5 z-50"
    >
      <div className="py-1">
        {allDates.map((date) => (
          <div
            key={date.id}
            onClick={() => handleSelectedDateId(date.id)}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {getMonthName(date.month)}, {date.year}
          </div>
        ))}
      </div>
    </div>
  );
}
