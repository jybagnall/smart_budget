import { useForm } from "react-hook-form";

import SaveSVGButton from "../buttons/SaveSVGButton";

export default function AddCategoryForm({ handleAdd }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();

  //the live input value
  const categoryValue = watch("category_name", "");

  const onSubmit = async (data) => {
    try {
      handleAdd(data.category_name);
      reset();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex justify-center mt-6  items-center space-x-3 bg-white px-4"
    >
      <div className="w-full max-w-md space-y-6 bg-gray-50 p-2 rounded-lg shadow-md">
        <div className="flex items-center space-x-3">
          <input
            {...register("category_name", {
              required: "Please enter the category name",
            })}
            type="text"
            name="category_name"
            id="category_name"
            className="block rounded-md w-full focus:outline-none bg-gray-50 py-2 px-3 text-base text-gray-900 placeholder:text-gray-400 sm:text-sm"
            placeholder="Category name (ex. Food)"
          />
          {errors.category_name && categoryValue.trim() === "" && (
            <span className="mt-2 text-xs text-red-600">
              {errors.category_name.message}
            </span>
          )}

          <SaveSVGButton />
        </div>
      </div>
    </form>
  );
}
