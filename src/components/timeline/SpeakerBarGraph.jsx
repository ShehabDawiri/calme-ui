// src/components/timeline/SpeakerBarGraph.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SpeakerBarGraph = ({ speakerCounts, speakerColors }) => {
  const labels = Object.keys(speakerCounts);
  const dataValues = Object.values(speakerCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Utterances per Speaker",
        data: dataValues,
        backgroundColor: labels.map((label) => {
          const speakerNum = label.split(" ")[1];
          // Check if the color exists; otherwise, fallback to a default color.
          if (speakerColors && speakerColors[speakerNum]) {
            return speakerColors[speakerNum].border.replace("border-", "bg-");
          }
          return "#CCCCCC";
        }),
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SpeakerBarGraph;
