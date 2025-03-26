import axios from "axios";

export async function fetchTargetSpending(dateId) {
  if (!dateId) return;

  try {
    const res = await axios.get(
      `/api/budgets/request-budget-month?dateId=${dateId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function fetchCategories(dateId) {
  if (!dateId) return;

  try {
    const res = await axios.get(`/api/categories?dateId=${dateId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
