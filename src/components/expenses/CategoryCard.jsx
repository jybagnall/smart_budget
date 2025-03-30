import { useState } from "react";
import PlannedItem from "../expenses/PlannedItem";
import AddItemForm from "../forms/AddItemForm";
import AddItemButton from "../buttons/AddItemButton";

export default function CategoryCard({
  category,
  items,
  fetchItems,
  setItems,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editID, setEditID] = useState(null);

  const itemsPerCategory = items.filter(
    (item) => item.category_id === category.id
  );

  return (
    <li
      key={category.id}
      className="w-full max-w-md h-[250px] mx-auto rounded-xl border border-gray-200 bg-white shadow-md flex flex-col"
    >
      <div className="flex items-center justify-between bg-gray-50 px-4 py-2 h-12">
        <div className="text-sm/6 font-medium text-green-700">
          {category.category_name}
        </div>

        <div className="relative ml-auto">
          <div className="-m-2.5 block p-2.5 text-gray-400">Spent</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2">
        <dl className="-my-3 divide-y divide-gray-100 px-4 py-2 text-sm/6">
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

          {isAdding && editID == null && (
            <AddItemForm
              key={category.id}
              selectedCategoryID={category.id}
              fetchItems={fetchItems}
              setItems={setItems}
              setEditID={setEditID}
              onCloseForm={() => setIsAdding(false)}
            />
          )}
        </dl>
      </div>

      {!isAdding && editID == null && (
        <div className="px-4 py-2">
          <AddItemButton onClick={() => setIsAdding(true)} />
        </div>
      )}
    </li>
  );
}
