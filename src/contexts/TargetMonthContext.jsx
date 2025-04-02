import axios from "axios";
import { useState, createContext, useContext, useEffect } from "react";

const TargetMonthContext = createContext();

function TargetMonthProvider({ children }) {
  const [targetMonth, setTargetMonth] = useState(null);
  const [targetYear, setTargetYear] = useState(null);
  const [dateId, setDateId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTargetMonth = async () => {
    setIsLoading(true);

    try {
      const res = await axios.get("/api/budgets/target-month", {
        withCredentials: true,
      });

      if (res.data.date_id) {
        setTargetYear(res.data.year);
        setTargetMonth(res.data.month - 1);
        setDateId(res.data.date_id);
      } else {
        setTargetYear(null);
        setTargetMonth(null);
        setDateId(null);
      } // new user didn't set the target month yet.
    } catch (error) {
      console.error("Error fetching target month:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTargetMonth = async ({ id, year, month }) => {
    setIsLoading(true);

    try {
      setDateId(id);
      setTargetYear(year);
      setTargetMonth(month);
    } catch (error) {
      console.error("Error refreshing target month:", error);
    } finally {
      setIsLoading(false);
    }
  };
 
  useEffect(() => {
    fetchTargetMonth();
  }, []);

  return (
    <TargetMonthContext.Provider
      value={{
        targetMonth,
        targetYear,
        dateId,
        isLoading,
        fetchTargetMonth,
        refreshTargetMonth,
        setDateId,
      }}
    >
      {children}
    </TargetMonthContext.Provider>
  );
}

function useTargetMonth() {
  const context = useContext(TargetMonthContext);
  if (!context) {
    throw new Error("useTargetMonth must be used within a TargetMonthProvider");
  }
  return context;
}

export { TargetMonthProvider, useTargetMonth };
