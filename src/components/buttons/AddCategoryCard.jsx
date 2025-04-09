import { useState } from "react";

export default function AddCategoryCard() {
  return (
    <button
      type="button"
      className="flex flex-1 items-center justify-center rounded-lg border-2 border-gray-300 p-6 text-center hover:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:outline-none min-h-[180px]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="mx-auto size-12 text-gray-400"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  );
}

// {isModalOpen && (
//       <AddCategoryModal
//         isModalOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//       />
//     )}
