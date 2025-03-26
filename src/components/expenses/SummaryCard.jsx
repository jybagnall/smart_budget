import MenuDropDownButton from "../buttons/MenuDropDownButton";

export default function SummaryCard({
  title,
  summary,
  fontWeight,
  headTo,
  link,
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <dt className="text-sm font-medium text-gray-500">{title}</dt>
          <dd
            className={`mt-2 font-semibold tracking-tight text-gray-900 ${fontWeight}`}
          >
            {summary}
          </dd>
        </div>
        <div className="self-center">
          <MenuDropDownButton headTo={headTo} link={link} />
        </div>
      </div>
    </div>
  );
}
