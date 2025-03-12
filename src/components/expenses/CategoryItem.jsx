import DeleteSVGButton from "../buttons/DeleteSVGButton";

export default function CategoryItem({ handleDelete, id, category_name }) {
  return (
    <div className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 shadow-xs">
      <label htmlFor={`category-${id}`} className="font-medium text-green-700">
        {category_name}
      </label>
      <div>
        <DeleteSVGButton onClick={() => handleDelete(id)} />
      </div>
    </div>
  );
}
