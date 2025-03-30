import { NavLink } from "react-router-dom";

export default function Tab({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
          isActive
            ? "border-sky-600 text-gray-900"
            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
        } text-xl font-semibold`
      }
    >
      {children}
    </NavLink>
  );
}
