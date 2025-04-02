import axios from "axios";
import { useContext } from "react";

import UserContext from "../contexts/UserContext";

export default function LogoutSVG() {
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await axios.get("api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      location.href = "/";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };
  return (
    <button
      onClick={handleLogout}
      title="logout"
      className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 12H9.75M15.75 9l2.25 3-2.25 3"
        />
      </svg>
    </button>
  );
}
