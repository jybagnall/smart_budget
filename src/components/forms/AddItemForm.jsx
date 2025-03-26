import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useTargetMonth } from "../../contexts/TargetMonthContext";

export default function AddItemForm({
  selectedCategoryID,
  fetchItems,
  setItems,
  setEditID,
  onCloseForm,
}) {
  const {
    register,
    trigger,
    setValue,
    formState: { errors },
  } = useForm();

  const [item_name, setItem_name] = useState("");
  const [planned_amount, setPlanned_amount] = useState("");

  const [lastSubmittedName, setLastSubmittedName] = useState("");
  const [lastSubmittedAmount, setLastSubmittedAmount] = useState("");

  const { dateId } = useTargetMonth();

  const itemRef = useRef(null);
  const amountRef = useRef(null);
  const submitTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  const handleBlur = () => {
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    submitTimeoutRef.current = setTimeout(async () => {
      if (!item_name || !planned_amount || !selectedCategoryID || !dateId)
        return;

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

      if (item_name.length >= 2 && !planned_amount) {
        amountRef.current?.focus();
      } else if (planned_amount.length >= 2 && !item_name) {
        itemRef.current?.focus();
      }
    }, 500);
  };

  return (
    <div className="py-1">
      <form className="flex justify-between items-center w-full gap-x-4 px-1 py-1">
        {/* Item Name Field Wrapper */}
        <div
          className={`w-full px-2 py-1 rounded-md
          ${
            errors.item_name
              ? "border border-red-500"
              : "border border-gray-300"
          } 
          bg-white`}
        >
          <input
            {...register("item_name", {
              required: "*Please enter the category name",
            })}
            type="text"
            name="item_name"
            id="item_name"
            className="w-full text-base text-gray-900 placeholder:text-gray-400 
            bg-transparent border-none outline-none focus:ring-0 focus:bg-white"
            placeholder="Type an expense item"
            value={item_name}
            ref={itemRef}
            onChange={(e) => {
              setItem_name(e.target.value);
              setValue("item_name", e.target.value, { shouldValidate: true });
            }}
            onBlur={async () => {
              await trigger(["item_name", "planned_amount"]);
              handleBlur();
            }}
            autoFocus
          />
        </div>

        {/* Planned Amount Field Wrapper */}
        <div
          className={`relative w-32 left-3 flex items-center px-2 py-1 rounded-md
          ${
            errors.planned_amount
              ? "border border-red-500"
              : "border border-gray-300"
          }
          bg-white`}
        >
          <span className="text-gray-500 select-none pointer-events-none">
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
            className="w-full pl-2 text-right bg-transparent text-lg text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0"
            placeholder="0.00"
            style={{
              appearance: "none",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
            aria-describedby="price-currency"
            value={planned_amount}
            ref={amountRef}
            onChange={(e) => {
              setPlanned_amount(e.target.value.slice(0, 6));
              setValue("planned_amount", e.target.value, {
                shouldValidate: true,
              });
            }}
            onBlur={async () => {
              await trigger(["item_name", "planned_amount"]);
              handleBlur();
            }}
          />
        </div>
      </form>
    </div>
  );
}
