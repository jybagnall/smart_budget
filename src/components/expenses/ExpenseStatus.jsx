import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "react-minimal-pie-chart";
import { useTargetMonth } from "../../contexts/TargetMonthContext";
import Loading from "../alerts/Loading";
import {
  calculatePerCategory,
  calculateGrossSpending,
  fetchTargetSpending,
} from "../../../backend/helpers/api";

export default function ExpenseStatus() {
  const { dateId, isLoading } = useTargetMonth();
  const [sumPerCategory, setSumPerCategory] = useState([]);
  const [totalSpending, setTotalSpending] = useState(null);
  const [targetBudget, setTargetBudget] = useState(null);

  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  async function loadData() {
    const fetchedPerCategory = await calculatePerCategory(dateId);
    const fetchedGrossSpending = await calculateGrossSpending(dateId);
    const fetchedBudget = await fetchTargetSpending(dateId);

    if (fetchedPerCategory) {
      setSumPerCategory(fetchedPerCategory);
    }
    setTotalSpending(fetchedGrossSpending);
    setTargetBudget(fetchedBudget.target_amount);
  }

  useEffect(() => {
    if (!dateId) return;

    loadData();
  }, [dateId]);

  if (isLoading) {
    return <Loading />;
  }

  const colors = [
    "#d9f99d",
    "#8fc5de",
    "#f5d0fe",
    "#f9a8d4",
    "#ffe4e6",
    "#a9b6e8",
    "#f4f1d5",
    "#fed7aa",
  ];
  const lineWidth = 60;

  const chartData = sumPerCategory.map((category, index) => {
    const baseColor = colors[index % colors.length];
    const ishovered = hovered === index;
    const value = parseFloat(category.total_per_category || 0);
    // const categoryPercentage = targetBudget ? (value/targetBudget) * 100 : 0;

    return {
      title: category.category_name,
      value,
      color: ishovered ? "#fafaf9" : baseColor,
    };
  });

  const labelStyle = {
    fontSize: "4px",
    fontFamily: '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
    fill: "#333",
    fontWeight: "bold",
  };

  return (
    <div>
      {/* <div>
        <div></div>
        <div></div>
        <div></div>
      </div> */}
      {chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
        <p className="text-gray-500">No data available</p>
      ) : (
        <PieChart
          data={chartData}
          radius={42}
          style={{
            fontFamily:
              '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
            fontSize: "8px",
          }}
          lineWidth={lineWidth}
          label={({ dataEntry }) => dataEntry.title}
          labelStyle={labelStyle}
          labelPosition={112 - lineWidth / 2}
          segmentsStyle={{ transition: "stroke .3s", cursor: "pointer" }}
          segmentsShift={(index) => (index === selected ? 6 : 1)}
          animate
          onClick={(_, index) => {
            setSelected(index === selected ? undefined : index);
          }}
          onMouseOver={(_, index) => {
            setHovered(index);
          }}
          onMouseOut={() => {
            setHovered(null);
          }}
        />
      )}
    </div>
  );
}
