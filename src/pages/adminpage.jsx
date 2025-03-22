import { useState } from "react"
import { FaPlus, FaPlay, FaSearch } from "react-icons/fa"
import { BsThreeDotsVertical } from "react-icons/bs"
import { MdOutlineKeyboardVoice } from "react-icons/md"

export default function SessionPage() {
  const [selectedSession, setSelectedSession] = useState("13/02/2025 4:26pm")

  const sessions = [
    { id: 1, title: "Untitled session", date: "13/02/2025 4:26pm" },
    { id: 2, title: "Untitled session", date: "11/02/2025" },
    { id: 3, title: "Untitled session", date: "02/11 12:20am" },
  ]

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/6 bg-white shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Sessions</h2>
        <hr></hr>
        <FaSearch className="absolute left-2 top-18   text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="border-2 border-gray-500 ml-3 pr-8 mb-3 mt-2 "
        ></input>
        <div className="flex ">
          <button className="relative ">past</button>
          <button className="relative ">schedule</button>
        </div>
        <hr></hr>
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`p-2 cursor-pointer rounded-lg ${
              selectedSession === session.date
                ? "bg-blue-200"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedSession(session.date)}
          >
            <p className="text-sm font-medium">{session.title}</p>
            <p className="text-xs text-gray-500">{session.date}</p>
          </div>
        ))}
        <div className="flex ">
          <button
            type="submit"
            className=" flex relative top-74 right-4 text-white"
          >
            <MdOutlineKeyboardVoice className="mr-1" /> Tidy Up
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md">
            <FaPlus className="mr-2" /> New Session
          </button>
          <button className="flex items-center bg-gray-200 px-4 py-2 rounded-md">
            <FaPlus className="mr-2" /> Add Details
          </button>
          <button className="flex items-center bg-gray-200 px-4 py-2 rounded-md">
            <FaPlus className="mr-2" /> Note
          </button>
          <button className="bg-gray-200 p-2 rounded-full">
            <BsThreeDotsVertical />
          </button>
        </div>

        {/* Session Details */}
        <div className="bg-white shadow-md p-4 rounded-md">
          <h2 className="text-lg font-semibold">{selectedSession}</h2>
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
            <FaPlay className="mr-2" /> Start Recording
          </button>
          <button className="bg-gray-200 px-4 py-2 rounded-md">Results</button>
        </div>
      </div>
    </div>
  )
}
