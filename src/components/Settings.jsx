import { useEffect, useState } from "react";

import NavigationButton from "./buttons/NavigationButton";
import SummaryCard from "./expenses/SummaryCard";
import { useTargetMonth } from "../contexts/TargetMonthContext";
import Loading from "./alerts/Loading";
import {
  fetchTargetSpending,
  fetchCategories,
} from "../../backend/helpers/api";

export default function Settings() {
  const { dateId, isLoading } = useTargetMonth();

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);

  async function loadData() {
    const fetchedBudget = await fetchTargetSpending(dateId);
    const fetchedCategories = await fetchCategories(dateId);

    if (fetchedBudget) {
      setMonth(fetchedBudget.month);
      setYear(fetchedBudget.year);
      setBudget(fetchedBudget.target_amount);
    }

    setCategories(fetchedCategories);
  }

  useEffect(() => {
    if (!dateId) return;

    loadData();
  }, [dateId]);

  if (isLoading) {
    return <Loading />;
  }

  const getMonthName = (monthNum) =>
    new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(2000, monthNum - 1)
    );

  const formatAmount = (amount) => {
    return amount?.toLocaleString("en-US");
  };

  const categoryNames = categories.map((category) => category.category_name);

  return (
    <div className="bg-neutral-50 min-h-screen flex justify-center py-30">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        <h3 className="text-base font-semibold text-gray-900 mb-4 ml-2">
          {month ? `${getMonthName(month)}, ${year}` : <Loading />}
        </h3>
        <div className="border-b border-gray-200 pb-5">
          <div className="space-y-4 ">
            <SummaryCard
              title={"Your Target Spending"}
              summary={`$ ${formatAmount(budget)}`}
              fontWeight={`text-3xl`}
              headTo={"edit"}
              link={"/edit-budgets"}
            />
            <SummaryCard
              title={"Categories"}
              summary={categoryNames.join(", ")}
              fontWeight={`text-lg`}
              headTo={"edit"}
              link={"/category-list"}
            />
          </div>
        </div>
        <div className="mt-2">
          <NavigationButton to={"/set-more-budgets"}>
            Set a new future spending target
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
