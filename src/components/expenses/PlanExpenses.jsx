import { useFetchedData } from "../../customHooks/useFetchedData";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import CategoryCard from "./CategoryCard";

export default function PlanExpenses() {
  const { dateId } = useTargetMonth();

  const { categories, items, fetchItems, setItems } = useFetchedData(dateId);

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-6">
      <ul
        role="list"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-fr"
      >
        {categories.map((category) => (
          <li
            key={category.id}
            className="w-full flex-grow min-w-[380px] max-w-[480px] mx-auto"
          >
            <CategoryCard
              key={category.id}
              category={category}
              items={items}
              fetchItems={fetchItems}
              setItems={setItems}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
