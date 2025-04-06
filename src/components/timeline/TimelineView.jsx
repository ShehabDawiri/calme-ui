import React, { useCallback, useMemo } from "react";
import { SPEAKER_COLORS, rowHeight, formatTime } from "./Timeline.jsx";

export default function TimelineView({
  data,
  processedData,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  timelineRef,
  currentTime,
  setCurrentTime,
  setSelectedUtterance,
}) {
  const audioDuration = data?.file?.audio_duration || 0;

  const handleTimelineClick = useCallback(
    (e) => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setCurrentTime(Math.min(audioDuration, percent * audioDuration));
    },
    [audioDuration, timelineRef, setCurrentTime],
  );

  const handleCheckboxChange = (type, value) => (e) => {
    setFilters((prev) => ({
      ...prev,
      [type]: e.target.checked
        ? [...prev[type], value]
        : prev[type].filter((v) => v !== value),
    }));
  };

  const uniqueSpeakers = useMemo(() => {
    return Array.from(new Set(processedData.map((u) => u.speaker)));
  }, [processedData]);

  return (
    <div className="space-y-6 bg-gray-50 p-4">
      {/* Filters Panel */}
      <div className="grid gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Search Transcripts
          </label>
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Speakers */}
        <div className="space-y-12">
          <label className="text-sm font-medium text-gray-700">Speakers</label>
          <div className="flex flex-col gap-2">
            {Object.keys(SPEAKER_COLORS).map((speaker) => (
              <label key={speaker} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.speakers.includes(Number(speaker))}
                  onChange={handleCheckboxChange("speakers", Number(speaker))}
                  className="h-4 w-4 text-blue-600"
                />
                <span className="flex items-center">
                  <span
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: SPEAKER_COLORS[speaker].bg }}
                  />
                  Speaker {speaker}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sentiments */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Sentiments
          </label>
          <div className="grid grid-cols-2 gap-2">
            {["positive", "neutral", "negative"].map((sentiment) => (
              <label
                key={sentiment}
                className="flex items-center space-x-2 capitalize"
              >
                <input
                  type="checkbox"
                  checked={filters.sentiments.includes(sentiment)}
                  onChange={handleCheckboxChange("sentiments", sentiment)}
                  className="h-4 w-4 text-blue-600"
                />
                <span>{sentiment}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Confidence Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confidence: {Math.round(filters.minConfidence * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={filters.minConfidence}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                minConfidence: parseFloat(e.target.value),
              }))
            }
            className="w-full accent-blue-600"
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div
          ref={timelineRef}
          className="relative h-64 cursor-pointer overflow-hidden rounded-lg bg-gray-50"
          onClick={handleTimelineClick}
        >
          {/* Time Markers */}
          <div className="absolute top-0 right-0 left-0 z-10 flex h-8 border-b border-gray-300 bg-white">
            {Array.from(
              { length: Math.ceil(audioDuration / 10) + 1 },
              (_, i) => i * 10,
            ).map((time) => (
              <div
                key={time}
                className="absolute h-full border-l border-gray-300"
                style={{ left: `${(time / audioDuration) * 100}%` }}
              >
                <span className="absolute bottom-0 translate-x-[-50%] translate-y-full text-xs text-gray-600">
                  {formatTime(time)}
                </span>
              </div>
            ))}
          </div>

          {/* Speaker Tracks */}
          {uniqueSpeakers.map((speaker, index) => (
            <div
              key={speaker}
              className="absolute right-0 left-0 border-t border-gray-200/50"
              style={{
                top: `${index * rowHeight + 32}px`,
                height: rowHeight - 4,
                backgroundColor:
                  index % 2 === 0 ? "rgba(241, 245, 249, 0.5)" : "transparent",
              }}
            >
              <div className="absolute -left-20 flex w-20 items-center justify-end pr-2 text-sm text-gray-600">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: SPEAKER_COLORS[speaker]?.bg }}
                />
                Speaker {speaker}
              </div>
            </div>
          ))}

          {/* Current Time Line */}
          <div
            className="group absolute top-0 z-20 h-full w-1 bg-blue-600"
            style={{ left: `${(currentTime / audioDuration) * 100}%` }}
          >
            <div className="absolute -ml-2.5 -translate-y-full rounded-lg bg-blue-600 px-2 py-1 text-xs text-white shadow">
              {formatTime(currentTime)}
              <div className="absolute bottom-0 left-1/2 -mb-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-blue-600" />
            </div>
          </div>

          {/* Utterance Blocks */}
          {processedData.map((utterance, index) => {
            const sentiment = data.result.sentiment_analysis.results.find(
              (r) => r.start === utterance.start && r.end === utterance.end,
            )?.sentiment;

            const speakerIndex = uniqueSpeakers.indexOf(utterance.speaker);

            return (
              <div
                key={index}
                className={`absolute h-8 cursor-pointer rounded-lg border-l-4 p-1.5 transition-all duration-200 hover:z-10 hover:scale-105 hover:shadow-md ${SPEAKER_COLORS[utterance.speaker].bg} ${SPEAKER_COLORS[utterance.speaker].border}`}
                style={{
                  left: `${(utterance.start / audioDuration) * 100}%`,
                  width: `${((utterance.end - utterance.start) / audioDuration) * 100}%`,
                  top: `${speakerIndex * rowHeight + 40 + rowHeight}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedUtterance(utterance);
                }}
              >
                <div className="flex h-full items-center justify-between">
                  <span className="truncate text-xs font-medium text-gray-900">
                    {utterance.text}
                  </span>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      sentiment === "positive"
                        ? "bg-green-400"
                        : sentiment === "negative"
                          ? "bg-rose-400"
                          : "bg-gray-400"
                    }`}
                  />
                </div>
                <div className="absolute right-0 bottom-0 left-0 h-1 overflow-hidden rounded-b-lg bg-black/10">
                  <div
                    className="h-full bg-black/20"
                    style={{ width: `${utterance.confidence * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
