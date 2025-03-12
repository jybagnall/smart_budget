import axios from "axios";
import { useContext } from "react";

import UserContext from "../../contexts/UserContext";

export default function LogoutButton() {
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
      className="text-teal-400 hover:text-teal-300 text-sm"
    >
      Logout
    </button>
  );
}
