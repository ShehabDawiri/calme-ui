import { FaSearch } from "react-icons/fa";
import SessionsList from "../SessionsList";
import Seperator from "./Separator";
import { Mic } from "lucide-react";

const SideBar = ({ scheduledSessions, pastSessions }) => {
  return (
    <div className="relative flex w-56 flex-col border-r-2 border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="px-3 py-3">
        <h2 className="text-2xl font-bold">Sessions</h2>
      </div>
      {/* Search bar */}
      <div className="relative my-4 flex items-center px-3">
        <FaSearch className="absolute ml-2 text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="relative w-full rounded-md border-2 border-gray-200 px-1 py-2 indent-6 text-gray-500 placeholder-gray-500"
        ></input>
      </div>
      <Seperator />
      {/* Sessions List */}
      <SessionsList
        scheduledSessions={scheduledSessions}
        pastSessions={pastSessions}
      />
      <div className="absolute bottom-0 left-0 flex h-18 w-full items-center justify-center border-t-2 border-gray-200 px-4 font-semibold">
        <button
          type="button"
          className="relative w-full cursor-pointer rounded-md border-2 border-gray-200 py-2 transition-all hover:text-gray-600"
        >
          <div className="flex items-center justify-center gap-3">
            <Mic size={16} />
            <p> Tidy up</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default SideBar;
