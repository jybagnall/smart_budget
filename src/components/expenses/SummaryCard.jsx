import MenuDropDownButton from "../buttons/MenuDropDownButton";

export default function SummaryCard({
  title,
  summary,
  fontWeight,
  headTo,
  onClick,
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-7 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <dt className="text-md font-medium text-sky-600">{title}</dt>
          <dd
            className={`mt-2 font-semibold tracking-tight text-gray-700 ${fontWeight}`}
          >
            {summary}
          </dd>
        </div>
        <div className="self-center">
          <MenuDropDownButton headTo={headTo} onClick={onClick} />
        </div>
      </div>
    </div>
  );
}
