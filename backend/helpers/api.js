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
    new Date(2000, monthNum)
  );
}

export function formatMoney(number) {
  return Math.floor(number)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const bgColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

const hexColors = [
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6366f1", // indigo-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
];

export function getRandomColor(categoryName) {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return bgColors[Math.abs(hash) % bgColors.length];
}

export const getHexColor = (categoryName) => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hexColors[Math.abs(hash) % hexColors.length];
};
