import { CheckIcon } from "@heroicons/react/24/outline";
import { getRandomColor } from "../../../backend/helpers/api";

export default function SpendingByCategory({ sumPerCategory }) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sumPerCategory.map((category, index) => (
          <li key={category.category_name}>
            <div className="relative pb-8">
              {index < sumPerCategory.length - 1 && (
                <span
                  className="absolute left-2.5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}

              <div className="relative flex items-center space-x-3">
                <span
                  className={`flex size-5 items-center justify-center rounded-full ring-4 ring-white ${getRandomColor(
                    category.category_name
                  )}`}
                >
                  <CheckIcon
                    className="w-4 h-4 text-white"
                    aria-hidden="true"
                  />
                </span>

                <div className="flex min-w-0 flex-1 justify-between space-x-4">
                  <p className="text-sm text-gray-500">
                    {category.category_name}
                  </p>
                  <p className="text-sm text-gray-500 whitespace-nowrap">
                    {category.total_per_category}
                  </p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
