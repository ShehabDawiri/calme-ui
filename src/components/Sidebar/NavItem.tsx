import React from "react";
import { Link } from "react-router-dom";

export const NavItem = ({
  icon,
  label,
  isOpen,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
  to: string;
}) => (
  <Link
    to={to}
    className="
      relative flex items-center w-full p-3 
      rounded-lg transition-all duration-200 
      hover:bg-blue-100 dark:hover:bg-gray-700 
      group focus:outline-none focus-visible:ring-2 
      focus-visible:ring-blue-500 dark:focus-visible:ring-gray-400
      transform hover:scale-[1.02] active:scale-[0.98]
    "
  >
    {/* Icon Container */}
    <div className="flex items-center justify-center">
      <span
        className="
          relative flex items-center justify-center 
          w-6 h-6 transition-colors duration-200 
          text-gray-500 dark:text-gray-300 
          group-hover:text-blue-600 dark:group-hover:text-white
          group-focus:text-blue-600 dark:group-focus:text-white
        "
      >
        {icon}
      </span>
    </div>

    {/* Label */}
    {isOpen && (
      <span
        className="
          ml-3 text-sm font-medium transition-all duration-200 
          text-gray-700 dark:text-gray-200 
          group-hover:text-blue-600 dark:group-hover:text-white 
          group-focus:text-blue-600 dark:group-focus:text-white
          overflow-hidden whitespace-nowrap
        "
      >
        {label}
      </span>
    )}

    {/* Active Indicator */}
    <span
      className="
        absolute inset-y-0 left-0 w-1 bg-blue-600 
        opacity-0 group-hover:opacity-100 
        dark:bg-white transition-opacity
        rounded-r-lg
      "
    />
  </Link>
);
