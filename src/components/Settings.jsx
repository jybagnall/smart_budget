import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const { dateId, isLoading, refreshTargetMonth, targetMonth, targetYear } =
    useTargetMonth();

  const [budget, setBudget] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleNavigateTo = async (link) => {
    await refreshTargetMonth({
      id: dateId,
      year: targetYear,
      month: targetMonth,
    });

    navigate(link);
  };

  if (isLoading) {
    return <Loading />;
  }

  const categoryNames = categories.map((category) => category.category_name);
  const categorySummary =
    categories.length === 0
      ? "No categories have been set."
      : categoryNames.join(", ");

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
      <div className="border-b border-gray-200 pb-5">
        <div className="space-y-4 ">
          <SummaryCard
            title={"Your Target Spending"}
            summary={`$ ${formatMoney(budget)}`}
            fontWeight={`text-3xl`}
            headTo={"edit"}
            onClick={() => handleNavigateTo("/edit-budgets")}
          />

          <SummaryCard
            title={"Categories"}
            summary={categorySummary}
            fontWeight={`text-lg`}
            headTo={"add more"}
            onClick={() => handleNavigateTo("/category-list")}
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
