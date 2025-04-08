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
  "#60a5fa", // blue-500
  "#10b981", // green-500
  "#f59e0b", // amber-500
  "#a78bfa", // violet-500
  "#fb7185", // pink-500
  "#818cf8", // indigo-500
  "#2dd4bf", // teal-500
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

export const getTextColor = (bgHex) => {
  const rgb = parseInt(bgHex.slice(1), 16); // skip #
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? "#000" : "#fff";
};

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
