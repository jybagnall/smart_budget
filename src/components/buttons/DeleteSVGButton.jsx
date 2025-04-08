export default function DeleteSVGButton({ onClick }) {
  return (
    <button
      type="submit"
      onClick={onClick}
      className="ml-0 p-1 text-rose-300 hover:text-rose-600 transition-colors duration-150"
    >
      <svg
        className="w-4 h-4 font-bold"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
