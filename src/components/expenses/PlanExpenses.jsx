import { useFetchedData } from "../../../backend/helpers/useFetchedData";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import CategoryCard from "./CategoryCard";

export default function PlanExpenses() {
  const { dateId } = useTargetMonth();

  const { categories, items, fetchItems, setItems } = useFetchedData(dateId);

  return (
    <div className="w-full max-w-3xl mx-auto pt-4 pb-6">
      <ul
        role="list"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            items={items}
            fetchItems={fetchItems}
            setItems={setItems}
          />
        ))}
      </ul>
    </div>
  );
}
