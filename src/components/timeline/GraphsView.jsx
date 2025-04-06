// src/components/timeline/GraphsView.jsx
import React from "react";
import SpeakerBarGraph from "./SpeakerBarGraph.jsx";
import SentimentPieGraph from "./SentimentPieGraph.jsx";
import { SPEAKER_COLORS } from "./Timeline.jsx"; // Import the color constants

export default function GraphsView({ speakerCounts, sentimentCounts }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h4 className="mb-4 text-center text-lg font-medium text-gray-700">
          Utterances per Speaker
        </h4>
        <SpeakerBarGraph
          speakerCounts={speakerCounts}
          speakerColors={SPEAKER_COLORS} // Pass down the color data
        />
      </div>
      <div className="rounded-lg bg-white p-6 shadow-md">
        <h4 className="mb-4 text-center text-lg font-medium text-gray-700">
          Sentiment Distribution
        </h4>
        <SentimentPieGraph sentimentCounts={sentimentCounts} />
      </div>
    </div>
  );
}
