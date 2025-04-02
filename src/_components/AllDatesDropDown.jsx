import { getMonthName } from "../helperFunctions";

export default function AllDatesDropDown({ allDates, handleSelectedDateId }) {
  if (allDates.length <= 1) return null;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-full left-0 mt-1 w-fit rounded-md shadow-lg bg-white ring-1 ring-sky-900 ring-opacity-5 z-50"
    >
      <div className="py-1 px-1">
        {allDates.map((date) => (
          <div
            key={date.id}
            onClick={() => handleSelectedDateId(date.id)}
            className="block w-full pl-4 pr-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            {getMonthName(date.month - 1)}, {date.year}
          </div>
        ))}
      </div>
    </div>
  );
}
