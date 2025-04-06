import React from "react";
import Timeline  from "../components/timeline/Timeline";
const TimelinePage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-[var(--color-primary-100)]">
      <h1 className="text-2xl font-semibold text-[var(--color-primary-500)]">
        <Timeline />
      </h1>
    </div>
  );
};

export default TimelinePage;
