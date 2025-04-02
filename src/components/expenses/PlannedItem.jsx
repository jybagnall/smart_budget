import { useState } from "react";
import axios from "axios";

import TrashIcon from "../buttons/TrashIcon";
import EditItemForm from "../forms/EditItemForm";
import { useTargetMonth } from "../../contexts/TargetMonthContext";

export default function PlannedItem({
  item,
  fetchItems,
  setItems,
  editID,
  setEditID,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const { dateId } = useTargetMonth();

  const isEditing = editID === item.id;

  const handleToggleEdit = () => {
    setEditID(editID === item.id ? null : item.id);
  }; // exit or enter edit mode.

  const handleDelete = async (itemID) => {
    setItems((items) => items.filter((item) => item.id !== itemID));

    try {
      const res = await axios.delete(`/api/items/${itemID}`, {
        data: { dateId },
        withCredentials: true,
      });

      if (res.status !== 200) {
        await fetchItems();
      }
    } catch (e) {
      console.error("Error deleting item", e);
      await fetchItems();
    }
  };

  return (
    <>
      {isEditing ? (
        <EditItemForm
          item={item}
          handleToggleEdit={handleToggleEdit}
          setItems={setItems}
        />
      ) : (
        <div
          onClick={handleToggleEdit}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex justify-between items-center gap-x-4 py-3 relative"
        >
          <dt className="text-gray-500">{item.item_name}</dt>
          <div
            className={`text-gray-500 flex items-center transition-all duration-200 ${
              isHovered ? "pr-8" : "pr-2"
            }`}
          >
            <span>$</span>
            <span>{item.planned_amount}</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(item.id);
            }}
            className={`absolute right-0 transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <TrashIcon />
          </button>
        </div>
      )}
    </>
  );
}
