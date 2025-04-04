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
    if (!dateId) return;

    try {
      console.log(dateId);
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
        data: { dateId },
        withCredentials: true,
      });
    } catch (e) {
      console.error("Error deleting category:", e);
      setCategories(rollbackCategories);
      // alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="bg-white h-fit flex justify-center py-5">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-4 sm:p-6 md:p-8">
          <label
            htmlFor="category"
            className="block text-lg font-semibold text-gray-900 ml-4"
          >
            Add your expense categories
          </label>

          <AddCategoryForm handleAdd={handleAdd} />

          {/* boder */}
          <hr className="w-full mt-7 mb-7 border-t border-gray-200 px-4 sm:px-6 lg:px-8" />

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
    </div>
  );
}
