import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSessionId } from "@/store/sessionSlice"; // Corrected import name
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import SessionItem from "./SessionItem";
import { fetchSessions } from "@/store/sessionSlice"; // Corrected import name

const SessionsList = () => {
  const dispatch = useDispatch();

  const { sessions, selectedSessionId, status, error } = useSelector(
    (state) => state.session,
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchSessions());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <div className="p-4 text-center">Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const now = new Date();
  const withDateObj = sessions.map((s) => ({
    ...s,
    dateObj: new Date(s.date),
  }));

  const scheduledSessions = withDateObj
    .filter((s) => s.dateObj >= now)
    .sort((a, b) => a.dateObj - b.dateObj);

  const pastSessions = withDateObj
    .filter((s) => s.dateObj < now)
    .sort((a, b) => b.dateObj - a.dateObj);

  const handleSessionClick = (session) => {
    dispatch(setSelectedSessionId(session.id));
  };

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="scheduled" className="w-full">
        <TabsList className="border-primary-200 grid w-full grid-cols-2 border-b">
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled">
          {scheduledSessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No upcoming sessions.
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200">
              {scheduledSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  title={session.title}
                  dateTime={session.dateObj}
                  selected={selectedSessionId === session.id} // Use ID for comparison
                  onClick={() => handleSessionClick(session)}
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
                  selected={selectedSessionId === session.id} // Use ID for comparison
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
