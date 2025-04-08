import { PlusIcon } from "@heroicons/react/16/solid";
import { useNavigate } from "react-router-dom";

export default function CategoryCardEmpty() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg bg-white text-center p-6 shadow-sm">
      <h2 className="text-lg font-medium text-gray-700 mb-2">
        No categories set for this month
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        You have not added any categories for your budget yet.
      </p>
      <button
        onClick={() => navigate("/category-list")}
        className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <PlusIcon className="h-4 w-4" />
        Add Categories
      </button>
    </div>
  );
}
