import { useState } from "react";
import { PieChart } from "react-minimal-pie-chart";

export default function ChartWithData({ chartData, labelStyle, setHovered }) {
  const [selected, setSelected] = useState(null);

  return (
    <PieChart
      data={chartData}
      radius={48}
      style={{
        fontFamily:
          '"Nunito Sans", -apple-system, Helvetica, Arial, sans-serif',
        fontSize: "8px",
      }}
      lineWidth={60}
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
  );
}
