import React from "react";

const SessionItem = ({ title, dateTime, selected, onClick }) => {
  return (
    <div
      className={`hover:bg-hover-100 cursor-pointer py-1.25 pl-3 ${selected ? "bg-primary-200" : ""}`}
      onClick={onClick}
    >
      <p className="text-md font-semibold">{title}</p>
      <p className="text-primary-400 text-xs">{dateTime.toLocaleString()}</p>
    </div>
  );
};

export default SessionItem;
