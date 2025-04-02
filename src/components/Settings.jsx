import { useEffect, useState } from "react";

import NavigationButton from "./buttons/NavigationButton";
import SummaryCard from "./expenses/SummaryCard";
import { useTargetMonth } from "../contexts/TargetMonthContext";
import Loading from "./alerts/Loading";
import {
  fetchTargetSpending,
  fetchCategories,
} from "../../backend/helpers/api";
import { formatMoney } from "../helperFunctions";

export default function Settings() {
  const { dateId, isLoading } = useTargetMonth();

  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);

  async function loadData() {
    const fetchedBudget = await fetchTargetSpending(dateId);
    const fetchedCategories = await fetchCategories(dateId);

    if (fetchedBudget) {
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

  const categoryNames = categories.map((category) => category.category_name);

  return (
    <div className="bg-neutral-50 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl  p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
      <div className="border-b border-gray-200 pb-5">
        <div className="space-y-4 ">
          <SummaryCard
            title={"Your Target Spending"}
            summary={`$ ${formatMoney(budget)}`}
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
  );
}
