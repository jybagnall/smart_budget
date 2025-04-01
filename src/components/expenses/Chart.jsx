import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { getHexColor } from "../../../backend/helpers/api";

const lineWidth = 60;

const labelStyle = {
  fontSize: "5px",
  fontFamily: '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
  fill: "#fcfcfc",
  fontWeight: "bold",
};

export default function Chart({ sumPerCategory }) {
  const [selected, setSelected] = useState(null);
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

  return (
    <div>
      {chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
        <p className="text-gray-500">No data available</p>
      ) : (
        <PieChart
          data={chartData}
          radius={48}
          style={{
            fontFamily:
              '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
            fontSize: "8px",
          }}
          lineWidth={lineWidth}
          label={({ dataEntry }) => dataEntry.title}
          labelStyle={labelStyle}
          labelPosition={69}
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
