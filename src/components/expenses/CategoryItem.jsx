import DeleteSVGButton from "../buttons/DeleteSVGButton";

export default function CategoryItem({ handleDelete, id, category_name }) {
  return (
    <div className="block rounded-md w-full focus:outline-none py-2 px-3 text-base text-gray-900 sm:text-sm">
      <label htmlFor={`category-${id}`} className="font-medium text-gray-900">
        {category_name}
      </label>
      <div>
        <DeleteSVGButton onClick={() => handleDelete(id)} />
      </div>
    </div>
  );
}
