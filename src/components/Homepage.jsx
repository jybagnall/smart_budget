import { NavLink } from "react-router-dom";
import { useContext } from "react";

import UserContext from "../contexts/UserContext";
import LogoutButton from "./buttons/LogoutButton";

export default function Homepage() {
  const { user } = useContext(UserContext);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-emerald-700 sm:text-7lg">
            Take Control of Your Finances
          </h1>
          <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
            Set your monthly spending target, <br /> track expenses, <br />
            and stay on top of your finances.
          </p>
          <div className="mt-15 flex items-center justify-center gap-x-6">
            {!user && (
              <NavLink
                to="/login"
                className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                Get started
              </NavLink>
            )}
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
