import { useState, createContext, useContext } from "react";

const TargetMonthContext = createContext();

function TargetMonthProvider({ children }) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [targetMonth, setTargetMonth] = useState(today.getMonth());

  const getMonthName = (monthIndex) => {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(currentYear, monthIndex)
    );
  };
  return (
    <TargetMonthContext.Provider
      value={{ targetMonth, currentYear, setTargetMonth, getMonthName }}
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
