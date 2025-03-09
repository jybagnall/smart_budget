export default function AddItemButton() {
  return (
    <button
      type="button"
      class="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-xs text-teal-700 shadow-xs hover:text-teal-600 "
    >
      <svg
        className="size-3"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>{" "}
      Add Item
    </button>
  );
}
