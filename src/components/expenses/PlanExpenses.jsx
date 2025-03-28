import { useFetchedData } from "../../../backend/helpers/useFetchedData";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import CategoryCard from "./CategoryCard";

export default function PlanExpenses() {
  const { dateId } = useTargetMonth();
  console.log(dateId)
  const { categories, items, fetchItems, setItems } = useFetchedData(dateId);

  return (
    <div className="bg-white min-h-screen flex justify-center py-10">
      <ul
        role="list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6"
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
