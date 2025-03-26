import { useState } from "react";
import { FaPlus, FaPlay, FaSearch } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import SideBar from "../components/ui/sidebar";

export default function SessionPage() {
  const scheduledSessions = [
    { id: 1, title: "Scheduled session", date: new Date(2025, 2, 26, 10, 30) },
    { id: 2, title: "Scheduled session", date: new Date(2025, 2, 26, 10, 30) },
    { id: 3, title: "Scheduled session", date: new Date(2025, 2, 26, 10, 30) },
  ];
  const pastSessions = [
    { id: 5, title: "Past session", date: new Date(2025, 2, 26, 10, 30) },
    { id: 6, title: "Past session", date: new Date(2025, 2, 26, 10, 30) },
    { id: 8, title: "Past session", date: new Date(2025, 2, 26, 10, 30) },
  ];

  return (
    <div className="flex h-[100dvh] w-[100dvw] bg-white">
      {/* Sidebar */}
      <SideBar
        scheduledSessions={scheduledSessions}
        pastSessions={pastSessions}
      />
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white">
            <FaPlus className="mr-2" /> New Session
          </button>
          <button className="flex items-center rounded-md bg-gray-200 px-4 py-2">
            <FaPlus className="mr-2" /> Add Details
          </button>
          <button className="flex items-center rounded-md bg-gray-200 px-4 py-2">
            <FaPlus className="mr-2" /> Note
          </button>
          <button className="rounded-full bg-gray-200 p-2">
            <BsThreeDotsVertical />
          </button>
        </div>

        {/* Session Details */}
        <div className="rounded-md bg-white p-4 shadow-md">
          {/* <h2 className="text-lg font-semibold">{selectedSession}</h2> */}
          <div className="mt-4">
            <h3 className="font-semibold">Subjective:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Reports feeling sad due to ongoing situation in Palestine</li>
              <li>
                Describes feeling exhausted, tired, experiencing frequent
                illness
              </li>
              <li>Reports survivor’s guilt regarding safety</li>
              <li>Mentally unstable while watching events</li>
              <li>Reports being criticized for appearance</li>
              <li>Lost long-term friendships due to situation</li>
            </ul>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Past Medical History:</h3>
            <p className="text-sm text-gray-700">
              Reports recent illness lasting 2 weeks
            </p>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold">Objective:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Presents as articulate, engaged</li>
              <li>Tearful when discussing grandmother</li>
              <li>Good insight into personal growth and values</li>
              <li>Strong sense of identity and purpose evident</li>
            </ul>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="mt-4 flex items-center justify-between">
          <button className="flex items-center rounded-md bg-blue-500 px-4 py-2 text-white">
            <FaPlay className="mr-2" /> Start Recording
          </button>
          <button className="rounded-md bg-gray-200 px-4 py-2">Results</button>
        </div>
      </div>
    </div>
  );
}
