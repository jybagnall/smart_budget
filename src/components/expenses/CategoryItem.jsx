import DeleteSVGButton from "../buttons/DeleteSVGButton";

export default function CategoryItem({ handleDelete, id, category_name }) {
  return (
    <div className="inline-flex items-center justify-center gap-x-2 rounded-md px-3 py-1 bg-stone-50 shadow-sm">
      <span className="text-sm font-medium text-gray-800">{category_name}</span>
      <div>
        <DeleteSVGButton
          onClick={() => handleDelete(id)}
          aria-label={`Delete ${category_name}`}
        />
      </div>
    </div>
  );
}
