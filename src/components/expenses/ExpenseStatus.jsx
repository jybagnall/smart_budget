import { useState, useEffect } from "react";

import { useTargetMonth } from "../../contexts/TargetMonthContext";
import Loading from "../alerts/Loading";
import {
  calculatePerCategory,
  calculateGrossSpending,
  fetchTargetSpending,
} from "../../../backend/helpers/api";
import Chart from "./Chart";
import TotalExpenditure from "./TotalExpenditure";
import SpendingByCategory from "./SpendingByCategory";

export default function ExpenseStatus() {
  const { dateId, isLoading } = useTargetMonth();
  const [sumPerCategory, setSumPerCategory] = useState([]);
  const [totalSpending, setTotalSpending] = useState(null);
  const [targetBudget, setTargetBudget] = useState(null);

  async function loadData() {
    const fetchedPerCategory = await calculatePerCategory(dateId);
    const fetchedGrossSpending = await calculateGrossSpending(dateId);
    const fetchedBudget = await fetchTargetSpending(dateId);

    if (fetchedPerCategory) {
      setSumPerCategory(fetchedPerCategory);
    }
    setTotalSpending(fetchedGrossSpending.total_spending);
    setTargetBudget(fetchedBudget.target_amount);
  }

  useEffect(() => {
    if (!dateId) return;

    loadData();
  }, [dateId]);

  useEffect(() => {
    if (sumPerCategory.length > 0) {
      console.log("sumPerCategory:", sumPerCategory);
    }
  }, [sumPerCategory]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center">
          <div className="w-60 h-60">
            <Chart sumPerCategory={sumPerCategory} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <TotalExpenditure
            totalSpending={totalSpending}
            targetBudget={targetBudget}
          />

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Spending by Category
            </h2>
            <SpendingByCategory sumPerCategory={sumPerCategory} />
          </div>
        </div>
      </div>
    </div>
  );
}
