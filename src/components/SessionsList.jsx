import React, { useState } from "react";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import Seperator from "./ui/Separator";
import SessionItem from "./SessionItem";

const SessionsList = ({ pastSessions, scheduledSessions }) => {
  const [selectedTab, setSelectedTab] = useState("schedule");
  const selectedSessionId = 1;
  const selectedTabStyle =
    "after:absolute after:-bottom-[1px] after:left-0 after:h-0.75 after:w-full after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-['']";
  return (
    <div className="flex flex-col justify-start">
      <div className="flex justify-between font-semibold">
        <button
          type="button"
          onClick={() => setSelectedTab("schedule")}
          className={`relative w-1/2 cursor-pointer py-3 transition-all ${selectedTab === "schedule" ? selectedTabStyle : "text-gray-400 hover:text-gray-600"}`}
        >
          Schedule
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("past")}
          className={`relative w-1/2 cursor-pointer py-3 ${selectedTab === "past" ? selectedTabStyle : "text-gray-400 hover:text-gray-600"}`}
        >
          Past
        </button>
      </div>
      <Seperator />
      {selectedTab === "past" ? (
        <div className="flex h-full w-full flex-col gap-1.5">
          {pastSessions.map((session, idx) => (
            <SessionItem
              key={`sessionItem-${idx}`}
              title={session.title}
              dateTime={session.date}
              selected={selectedSessionId === session.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full w-full flex-col gap-1.5">
          {scheduledSessions.map((session, idx) => (
            <SessionItem
              key={`sessionItem-${idx}`}
              title={session.title}
              dateTime={session.date}
              selected={selectedSessionId === session.id}
            />
          ))}
        </div>
      )}

      <div className="flex">
        <button
          type="submit"
          className="relative top-74 right-4 flex text-white"
        >
          <MdOutlineKeyboardVoice className="mr-1" /> Tidy Up
        </button>
      </div>
    </div>
  );
};

export default SessionsList;
