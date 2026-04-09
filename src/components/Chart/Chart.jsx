import {
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController
} from "chart.js";

import { Chart as ChartJS } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController
);

export default function Chart({ dataPoints, label, color }) {
  const data = {
    labels: dataPoints.map((_, i) => i),
    datasets: [
      {
        label: label,
        data: dataPoints,
        borderColor: color,
        backgroundColor: color,
      },
    ],
  };

  return <Line data={data} />;
}