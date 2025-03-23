import { NavLink } from "react-router-dom";

export default function NavigationButton({ to, children }) {
  return (
    <NavLink
      to={to}
      className="inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-teal-700 hover:text-teal-600 focus:outline-none focus:ring-0 border-none shadow-none bg-transparent"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
        />
      </svg>
      {children}
    </NavLink>
  );
}
