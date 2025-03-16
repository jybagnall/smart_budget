import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function AddItemForm({ selectedCategoryID, fetchItems }) {
  const {
    register,
    formState: { errors },
  } = useForm();

  const [item_name, setItem_name] = useState("");
  const [planned_amount, setPlanned_amount] = useState("");
  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [submitTimeoutID, setSubmitTimeoutID] = useState(null);

  const itemRef = useRef(null);
  const amountRef = useRef(null);

  const handleBlur = () => {
    if (submitTimeoutID) clearTimeout(submitTimeoutID);

    setSubmitTimeoutID(
      setTimeout(async () => {
        if (!item_name || !planned_amount || !selectedCategoryID) return;
        if (item_name === lastSubmittedName) return;

        try {
          const res = await axios.post(
            `/api/items/${selectedCategoryID}`,
            { item_name, planned_amount },
            {
              withCredentials: true,
            }
          );

          if (res.status === 201) {
            setItem_name("");
            setPlanned_amount("");
            setLastSubmittedName(item_name);
            fetchItems();
          }
        } catch (e) {
          console.error(e);
        }
      }, 500)
    );
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (item_name.length >= 2 && !planned_amount) {
        amountRef.current?.focus();
      } else if (planned_amount.length >= 2 && !item_name) {
        itemRef.current?.focus();
      }
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [item_name, planned_amount]);

  return (
    <div className="py-1">
      <form className="flex justify-between items-center w-full gap-x-4 px-1 py-1">
        <div className="flex-1">
          <input
            {...register("item_name", {
              required: "*Please enter the category name",
            })}
            type="text"
            name="item_name"
            id="item_name"
            className="w-full gap-x-1 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:rounded-md focus:-outline-offset-1 focus:outline-indigo-600 bg-white text-base text-gray-900 placeholder:text-gray-400 sm:text-sm"
            placeholder="Type an expense item"
            value={item_name}
            ref={itemRef}
            onChange={(e) => setItem_name(e.target.value)}
            onBlur={handleBlur}
          />
        </div>

        <div className="relative w-32 left-3 bg-white">
          <span
            className="text-gray-500 absolute top-1/2 transform -translate-y-1/2 transition-all"
            style={{
              left:
                planned_amount.length > 0
                  ? `${1 + planned_amount.length * 0.5}ch`
                  : "0.5ch",
            }}
          >
            $
          </span>
          <input
            {...register("planned_amount", {
              required: "*Please enter the target spending",
              min: { value: 0, message: "Amount must be positive" },
              maxLength: { value: 6, message: "Maximum 6 digits allowed" },
            })}
            type="number"
            name="planned_amount"
            id="planned_amount"
            className="w-full pl-0 pr-1 border-none bg-transparent text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2  focus:ring-indigo-600 focus:rounded-md text-right"
            placeholder="0.00"
            style={{
              appearance: "none",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
            aria-describedby="price-currency"
            value={planned_amount}
            ref={amountRef}
            onChange={(e) => setPlanned_amount(e.target.value.slice(0, 6))}
            onBlur={handleBlur}
          />
        </div>
      </form>
      <div className="flex flex-col mt-1">
        {errors.item_name && (
          <span className="text-xs text-red-600">
            {errors.item_name.message}
          </span>
        )}
        {errors.planned_amount && (
          <span className="text-xs text-red-600">
            {errors.planned_amount.message}
          </span>
        )}
      </div>
    </div>
  );
}
