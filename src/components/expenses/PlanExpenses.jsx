import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddItemButton from "../buttons/AddItemButton";
import AddItemForm from "../forms/AddItemForm";
import PlannedItem from "./PlannedItem";
import { useTargetMonth } from "../../contexts/TargetMonthContext";

export default function PlanExpenses() {
  const { dateId } = useTargetMonth();
  const [categories, setCategories] = useState([]);

  const [items, setItems] = useState([]);
  const [activeCategoryID, setActiveCategoryID] = useState(null);
  const [editID, setEditID] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!dateId) return;

    try {
      const res = await axios.get(`/api/categories?dateId=${dateId}`, {
        withCredentials: true,
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [dateId]);

  useEffect(() => {
    if (dateId) {
      fetchCategories();
    }
  }, [dateId, fetchCategories]);

  const fetchItems = useCallback(async () => {
    if (!dateId) return;

    try {
      const res = await axios.get(`/api/items?dateId=${dateId}`, {
        withCredentials: true,
      });
      setItems(res.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [dateId]);

  useEffect(() => {
    if (dateId) {
      fetchItems();
    }
  }, [dateId, fetchItems]);

  const handleShowForm = (categoryID) => {
    setActiveCategoryID((prevID) =>
      prevID === categoryID ? null : categoryID
    );
  };

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6"
      >
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => setActiveCategoryID(category.id)}
            className="w-[90%] min-w-[400px] sm:w-110 md:w-90 lg:w-50 mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md min-h-60 max-h-96"
          >
            <div className="flex items-center justify-between bg-gray-50 px-4 py-2 h-12">
              <div className="text-sm/6 font-medium text-green-700">
                {category.category_name}
              </div>

              <div className="relative ml-auto">
                <div className="-m-2.5 block p-2.5 text-gray-400">Planned</div>
              </div>
            </div>

            <dl className="-my-3 divide-y divide-gray-100 px-4 py-2 text-sm/6">
              {items
                .filter((item) => item.category_id === category.id)
                .map((item) => (
                  <PlannedItem
                    key={item.id}
                    item={item}
                    fetchItems={fetchItems}
                    setItems={setItems}
                    setActiveCategoryID={setActiveCategoryID}
                    editID={editID}
                    setEditID={setEditID}
                  />
                ))}

              {activeCategoryID === category.id && editID === null && (
                <AddItemForm
                  key={category.id}
                  selectedCategoryID={category.id}
                  fetchItems={fetchItems}
                  setItems={setItems}
                />
              )}

              <div className="flex justify-start py-5">
                <AddItemButton onClick={() => handleShowForm(category.id)} />
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
