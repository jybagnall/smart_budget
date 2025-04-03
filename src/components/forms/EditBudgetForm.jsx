import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";

import { getMonthName, formatMoney } from "../../helperFunctions";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import Loading from "../alerts/Loading";
import SaveButton from "../buttons/SaveButton";

export default function EditBudgetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { dateId, isLoading } = useTargetMonth();

  // const navigate = useNavigate();

  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [budget, setBudget] = useState(null);

  const fetchTargetSpending = async () => {
    if (!dateId) return;

    try {
      const res = await axios.get(
        `/api/budgets/request-budget-month?dateId=${dateId}`,
        {
          withCredentials: true,
        }
      );
      setMonth(res.data.month);
      setYear(res.data.year);
      setBudget(Number(res.data.target_amount));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    if (dateId) {
      fetchTargetSpending();
    }
  }, [dateId]);

  if (isLoading) {
    return <Loading />;
  }

  const onSubmit = async (data) => {
    const payload = {
      target_amount: data.target_amount,
      dateId,
    };

    try {
      const res = await axios.patch("/api/budgets/edit-budgets", payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        alert("success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto space-y-8 bg-white p-6 rounded-lg shadow-md transition-all duration-300 ease-in-out"
      >
        <label
          htmlFor="target_amount"
          className="block text-xl font-semibold text-gray-900"
        >
          Edit{" "}
          <span className="text-sky-600">
            {getMonthName(month - 1)}, {year}
          </span>{" "}
          spending target
        </label>

        <div className="relative mt-4">
          <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:border-indigo-500">
            <span className="text-gray-500">$</span>
            <input
              {...register("target_amount", {
                required: "Please enter your target spending",
                min: { value: 0, message: "Amount must be positive" },
              })}
              type="number"
              name="target_amount"
              id="target_amount"
              className="block w-full border-none bg-transparent px-2 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              aria-describedby="price-currency"
            />
            <span id="price-currency" className="text-gray-500">
              USD
            </span>
          </div>
          {errors.target_amount?.message && (
            <span className="mt-2 text-xs text-red-600">
              {errors.target_amount.message}
            </span>
          )}
        </div>

        <SaveButton bgColor={"bg-sky-200"} />
      </form>
    </div>
  );
}
