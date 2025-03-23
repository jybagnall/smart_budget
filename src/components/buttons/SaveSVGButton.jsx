export default function SaveSVGButton() {
  return (
    <button
      type="submit"
      title="save"
      className="p-2 text-green-600 hover:text-green-500"
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
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </button>
  );
}
