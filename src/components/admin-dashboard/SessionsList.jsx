import React, { useState } from "react";
import { Separator } from "@/components/ui/Separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import SessionItem from "./SessionItem";

const SessionsList = () => {
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
  const [selectedTab, setSelectedTab] = useState("schedule");
  const selectedSessionId = 1;
  const selectedTabStyle =
    "after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:bg-black after:transition-all after:duration-300 after:ease-in-out after:content-['']";
  return (
    <div className="flex flex-col justify-start">
      <div className="flex font-semibold">
        <Tabs defaultValue="schedueld" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none">
            <TabsTrigger value="schedueld">Schedueld</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="schedueld">
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
          </TabsContent>
          <TabsContent value="past">
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
          </TabsContent>
        </Tabs>

        {/* <button
          type="button"
          onClick={() => setSelectedTab("schedule")}
          className={`relative w-1/2 cursor-pointer py-3.5 transition-all ${selectedTab === "schedule" ? selectedTabStyle : "text-[var(--color-primary-400)] hover:text-gray-600"}`}
        >
          Schedule
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab("past")}
          className={`relative w-1/2 cursor-pointer py-3.5 ${selectedTab === "past" ? selectedTabStyle : "text-[var(--color-primary-400)] hover:text-gray-600"}`}
        >
          Past
        </button> */}
      </div>
    </div>
  );
};

export default SessionsList;
