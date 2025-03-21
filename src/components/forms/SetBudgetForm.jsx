import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import MonthSelector from "../MonthSelector";

export default function SetBudgetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const today = new Date(); // do I need this?
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [targetMonth, setTargetMonth] = useState(currentMonth); // 0, 1..

  let adjustedYear = targetMonth < currentMonth ? currentYear + 1 : currentYear;

  if (adjustedYear === currentYear && targetMonth < currentMonth) {
    alert("You cannot set a budget for past month.");
    return;
  }

  const getMonthName = (monthIndex) => {
    return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      new Date(adjustedYear, monthIndex)
    );
  };

  const handlePrevMonth = () =>
    setTargetMonth((month) => (month === 0 ? 11 : month - 1));

  const handleNextMonth = () =>
    setTargetMonth((month) => (month === 11 ? 0 : month + 1));

  const onSubmit = async (data) => {
    const payload = {
      year: adjustedYear,
      month: targetMonth + 1,
      target_amount: data.targetSpending,
    };

    try {
      const res = await axios.post("/api/budgets/set-budgets", payload, {
        withCredentials: true,
      });

      if (res.status === 201 && res.data.message.includes("successfully")) {
        navigate("/category-list");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-md"
      >
        <MonthSelector
          handleNextMonth={handleNextMonth}
          handlePrevMonth={handlePrevMonth}
          getMonthName={getMonthName}
          targetMonth={targetMonth}
        />

        <label
          htmlFor="targetSpending"
          className="block text-lg font-semibold text-gray-900"
        >
          What is your spending target for this month?
        </label>

        <div className="relative mt-4">
          <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-indigo-500">
            <span className="text-gray-500">$</span>
            <input
              {...register("targetSpending", {
                required: "Please enter your target spending",
                min: { value: 0, message: "Amount must be positive" },
              })}
              type="number"
              name="targetSpending"
              id="targetSpending"
              className="block w-full border-none bg-transparent px-2 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              placeholder="0.00"
              aria-describedby="price-currency"
            />
            <span id="price-currency" className="text-gray-500">
              USD
            </span>
          </div>
          {errors.targetSpending?.message && (
            <span className="mt-2 text-xs text-red-600">
              {errors.targetSpending.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-green-500 px-4 py-2 text-gray-900 font-semibold hover:bg-green-600"
        >
          Save
        </button>
      </form>
    </div>
  );
}
