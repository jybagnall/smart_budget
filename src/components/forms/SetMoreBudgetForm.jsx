import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import MonthSelector from "../MonthSelector";
import SaveButton from "../buttons/SaveButton";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import ModalError from "../alerts/ModalError";
import useTargetMonthPicker from "../../customHooks/useTargetMonthPicker";

export default function SetMoreBudgetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const { refreshTargetMonth } = useTargetMonth();
  const { targetMonth, targetYear, handleChange, isSubmittingPast } =
    useTargetMonthPicker();

  const [modalState, setModalState] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const showModal = (title, message) => {
    setModalState({
      visible: true,
      title,
      message,
    });
  };

  const onSubmit = async (data) => {
    if (isSubmittingPast) {
      showModal(
        "Invalid Date",
        "A budget for a past month or year cannot be set."
      );
      return;
    }

    const payload = {
      year: targetYear,
      month: targetMonth + 1,
      target_amount: data.targetSpending,
    };

    try {
      const res = await axios.post("/api/budgets/set-more-budgets", payload, {
        withCredentials: true,
      });

      if (res.status === 201 && res.data.message.includes("successfully")) {
        await refreshTargetMonth();
        navigate("/category-list");
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const errorMsg = e.response?.data?.message;

        if (e.response?.status === 409) {
          showModal("Budget Conflict", errorMsg || "A conflict occured.");
        } else {
          showModal("Server Error", "Something Went Wrong");
        }
      }
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
          handleChange={handleChange}
          targetYear={targetYear}
          targetMonth={targetMonth}
        />

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

        <SaveButton bgColor={"bg-sky-200"} />
      </form>

      {modalState.visible && (
        <ModalError
          title={modalState.title}
          description={modalState.message}
          onClose={() =>
            setModalState({ visible: false, title: "", message: "" })
          }
        />
      )}
    </div>
  );
}
