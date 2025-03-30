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

export async function fetchTargetDate(dateId) {
  if (!dateId) return;

  try {
    const res = await axios.get(`/api/dates/target-month/${dateId}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching target month & year:", error);
    return [];
  }
}

export async function fetchAllDates() {
  try {
    const res = await axios.get(`/api/dates/all-dates`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error) {
    console.error("Error fetching user's all dates:", error);
    return [];
  }
}

export async function calculatePerCategory(dateId) {
  try {
    const res = await axios.get(
      `/api/budgets/calculate-per-category?dateId=${dateId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error calculating total expenditure:", error);
    return null;
  }
}

export async function calculateGrossSpending(dateId) {
  try {
    const res = await axios.get(
      `/api/budgets/calculate-gross-spending?dateId=${dateId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error calculating total expenditure:", error);
    return null;
  }
}

export function getMonthName(monthNum) {
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(2000, monthNum - 1)
  );
}

export function formatMoney(number) {
  return Math.floor(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
