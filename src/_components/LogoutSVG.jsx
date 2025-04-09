import axios from "axios";
import { useContext } from "react";
import { PowerIcon } from "@heroicons/react/24/outline";

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
      title="Logout"
      className="group relative p-2 rounded-full transition-all duration-200 ease-in-out hover:ring-2 hover:ring-rose-400 hover:bg-red-50"
    >
      <PowerIcon className="w-6 h-6 text-gray-600 group-hover:text-rose-500 transition-colors duration-200" />
    </button>
  );
}
