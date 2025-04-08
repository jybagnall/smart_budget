import { useCallback, useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getHexColor, getTextColor } from "../../helperFunctions";
import ChartEmpty from "./ChartEmpty";
import ChartWithData from "./ChartWithData";

export default function ChartContainer({ sumPerCategory }) {
  const [hovered, setHovered] = useState(null);

  const chartData = sumPerCategory.map((category, index) => {
    const baseColor = getHexColor(category.category_name);
    const ishovered = hovered === index;
    const value = parseFloat(category.total_per_category || 0);
    // const categoryPercentage = targetBudget ? (value/targetBudget) * 100 : 0;

    return {
      title: category.category_name,
      value,
      color: ishovered ? "#fafaf9" : baseColor,
    };
  });

  const isChartEmpty =
    chartData.length === 0 || chartData.every((d) => d.value === 0);

  const labelStyle = useCallback(
    ({ dataEntry }) => ({
      fill: dataEntry?.color && getTextColor(dataEntry.color),
      fontSize: "5px",
      fontWeight: "bold",
      pointerEvents: "none",
    }),
    []
  );

  return (
    <div>
      {isChartEmpty ? (
        <ChartEmpty />
      ) : (
        <ChartWithData
          chartData={chartData}
          labelStyle={labelStyle}
          setHovered={setHovered}
        />
      )}
    </div>
  );
}
