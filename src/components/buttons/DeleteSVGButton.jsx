export default function DeleteSVGButton({ onClick }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="p-2 text-red-600 hover:text-red-500"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
