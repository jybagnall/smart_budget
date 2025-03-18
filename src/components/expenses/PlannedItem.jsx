import { useState } from "react";
import axios from "axios";

import TrashIcon from "../buttons/TrashIcon";
import EditItemForm from "../forms/EditItemForm";

export default function PlannedItem({ selectedCategoryID, item, fetchItems }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing((isEditing) => !isEditing);
  };

  const handleDelete = async (categoryID, itemID) => {
    try {
      await axios.delete(`/api/items/${categoryID}/${itemID}`, {
        withCredentials: true,
      });
      fetchItems();
    } catch (e) {
      console.error("Error deleting item", e);
    }
  };

  return (
    <>
      {isEditing ? (
        <EditItemForm
          item={item}
          selectedCategoryID={selectedCategoryID}
          fetchItems={fetchItems}
          handleToggleEdit={handleToggleEdit}
        />
      ) : (
        <div
          key={item.id}
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
              handleDelete(item.category_id, item.id);
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

// Tooltip
// {isTrashHovered && (
//   <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 text-xs text-white bg-gray-700 rounded-md shadow-md whitespace-nowrap">
//     Remove this expense item
//   </div>
// )}
