export default function PlannedItem({ setSelectedCategoryID, item }) {
  return (
    <div
      key={item.id}
      onClick={() => setSelectedCategoryID(item.category_id)}
      className="flex justify-between gap-x-4 py-3"
    >
      <dt className="text-gray-500">{item.item_name}</dt>
      <dd className="text-gray-700">${item.planned_amount}</dd>
    </div>
  );
}
