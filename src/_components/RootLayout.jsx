import { Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { fetchAllDates } from "../../backend/helpers/api";
import SelectedDate from "./SelectedDate";
import Loading from "../components/alerts/Loading";
import Navbar from "./Navbar";
import { useTargetMonth } from "../contexts/TargetMonthContext";

export default function RootLayout() {
  const { dateId, isLoading, refreshTargetMonth } = useTargetMonth();

  const [allDates, setAllDates] = useState([]);

  const loadAllDates = useCallback(async () => {
    const fetchedAllDates = await fetchAllDates();
    setAllDates(fetchedAllDates);
  }, []);

  useEffect(() => {
    if (dateId) {
      loadAllDates();
    }
  }, [dateId, loadAllDates]);

  if (isLoading) {
    return <Loading />;
  }

  const handleSelectedDateId = (newDateId) => {
    const selected = allDates.find((date) => date.id === newDateId);

    if (selected) {
      refreshTargetMonth({
        id: selected.id,
        year: selected.year,
        month: selected.month - 1,
      });
    }
  };

  return (
    <div className="flex justify-center bg-white min-h-screen">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg shadow-md">
        <Navbar />
        <div className="pt-30 pb-2">
          <div>
            <SelectedDate
              handleSelectedDateId={handleSelectedDateId}
              allDates={allDates}
            />
          </div>
        </div>
        <main className="w-full pt-[20px] pb-8">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
