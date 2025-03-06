import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    fetchUser(abortController).catch(console.error); // Catch async errors

    return () => {
      abortController.abort();
    };
  }, []);

  async function fetchUser(abortController) {
    setLoading(true);
    try {
      const res = await axios.get("/api/auth/user", {
        signal: abortController.signal,
        withCredentials: true,
      });

      setUser(res.data.user);
    } catch (e) {
      console.error("Error fetching user:", e);

      if (!abortController.signal.aborted) {
        setUser(null);
        if (e.response?.status === 401) {
          window.location.href = "/login";
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
