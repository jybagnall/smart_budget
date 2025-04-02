import { formatMoney } from "../../helperFunctions";

export default function TotalExpenditure({ totalSpending, targetBudget }) {
  const formatSpending = formatMoney(totalSpending);
  const formatBudget = formatMoney(targetBudget);
  const isOverBudget = Number(totalSpending) > Number(targetBudget);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Total Expenditure to Date
      </h2>
      <p
        className={`text-3xl font-bold ${
          isOverBudget ? "text-red-800" : "text-green-700 "
        }`}
      >
        ${formatSpending}
        <span className="ml-2 text-base text-gray-500">/ {formatBudget}</span>
      </p>
    </div>
  );
}
