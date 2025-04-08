import { PieChart } from "react-minimal-pie-chart";

export default function ChartEmpty() {
  return (
    <div className="relative flex items-center justify-center">
      <PieChart
        data={[
          { value: 1, color: "#e5e7eb" }, // gray
          { value: 0.5, color: "#0ea5e9" }, // blue arc
        ]}
        lineWidth={20}
        startAngle={270}
        label={() => ""}
        labelStyle={{
          fill: "#888",
          fontSize: "6px",
          fontWeight: "bold",
          pointerEvents: "none",
        }}
        radius={48}
        animate
      />
      <span className="absolute text-gray-500 text-sm font-semibold pointer-events-none">
        No Data
      </span>
    </div>
  );
}
