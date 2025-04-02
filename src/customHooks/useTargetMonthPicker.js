import { useState } from "react";

export default function useTargetMonthPicker() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [targetMonth, setTargetMonth] = useState(currentMonth); // 0, 1..
  const [targetYear, setTargetYear] = useState(currentYear);

  const handleChange = (direction) => {
    setTargetMonth((month) => {
      let newMonth = month;

      if (direction === "prev") {
        if (month === 0) {
          newMonth = 11;
          setTargetYear((year) => year - 1);
        } else {
          newMonth = month - 1;
        }
      } else if (direction === "next") {
        if (month === 11) {
          newMonth = 0;
          setTargetYear((year) => year + 1);
        } else {
          newMonth = month + 1;
        }
      }
      return newMonth;
    });
  };

  const isSubmittingPast = () =>
    (targetYear === currentYear && targetMonth < currentMonth) ||
    targetYear < currentYear;

  return {
    targetMonth,
    targetYear,
    setTargetMonth,
    setTargetYear,
    handleChange,
    isSubmittingPast,
  };
}
