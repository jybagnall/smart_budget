import { useState, useEffect, useCallback } from "react";
import axios from "axios";

import AddCategoryForm from "../forms/AddCategoryForm";
import CategoryItem from "./CategoryItem";
import NavigationButton from "../buttons/NavigationButton";
import Loading from "../alerts/Loading";
import { useTargetMonth } from "../../contexts/TargetMonthContext";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const { dateId, isLoading } = useTargetMonth();

  const fetchCategories = useCallback(async () => {
    if (!dateId) return; // prevent unnecessary api calls

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

  if (isLoading) {
    return <Loading />;
  }

  const handleAdd = async (category_name) => {
    try {
      await axios.post(
        `/api/categories`,
        { category_name: category_name.trim(), dateId },
        { withCredentials: true }
      );

      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDelete = async (categoryId) => {
    const rollbackCategories = [...categories];

    setCategories((categories) =>
      categories.filter((c) => c.id !== categoryId)
    );

    try {
      await axios.delete(`/api/categories/${categoryId}`, {
        withCredentials: true,
      });
    } catch (e) {
      console.error("Error deleting category:", e);
      setCategories(rollbackCategories);
      // alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen flex justify-center py-30">
      <div className="w-full max-w-md bg-white p-4 rounded-lg shadow-md">
        <label
          htmlFor="category"
          className="block text-lg font-semibold text-gray-900 ml-4"
        >
          Add your expense categories
        </label>

        <AddCategoryForm handleAdd={handleAdd} />

        {/* boder */}
        <div className="flex items-center justify-between space-x-3 mt-4 border-t border-gray-200 px-2 py-2 sm:px-3"></div>

        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            {...category}
            handleDelete={handleDelete}
          />
        ))}
        <div className="mt-10">
          <NavigationButton to={"/plan-expenses"}>
            Navigate to add items
          </NavigationButton>
        </div>
      </div>
    </div>
  );
}
