export default function SaveButton({ bgColor }) {
  return (
    <button
      type="submit"
      className={`w-full rounded-md px-4 py-2 text-gray-900 font-semibold hover:bg-sky-300 ${bgColor}`}
    >
      Save
    </button>
  );
}
