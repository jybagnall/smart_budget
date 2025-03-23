import DeleteSVGButton from "../buttons/DeleteSVGButton";

export default function CategoryItem({ handleDelete, id, category_name }) {
  return (
    <div className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 m-1 shadow-xs bg-stone-50">
      <label htmlFor={`category-${id}`} className="font-medium text-gray-800">
        {category_name}
      </label>
      <div>
        <DeleteSVGButton
          onClick={() => handleDelete(id)}
          aria-label={`Delete ${category_name}`}
        />
      </div>
    </div>
  );
}
