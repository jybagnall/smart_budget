import { useState, useEffect } from "react";
import axios from "axios";
import AddItemButton from "../buttons/AddItemButton";

export default function PlanExpenses() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/api/categories", {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6"
      >
        {categories.map((category) => (
          <li
            key={category.id}
            className="w-[90%] min-w-[400px] sm:w-110 md:w-90 lg:w-80 mx-auto overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md min-h-60 max-h-96"
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
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Last invoice</dt>
                <dd className="text-gray-700">Add Item</dd>
              </div>

              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Amount</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900">$ amount</div>
                </dd>
              </div>
              <div className="flex justify-start py-3">
                <AddItemButton
                  onClick={() => setSelectedCategory(category.id)}
                />
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
