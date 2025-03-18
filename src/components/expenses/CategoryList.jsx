import { useState, useEffect } from "react";
import axios from "axios";

import AddCategoryForm from "../forms/AddCategoryForm";
import CategoryItem from "./CategoryItem";
import NavigationButton from "../buttons/NavigationButton";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

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
 
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (category_name) => {
    try {
      await axios.post(
        "/api/categories",
        { category_name: category_name.trim() },
        { withCredentials: true }
      );

      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`/api/categories/${categoryId}`, {
        withCredentials: true,
      });
      fetchCategories();
    } catch (e) {
      console.error("Error adding category:", e);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <label
          htmlFor="category"
          className="block text-lg font-semibold text-gray-900 ml-4"
        >
          Add your expense categories
        </label>

        <AddCategoryForm
          fetchCategories={fetchCategories}
          handleAdd={handleAdd}
        />

        {/* boder */}
        <div className="flex items-center justify-between space-x-3 mt-4 border-t border-gray-200 px-2 py-2 sm:px-3"></div>

        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            {...category}
            handleDelete={handleDelete}
          />
        ))}
        <div className="mt-3">
          <NavigationButton to={"/plan-expenses"}>
            Navigate to add items
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
