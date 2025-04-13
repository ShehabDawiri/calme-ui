import React from "react";
import { useSelector } from "react-redux";

import Timeline from "../components/timeline/Timeline";

const TimelinePage = () => {
  // const { sessions, selectedSessionId } = useSelector((state) => state.session);

  // const selectedSession = sessions.find(
  //   (session) => session.id === selectedSessionId,
  // );

  // // If a session is selected, extract its gladia_id, else return null
  // const gladiaId = selectedSession ? selectedSession.gladia_id : null;

  // const title = selectedSession
  //   ? selectedSession.title
  //   : "No session available";
  const gladiaId = "45bb4389-e6f4-4ba9-b853-58f0dabf086a"; // For testing purposes only

  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary-100)]">
      <div className="text-center">
        {/* <h1 className="text-2xl font-semibold text-[var(--color-primary-500)]">
          Session Title: {title}
        </h1> */}
        {gladiaId ? (
          <Timeline gladiaId={gladiaId} />
        ) : (
          <p>No session selected.</p>
        )}
      </div>
    </div>
  );
};

export default TimelinePage;
