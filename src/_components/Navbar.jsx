import { useEffect, useState, useCallback } from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Outlet } from "react-router-dom";

import Tab from "./Tab";
import tabLinks from "./tabLinks";
import { useTargetMonth } from "../contexts/TargetMonthContext";
import Loading from "../components/alerts/Loading";
import { fetchAllDates, getMonthName } from "../../backend/helpers/api";
import AllDatesDropDown from "./AllDatesDropDown";
import LogoutSVG from "./LogoutSVG";

export default function Navbar() {
  const { dateId, targetMonth, targetYear, isLoading, refreshTargetMonth } =
    useTargetMonth();

  const [allDates, setAllDates] = useState([]);

  const [showOptions, setShowOptions] = useState(false);

  const loadAllDates = useCallback(async () => {
    const fetchedAllDates = await fetchAllDates();
    setAllDates(fetchedAllDates);
  }, []);

  useEffect(() => {
    loadAllDates();
  }, [loadAllDates]);

  useEffect(() => {}, [dateId]);

  if (isLoading) {
    return <Loading />;
  }

  const handleShowOptions = () => {
    setShowOptions((show) => !show);
  };

  const handleSelectedDateId = (newDateId) => {
    const selected = allDates.find((date) => date.id === newDateId);

    if (selected) {
      refreshTargetMonth({
        id: selected.id,
        year: selected.year,
        month: selected.month,
      });
    }
    setShowOptions(false);
  };

  return (
    <div as="nav" className="sticky top-0 z-50 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 text-base sm:text-lg">
          <div className="flex flex-1 justify-evenly">
            {tabLinks.map((item) => (
              <Tab key={item.tabName} to={item.href}>
                {item.tabName}
              </Tab>
            ))}
          </div>
          <div>
            <LogoutSVG />
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
                  <h1 className="text-2xl font-bold tracking-tight text-sky-700 flex items-center transition-all duration-200 hover:text-sky-600 hover:underline px-2">
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

          <main>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
