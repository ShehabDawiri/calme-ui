import { useState, useRef, useEffect } from "react";
import { CSVLink } from "react-csv";
import TimelineView from "./TimelineView.jsx";
import GraphsView from "./GraphsView.jsx";
import DataView from "./DataView.jsx";
import EntitySummaryTab from "./InsightsView";
import { getPreRecordedResult } from "@/api/gladiaAPI/audioTranscriber"; // Keep the API import
import { Loader } from "../ui/loader.jsx";

export const rowHeight = 50;

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export default function Timeline({ gladiaId }) {
  const [activeTab, setActiveTab] = useState("timeline");
  const [selectedUtterance, setSelectedUtterance] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState(null); // Initially null to indicate data isn't loaded
  const [filters, setFilters] = useState({
    speakers: [],
    sentiments: [],
    minConfidence: 0,
  });
  const timelineRef = useRef(null);

  useEffect(() => {
    const getData = async (gladiaId) => {
      try {
        const response = await getPreRecordedResult(gladiaId);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (gladiaId) {
      getData(gladiaId);
    }
  }, [gladiaId]);
  if (!data) {
    return <Loader />;
  }

  // Filter processed data based on user inputs.
  const processedData = data.result.transcription.utterances.filter(
    (utterance) => {
      const sentiment = data.result.sentiment_analysis.results.find(
        (r) => r.start === utterance.start && r.end === utterance.end,
      )?.sentiment;
      return (
        utterance.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filters.speakers.length === 0 ||
          filters.speakers.includes(utterance.speaker)) &&
        (filters.sentiments.length === 0 ||
          filters.sentiments.includes(sentiment)) &&
        utterance.confidence >= filters.minConfidence
      );
    },
  );

  // CSV export data.
  const exportData = processedData.map((utterance) => ({
    ...utterance,
    sentiment: data.result.sentiment_analysis.results.find(
      (r) => r.start === utterance.start && r.end === utterance.end,
    )?.sentiment,
    speaker: `Speaker ${utterance.speaker}`,
    duration: utterance.end - utterance.start,
  }));

  // Prepare counts for graphs.
  const sentimentCounts = processedData.reduce(
    (acc, cur) => {
      const sentiment =
        data.result.sentiment_analysis.results.find(
          (r) => r.start === cur.start && r.end === cur.end,
        )?.sentiment || "neutral";
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 },
  );

  const speakerCounts = processedData.reduce((acc, cur) => {
    const key = `Speaker ${cur.speaker}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  // Sticky Tab Navigation
  const renderTabs = () => (
    <div className="sticky top-0 z-50 border-b border-gray-300 bg-white">
      <nav className="flex gap-4 px-4 py-3">
        {["timeline", "graphs", "insights", "data"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>
    </div>
  );

  const colorPool = [
    { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-800" },
    { bg: "bg-green-100", border: "border-green-500", text: "text-green-800" },
    {
      bg: "bg-purple-100",
      border: "border-purple-500",
      text: "text-purple-800",
    },
    {
      bg: "bg-orange-100",
      border: "border-orange-500",
      text: "text-orange-800",
    },
    { bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-800" },
    { bg: "bg-teal-100", border: "border-teal-500", text: "text-teal-800" },
    {
      bg: "bg-yellow-100",
      border: "border-yellow-500",
      text: "text-yellow-800",
    },
    { bg: "bg-red-100", border: "border-red-500", text: "text-red-800" },
  ];

  const generateSpeakerColors = () => {
    const speakers = new Set(
      data.result.sentiment_analysis?.results.map((u) => u.speaker),
    );

    const colors = {};
    let index = 0;
    for (const speaker of speakers) {
      colors[speaker] = colorPool[index % colorPool.length];
      index++;
    }

    return colors;
  };

  const speakerColors = generateSpeakerColors();

  return (
    <div className="mx-auto h-screen max-w-7xl space-y-8 overflow-y-auto p-6">
      {renderTabs()}
      {activeTab === "timeline" && (
        <TimelineView
          data={data}
          processedData={processedData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          timelineRef={timelineRef}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          selectedUtterance={selectedUtterance}
          setSelectedUtterance={setSelectedUtterance}
          speakerColors={speakerColors}
        />
      )}
      {activeTab === "graphs" && (
        <GraphsView
          speakerCounts={speakerCounts}
          sentimentCounts={sentimentCounts}
          speakerColors={speakerColors}
        />
      )}
      {activeTab === "data" && <DataView processedData={processedData} />}
      {activeTab === "insights" && <EntitySummaryTab data={data} />}
      {/* Statistics Overview */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-sm font-medium text-gray-600">Total Duration</h4>
          <p className="text-3xl font-bold">{data.file.audio_duration}s</p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-sm font-medium text-gray-600">
            Total Utterances
          </h4>
          <p className="text-3xl font-bold">{processedData.length}</p>
        </div>
        <div className="rounded-lg bg-white p-6 text-center shadow-md">
          <h4 className="text-sm font-medium text-gray-600">
            Average Confidence
          </h4>
          <p className="text-3xl font-bold">
            {(
              (processedData.reduce((acc, u) => acc + u.confidence, 0) /
                processedData.length) *
                100 || 0
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>
      <div className="mt-8 text-center">
        <CSVLink
          data={exportData}
          filename="transcript-export.csv"
          className="inline-block rounded bg-blue-600 px-6 py-3 text-white shadow-md transition hover:bg-blue-700"
        >
          Export to CSV
        </CSVLink>
      </div>
    </div>
  );
}
