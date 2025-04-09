import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFetchedData(dateId) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const fetchCategories = useCallback(async () => {
    if (!dateId) return;

    try {
      const res = await axios.get(`/api/categories?dateId=${dateId}`, {
        withCredentials: true,
      });
      setCategories(res.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [dateId]);

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

    fetchCategories();
    fetchItems();
  }, [dateId, fetchItems, fetchCategories]);

  return { categories, items, setItems, fetchItems, fetchCategories };
}
