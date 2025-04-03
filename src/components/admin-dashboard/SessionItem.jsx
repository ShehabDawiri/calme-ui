import React from "react";

const SessionItem = ({ title, dateTime, selected }) => {
  return (
    <div
      className={`cursor-pointer py-1.25 pl-3 ${selected ? "bg-[var(--color-primary-200)]" : ""}`}
    >
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-xs text-gray-500">{dateTime.toLocaleString()}</p>
    </div>
  );
};

export default SessionItem;
