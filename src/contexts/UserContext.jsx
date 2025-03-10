import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasBudget, setHasBudget] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    fetchUser(abortController).catch(console.error); // Catch async errors

    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setHasBudget(false);
    }
  }, [user]);

  async function fetchUser(abortController) {
    setLoading(true);
    try {
      const res = await axios.get("/api/auth/user", {
        signal: abortController.signal,
        withCredentials: true,
      });

      setUser(res.data.user);

      if (res.data.user) {
        const budgetRes = await axios.get("/api/auth/check-budget", {
          withCredentials: true,
        });
        setHasBudget(budgetRes.data.hasBudget);
      }
    } catch (e) {
      console.error("Error fetching user:", e);

      if (!abortController.signal.aborted) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, loading, setLoading, hasBudget }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
