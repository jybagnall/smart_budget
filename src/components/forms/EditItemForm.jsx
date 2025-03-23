import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import SaveSVGButton from "../buttons/SaveSVGButton";

export default function EditItemForm({ item, handleToggleEdit, setItems }) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const { dateId } = useTargetMonth();

  const [item_name, setItem_name] = useState(item.item_name);
  const [planned_amount, setPlanned_amount] = useState(item.planned_amount);

  const onSubmit = async (data) => {
    const updatedItem = {
      item_name: data.item_name,
      planned_amount: data.planned_amount,
      dateId,
    };

    try {
      const res = await axios.patch(
        `/api/items/${item.category_id}/${item.id}`,
        updatedItem,
        {
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        setItems((items) =>
          items.map((mappedItem) =>
            mappedItem.id === item.id
              ? { ...mappedItem, item_name, planned_amount }
              : mappedItem
          )
        );
        handleToggleEdit();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-1">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-between items-center w-full gap-x-4 px-1 py-1"
      >
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
            value={item_name}
            onChange={(e) => {
              setItem_name(e.target.value);
            }}
          />
        </div>

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
            style={{
              appearance: "none",
              MozAppearance: "textfield",
              WebkitAppearance: "none",
            }}
            aria-describedby="price-currency"
            value={planned_amount}
            onChange={(e) => {
              setPlanned_amount(e.target.value.slice(0, 6));
            }}
          />
        </div>

        <SaveSVGButton />
      </form>
    </div>
  );
}
