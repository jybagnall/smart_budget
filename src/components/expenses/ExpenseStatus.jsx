import { NavLink } from "react-router-dom";

export default function ExpenseStatus() {
  return (
    <div>
      expense status -- display pie chart
      <NavLink
        to="/category-list"
        className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Add a new category
      </NavLink>
    </div>
  );
}
