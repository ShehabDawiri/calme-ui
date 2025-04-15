import React from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import { Mic, MessageCircle, NotebookPen, ChartBar } from "lucide-react";

const tabs = [
  { name: "Transcript", path: "transcript", icon: Mic },
  { name: "Context", path: "context", icon: MessageCircle },
  { name: "Note", path: "note", icon: NotebookPen },
  { name: "Analysis", path: "analysis", icon: ChartBar },
];

const TabMenu = () => {
  const { sessionId } = useParams();

  return (
    <div className="flex h-full flex-col px-4">
      {/* Tab Navigation */}
      <div className="relative mb-4 flex flex-wrap gap-2 p-2">
        {tabs.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={`/admin-dashboard/${sessionId}/${path}`}
            className={({ isActive }) =>
              `group relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-white text-blue-700 shadow-md"
                  : "text-gray-500 hover:bg-white hover:text-blue-600"
              }`
            }
          >
            <Icon
              size={16}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            {name}
          </NavLink>
        ))}
      </div>

      {/* Scrollable content area - Fixed */}
      <div className="max-h-[calc(100vh-265px)] min-h-0 flex-1 overflow-auto rounded-xl border shadow">
        <div className="h-full p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TabMenu;
