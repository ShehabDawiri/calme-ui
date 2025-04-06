// src/components/timeline/SentimentPieGraph.jsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentPieGraph = ({ sentimentCounts }) => {
  const labels = Object.keys(sentimentCounts);
  const dataValues = Object.values(sentimentCounts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sentiment Distribution",
        data: dataValues,
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div className="h-72">
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default SentimentPieGraph;
