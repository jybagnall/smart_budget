import { useFetchedData } from "../../customHooks/useFetchedData";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import CategoryCard from "./CategoryCard";
import { useState, useEffect } from "react";
import axios from "axios";

import CategoryCardEmpty from "./CategoryCardEmpty";
import AddCategoryCard from "../buttons/AddCategoryCard";
import AddCategoryModal from "../forms/AddCategoryModal";

export default function PlanExpenses() {
  const { dateId } = useTargetMonth();
  const { categories, fetchCategories, items, fetchItems, setItems } =
    useFetchedData(dateId);
  const [activeCategoryID, setActiveCategoryID] = useState(null);
  const [editID, setEditID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoriesExist = categories.length > 0;

  return (
    <div className="w-full px-4 pt-4 pb-6">
      {categoriesExist ? (
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full px-4"
        >
          {categories.map((category) => (
            <li key={category.id} className="flex flex-col min-w-0">
              <CategoryCard
                key={category.id}
                category={category}
                items={items}
                fetchItems={fetchItems}
                setItems={setItems}
                activeCategoryID={activeCategoryID}
                setActiveCategoryID={setActiveCategoryID}
                editID={editID}
                setEditID={setEditID}
              />
            </li>
          ))}
          <li
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col min-w-0"
          >
            <AddCategoryCard />
          </li>
        </ul>
      ) : (
        <CategoryCardEmpty />
      )}
      {isModalOpen && (
        <AddCategoryModal
          categories={categories}
          dateId={dateId}
          closeModal={async () => {
            await fetchCategories();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
