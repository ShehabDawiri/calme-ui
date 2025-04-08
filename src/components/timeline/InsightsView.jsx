// src/components/timeline/InsightsView.jsx
import { Badge } from "../ui/badge";
import {
  CopyIcon,
  ChevronDownIcon,
  ClockIcon,
  SparklesIcon,
} from "../ui/icons";
import { useState } from "react";
import { cn } from "../../lib/utils";

export default function InsightsView({ data }) {
  const {
    summarization,
    audio_to_llm,
    named_entity_recognition,
    structured_data_extraction,
  } = data.result;

  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    llm: true,
    entities: true,
    structured: true,
  });

  const [sortConfig, setSortConfig] = useState({
    key: "start",
    direction: "asc",
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sortEntities = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEntities = [...named_entity_recognition.results].sort((a, b) => {
    if (sortConfig.key === "text") {
      return sortConfig.direction === "asc"
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text);
    }
    return sortConfig.direction === "asc"
      ? a[sortConfig.key] - b[sortConfig.key]
      : b[sortConfig.key] - a[sortConfig.key];
  });

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "↕";
  };

  const entityTypeStyles = {
    ORGANIZATION: "bg-purple-100 text-purple-800",
    NAME_GIVEN: "bg-pink-100 text-pink-800",
    DURATION: "bg-yellow-100 text-yellow-800",
    DEFAULT: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-8 p-4">
      {/* Summarization Section */}
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-50 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-blue-900">AI Summary</h3>
            <Badge variant="info" className="ml-2">
              {summarization.exec_time}s processing
            </Badge>
          </div>
          <button
            onClick={() => toggleSection("summary")}
            className="text-blue-600 hover:text-blue-800"
          >
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                !expandedSections.summary && "rotate-180",
              )}
            />
          </button>
        </div>
        {expandedSections.summary && (
          <div className="mt-4 space-y-4">
            <p className="rounded-lg bg-white p-4 text-gray-700 shadow-inner">
              {summarization.results}
              <button
                onClick={() => handleCopy(summarization.results)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <CopyIcon className="h-4 w-4" />
              </button>
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClockIcon className="h-4 w-4" />
              <span>Generated in {summarization.exec_time} seconds</span>
            </div>
          </div>
        )}
      </div>

      {/* LLM Analysis Section */}
      <div className="rounded-lg bg-gradient-to-br from-green-50 to-teal-50 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-green-900">
              LLM Insights
            </h3>
            <Badge variant="success" className="ml-2">
              {audio_to_llm.results.length} analyses
            </Badge>
          </div>
          <button
            onClick={() => toggleSection("llm")}
            className="text-green-600 hover:text-green-800"
          >
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                !expandedSections.llm && "rotate-180",
              )}
            />
          </button>
        </div>
        {expandedSections.llm && (
          <div className="mt-4 space-y-6">
            {audio_to_llm.results.map((result, index) => (
              <div
                key={index}
                className="group relative rounded-xl bg-white p-6 shadow-md"
              >
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(result.results.prompt)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(result.results.response)}
                    className="text-green-500 hover:text-green-700"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                </div>
                <div className="mb-4 rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100">
                  <h4 className="mb-2 font-medium text-blue-800">Prompt</h4>
                  <p className="text-blue-700">{result.results.prompt}</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100">
                  <h4 className="mb-2 font-medium text-green-800">Response</h4>
                  <p className="whitespace-pre-wrap text-green-700">
                    {result.results.response}
                  </p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>Processed in {result.exec_time}s</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Named Entities Section */}
      <div className="rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-purple-900">
              Named Entities
            </h3>
            <Badge variant="secondary" className="ml-2">
              {named_entity_recognition.results.length} entities
            </Badge>
          </div>
          <button
            onClick={() => toggleSection("entities")}
            className="text-purple-600 hover:text-purple-800"
          >
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                !expandedSections.entities && "rotate-180",
              )}
            />
          </button>
        </div>
        {expandedSections.entities && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-inner">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Type", "Text", "Start", "End"].map((header) => (
                    <th
                      key={header}
                      className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() =>
                        header === "Type" && sortEntities("entity_type")
                      }
                    >
                      <div className="flex items-center gap-1">
                        {header}
                        {header === "Type" && (
                          <span className="text-xs text-gray-500">
                            {getSortIndicator("entity_type")}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedEntities.map((entity, index) => (
                  <tr
                    key={index}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          entityTypeStyles[entity.entity_type] ||
                            entityTypeStyles.DEFAULT,
                          "capitalize",
                        )}
                      >
                        {entity.entity_type.replace(/_/g, " ").toLowerCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{entity.text}</td>
                    <td className="px-4 py-3 text-gray-600">{entity.start}s</td>
                    <td className="px-4 py-3 text-gray-600">{entity.end}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Structured Data Section */}
      <div className="rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-orange-900">
              Structured Data
            </h3>
            <Badge variant="warning" className="ml-2">
              {structured_data_extraction.results.persons.length +
                structured_data_extraction.results.organizations.length}{" "}
              items
            </Badge>
          </div>
          <button
            onClick={() => toggleSection("structured")}
            className="text-orange-600 hover:text-orange-800"
          >
            <ChevronDownIcon
              className={cn(
                "h-5 w-5 transition-transform",
                !expandedSections.structured && "rotate-180",
              )}
            />
          </button>
        </div>
        {expandedSections.structured && (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-white p-6 shadow-inner">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800">Persons</h4>
                <span className="text-sm text-gray-500">
                  {structured_data_extraction.results.persons.length} entries
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {structured_data_extraction.results.persons.length > 0 ? (
                  structured_data_extraction.results.persons.map(
                    (person, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        <span className="text-sm">👤</span>
                        {person}
                      </Badge>
                    ),
                  )
                ) : (
                  <div className="w-full rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                    No persons identified
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-inner">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-lg font-medium text-gray-800">
                  Organizations
                </h4>
                <span className="text-sm text-gray-500">
                  {structured_data_extraction.results.organizations.length}{" "}
                  entries
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {structured_data_extraction.results.organizations.length > 0 ? (
                  structured_data_extraction.results.organizations.map(
                    (org, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1.5"
                      >
                        <span className="text-sm">🏢</span>
                        {org}
                      </Badge>
                    ),
                  )
                ) : (
                  <div className="w-full rounded-lg bg-gray-50 p-4 text-center text-gray-500">
                    No organizations identified
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
