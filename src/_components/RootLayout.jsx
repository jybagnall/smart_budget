import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { fetchAllDates } from "../../backend/helpers/api";
import SelectedDate from "./SelectedDate";
import Loading from "../components/alerts/Loading";
import Navbar from "./Navbar";
import { useTargetMonth } from "../contexts/TargetMonthContext";

export default function RootLayout() {
  const { dateId, targetMonth, targetYear, isLoading, refreshTargetMonth } =
    useTargetMonth();

  const [allDates, setAllDates] = useState([]);

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

  const handleSelectedDateId = (newDateId) => {
    const selected = allDates.find((date) => date.id === newDateId);

    if (selected) {
      refreshTargetMonth({
        id: selected.id,
        year: selected.year,
        month: selected.month,
      });
    }
  };

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
        <Navbar />
        <div className="pt-20 pb-2">
          <div>
            <SelectedDate
              targetMonth={targetMonth}
              targetYear={targetYear}
              handleSelectedDateId={handleSelectedDateId}
              allDates={allDates}
            />
          </div>
        </div>
        <main className="w-full pt-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
