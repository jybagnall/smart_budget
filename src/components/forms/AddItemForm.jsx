import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import SaveSVGButton from "../buttons/SaveSVGButton";

export default function AddItemForm({
  selectedCategoryID,
  fetchItems,
  setItems,
  setEditID,
  onCloseForm,
  setHasFormErrorMsg,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [item_name, setItem_name] = useState("");
  const [planned_amount, setPlanned_amount] = useState("");

  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [lastSubmittedAmount, setLastSubmittedAmount] = useState("");

  const { dateId } = useTargetMonth();

  useEffect(() => {
    if (setHasFormErrorMsg) {
      setHasFormErrorMsg(Object.keys(errors).length > 0);
    }
  }, [errors, setHasFormErrorMsg]);

  const onSubmit = async (data) => {
    const { item_name, planned_amount } = data;
    if (
      !item_name.trim() ||
      !planned_amount.trim() ||
      !selectedCategoryID ||
      !dateId
    ) {
      setEditID(null);
      onCloseForm();
      return;
    }

    if (
      item_name === lastSubmittedName &&
      planned_amount === lastSubmittedAmount
    )
      return;

    try {
      const res = await axios.post(
        `/api/items/${selectedCategoryID}`,
        { item_name, planned_amount, dateId },
        {
          withCredentials: true,
        }
      );

      if (res.status === 201) {
        setItems((items) => [
          ...items,
          {
            id: res.data.id,
            category_id: selectedCategoryID,
            item_name,
            planned_amount,
            date_id: dateId,
          },
        ]);
        setItem_name("");
        setPlanned_amount("");
        setLastSubmittedName(item_name);
        setLastSubmittedAmount(planned_amount);
        setEditID(null);
        onCloseForm();
        fetchItems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-wrap md:flex-nowrap items-center w-full gap-3 px-2 py-0"
      >
        {/* Item Name Field */}
        <div className="flex-1 min-w-[120px] px-2">
          <input
            {...register("item_name", {
              required: "*Please enter the category name",
            })}
            type="text"
            name="item_name"
            id="item_name"
            className="w-full text-base text-gray-900 placeholder:text-gray-400 
            bg-transparent border-none outline-none focus:ring-0"
            placeholder="Type an expense item"
            value={item_name}
            onChange={(e) => {
              setItem_name(e.target.value);
            }}
            autoFocus
          />
        </div>

        {/* Planned Amount Field Wrapper */}
        <div className={"w-28 flex px-1 items-baseline gap-0.5"}>
          <span className="text-gray-500">$</span>
          <input
            {...register("planned_amount", {
              required: "*Please enter the target spending",
              min: { value: 0, message: "Amount must be positive" },
              maxLength: { value: 6, message: "Maximum 6 digits allowed" },
            })}
            type="number"
            name="planned_amount"
            id="planned_amount"
            className="bg-transparent text-base text-right text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0 w-full"
            placeholder="0.00"
            aria-describedby="price-currency"
            value={planned_amount}
            onChange={(e) => {
              setPlanned_amount(e.target.value.slice(0, 6));
            }}
          />
        </div>
        <SaveSVGButton />
      </form>
      {errors.item_name && (
        <span className="text-red-500 text-sm">{errors.item_name.message}</span>
      )}{" "}
      <br />
      {errors.planned_amount && (
        <span className="text-red-500 text-sm">
          {errors.planned_amount.message}
        </span>
      )}
    </div>
  );
}
