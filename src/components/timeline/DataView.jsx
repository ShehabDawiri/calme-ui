// src/components/timeline/DataView.jsx
import React from "react";
import { formatTime } from "./Timeline.jsx";

export default function DataView({ processedData }) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white p-6 shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">Speaker</th>
            <th className="border px-4 py-2 text-left">Time</th>
            <th className="border px-4 py-2 text-left">Confidence</th>
            <th className="border px-4 py-2 text-left">Sentiment</th>
            <th className="border px-4 py-2 text-left">Text</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {processedData.map((utterance, index) => {
            const sentiment = utterance.sentiment || "neutral";
            return (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">
                  Speaker {utterance.speaker}
                </td>
                <td className="border px-4 py-2">
                  {formatTime(utterance.start)} - {formatTime(utterance.end)}
                </td>
                <td className="border px-4 py-2">
                  {(utterance.confidence * 100).toFixed(1)}%
                </td>
                <td className="border px-4 py-2 capitalize">{sentiment}</td>
                <td className="border px-4 py-2">{utterance.text}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
