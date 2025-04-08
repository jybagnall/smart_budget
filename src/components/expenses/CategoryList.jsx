import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

import AddCategoryForm from "../forms/AddCategoryForm";
import CategoryItem from "./CategoryItem";
import NavigationButton from "../buttons/NavigationButton";
import Loading from "../alerts/Loading";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import useModal from "../../customHooks/useModal";
import ModalError from "../alerts/ModalError";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const { dateId, isLoading, targetMonth, targetYear } = useTargetMonth();
  const { modalState, showModal, hideModal } = useModal();

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

  const monthIsReady =
    !isLoading &&
    dateId !== null &&
    targetMonth !== null &&
    targetYear !== null;

  useEffect(() => {
    if (monthIsReady) {
      fetchCategories();
    }
  }, [monthIsReady, fetchCategories]);

  if (!monthIsReady) {
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
      showModal(
        "Deletion Failed",
        "We couldn't delete that category due to a server error. Please try again."
      );
    }
  };

  return (
    <div className="bg-neutral-50  flex justify-center py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 transition-all">
        <div className="p-6 sm:p-8 md:p-10 space-y-8">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-800 mb-2">
              Add your expense categories
            </h2>
            <p className="text-sm text-gray-500">
              Create categories for tracking your monthly budget.
            </p>
          </div>

          {/* Add Form */}
          <AddCategoryForm handleAdd={handleAdd} />

          {/* Divider */}
          {categories.length > 0 && <hr className="border-t border-gray-200" />}

          {/* Category List */}
          <AnimatePresence mode="popLayout">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <CategoryItem {...category} handleDelete={handleDelete} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>

          {/* CTA Button */}
          <div className="pt-6 border-t border-gray-100">
            <NavigationButton to="/plan-expenses">
              Navigate to add items
            </NavigationButton>
          </div>
        </div>
      </div>
      {modalState.visible && (
        <ModalError
          title={modalState.title}
          description={modalState.message}
          onClose={() => hideModal()}
        />
      )}
    </div>
  );
}
