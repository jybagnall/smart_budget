import { useEffect, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Outlet } from "react-router-dom";

import Tab from "./Tab";
import tabLinks from "./tabLinks";
import { useTargetMonth } from "../contexts/TargetMonthContext";
import Loading from "../components/alerts/Loading";
import {
  fetchTargetDate,
  fetchAllDates,
  getMonthName,
} from "../../backend/helpers/api";
import AllDatesDropDown from "./AllDatesDropDown";

export default function Navbar() {
  const { dateId, isLoading, setDateId } = useTargetMonth();
  const [targetMonth, setTargetMonth] = useState(null);
  const [year, setTargetYear] = useState(null);
  const [allDates, setAllDates] = useState([]);

  const [showOptions, setShowOptions] = useState(false);
  const [selectedDateId, setSelectedDateId] = useState(null);

  async function loadData() {
    const fetchedTargetMonth = await fetchTargetDate(dateId);
    const fetchedAllDates = await fetchAllDates();

    if (fetchedTargetMonth) {
      setTargetMonth(fetchedTargetMonth.month);
      setTargetYear(fetchedTargetMonth.year);
    }

    setAllDates(fetchedAllDates);
  }

  useEffect(() => {
    if (dateId) {
      loadData();
    }
  }, [dateId, selectedDateId]);

  if (isLoading) {
    return <Loading />;
  }

  const handleShowOptions = () => {
    setShowOptions((show) => !show);
  };

  async function handleSelectedDateId(newDateId) {
    setShowOptions(false);
    setSelectedDateId(newDateId);
    await setDateId(newDateId);
  }

  return (
    <div className="min-h-full flex justify-center px-10 py-10 be-white">
      <div className="w-full max-w-7xl bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <div
          as="nav"
          className="sticky top-0 z-50 bg-white border-b border-gray-200"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between w-full px-4 sm:px-6 lg:px-8 text-base sm:text-lg">
              {tabLinks.map((item) => (
                <Tab key={item.tabName} to={item.href}>
                  {item.tabName}
                </Tab>
              ))}
            </div>
          </div>

          <div className="py-10">
            <header>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative inline-block">
                  <div
                    onClick={handleShowOptions}
                    className="flex items-center space-x-2"
                  >
                    <h1 className="text-3xl font-bold tracking-tight text-sky-700 flex items-center transition-all duration-200 hover:text-sky-600 hover:underline px-2">
                      {targetMonth ? (
                        `${getMonthName(targetMonth)}, ${year}`
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

            <main>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
