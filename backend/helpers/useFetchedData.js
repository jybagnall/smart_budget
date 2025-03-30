import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetchedData(dateId) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    if (!dateId) return;

    try {
      const res = await axios.get(`/api/items?dateId=${dateId}`, {
        withCredentials: true,
      });
      setItems(res.data || []);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  }, [dateId]);

  useEffect(() => {
    if (!dateId) return;

    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/categories?dateId=${dateId}`, {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    fetchItems();
  }, [dateId, fetchItems]);

  return { categories, items, setItems, fetchItems };
}
