import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import MonthSelector from "../MonthSelector";
import SaveButton from "../buttons/SaveButton";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import ModalError from "../alerts/ModalError";
import useTargetMonthPicker from "../../customHooks/useTargetMonthPicker";
import useModal from "../../customHooks/useModal";

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
  const { modalState, showModal, hideModal } = useModal();

  const onSubmit = async (data) => {
    if (isSubmittingPast()) {
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
        const { dateId, year, month } = res.data;
        await refreshTargetMonth({ id: dateId, year, month });

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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6 transition-all duration-300"
      >
        <MonthSelector
          handleChange={handleChange}
          targetYear={targetYear}
          targetMonth={targetMonth}
        />

        <div className="relative mt-2">
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 bg-white focus-within:ring-2 focus-within:ring-sky-400">
            <span className="text-gray-500 mr-2 text-base font-medium">$</span>
            <input
              {...register("targetSpending", {
                required: "Please enter your target spending",
                min: { value: 0, message: "Amount must be positive" },
              })}
              type="number"
              name="targetSpending"
              id="targetSpending"
              className="flex-1 text-base text-gray-900 placeholder-gray-400 border-none bg-transparent focus:outline-none"
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
          onClose={() => hideModal()}
        />
      )}
    </div>
  );
}
