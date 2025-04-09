import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import SessionItem from "./SessionItem";
import { useSession } from "@/hooks/useSession";
import { scheduledSessions, pastSessions } from "@/lib/stub-data"; // Assuming you have a sessions.js file with this data

const SessionsList = () => {
  const setSelectedSession = useSession((state) => state.setSelectedSession);

  // handleSessionClick is called when a session is clicked
  // It sets the selected session ID in the global state
  const handleSessionClick = (sessionId) => {
    setSelectedSession(sessionId);
  };

  return (
    <div className="flex h-full w-full flex-1 flex-col gap-4 overflow-hidden">
      <Tabs defaultValue="scheduled" className="w-full px-2">
        <TabsList className="border-primary-200 bg-primary-100 grid h-fit w-full cursor-pointer grid-cols-2 py-2">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className={"h-full w-full"}>
          {scheduledSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No upcoming sessions.
            </div>
          ) : (
            <ul className="flex h-full w-full flex-col divide-y divide-gray-200 overflow-scroll">
              {scheduledSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  title={session.title}
                  dateTime={session.dateObj}
                  // selected={selectedSessionId === session.id} // Use ID for comparison
                  onClick={() => handleSessionClick(session.id)}
                />
              ))}
            </ul>
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No past sessions.
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200">
              {pastSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  title={session.title}
                  dateTime={session.dateObj}
                  // selected={selectedSessionId === session.id} // Use ID for comparison
                  onClick={() => handleSessionClick(session)}
                />
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SessionsList;
