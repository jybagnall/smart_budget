import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "react-minimal-pie-chart";

export default function ExpenseStatus() {
  const [categories, setCategories] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/items/expense-status", {
        withCredentials: true,
      });

      const current_planned_budget_total = res.data.reduce(
        (sum, category) => sum + parseFloat(category.sum_per_category || 0),
        0
      );
      setTotalBudget(current_planned_budget_total);
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const colors = ["#E38627", "#C13C37", "#96a6df", "#00A36C", "#FF5733"];

  const chartData = categories.map((category, index) => ({
    title: category.category_name,
    value: parseFloat(category.sum_per_category || 0),
    percentage: totalBudget
      ? (parseFloat(category.sum_per_category || 0) / totalBudget) * 100
      : 0,
    color: colors[index % colors.length],
  }));

  return (
    <div>
      <PieChart
        data={chartData}
        lineWidth={70} // Adjusts thickness of the chart
        radius={15} // Adjusts the pie chart size within the container
        label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`} // Show percentage labels
        labelStyle={{
          fontSize: "8px",
          fontFamily: "sans-serif",
          fill: "#fff",
        }}
        labelPosition={70} // Ensures labels are inside
        animate={true} // Enables animation
        animationDuration={1000} // 1-second animation
        animationEasing="ease-out"
        startAngle={-90} // Starts from top
        lengthAngle={360} // Full-circle chart
        paddingAngle={3} // Adds spacing between segments
        rounded // Rounds segment edges
        segmentsShift={(index) => (index === 1 ? 3 : 1)} // Slight shift for effect
      />
      <NavLink
        to="/category-list"
        className="rounded-md bg-emerald-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-emerald-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Add a new category
      </NavLink>
    </div>
  );
}
