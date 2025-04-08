import PlannedItem from "../expenses/PlannedItem";
import AddItemForm from "../forms/AddItemForm";
import AddItemButton from "../buttons/AddItemButton";
import { useState, useEffect } from "react";

const activeStyle = "border-blue-400 outline outline-2 outline-blue-200";
const inactiveStyle = "border-gray-200";
const formErrorStyle = "border-red-400 outline outline-2 outline-red-300";

export default function CategoryCard({
  category,
  items,
  fetchItems,
  setItems,
  activeCategoryID,
  setActiveCategoryID,
  editID,
  setEditID,
}) {
  const handleActive = () => {
    setActiveCategoryID(category.id);
  };

  const isEditingItem = items.some(
    (item) => item.category_id === category.id && editID === item.id
  );

  const isActive = activeCategoryID === category.id || isEditingItem;

  const itemsPerCategory = items.filter(
    (item) => item.category_id === category.id
  );

  const [hasFormErrorMsg, setHasFormErrorMsg] = useState(false);

  useEffect(() => {
    if (activeCategoryID !== category.id) {
      setHasFormErrorMsg(false);
    }
  }, [activeCategoryID, category.id]);

  return (
    <div
      key={category.id}
      className={`h-[250px] w-full flex flex-col rounded-xl shadow-lg transition-all duration-300 border bg-white hover:shadow-xl ${
        hasFormErrorMsg
          ? formErrorStyle
          : isActive
          ? activeStyle
          : inactiveStyle
      }`}
    >
      <div className="flex items-center justify-between bg-gray-50 px-6 py-2 rounded-t-xl border-b border-gray-200">
        <div className="text-sm font-semibold text-green-700 capitalize tracking-tight">
          {category.category_name}
        </div>

        <div className="relative ml-auto">
          <div className="-m-2.5 block pr-8 text-gray-400 text-sm font-semibold ">
            Spent
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <dl className="py-0 text-sm">
          {itemsPerCategory.map((item) => (
            <PlannedItem
              key={item.id}
              item={item}
              fetchItems={fetchItems}
              setItems={setItems}
              editID={editID}
              setEditID={setEditID}
            />
          ))}

          {isActive && editID == null && (
            <AddItemForm
              key={category.id}
              selectedCategoryID={category.id}
              fetchItems={fetchItems}
              setItems={setItems}
              setEditID={setEditID}
              onCloseForm={() => {
                setHasFormErrorMsg(false);
                setActiveCategoryID(null);
              }}
              setHasFormErrorMsg={setHasFormErrorMsg}
            />
          )}
        </dl>
      </div>

      {!isActive && editID == null && (
        <div className="px-4 py-2">
          <AddItemButton onClick={handleActive} />
        </div>
      )}
    </div>
  );
}
