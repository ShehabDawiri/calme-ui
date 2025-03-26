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
    className="group relative flex w-full transform items-center rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] hover:bg-blue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 active:scale-[0.98] dark:hover:bg-gray-700 dark:focus-visible:ring-gray-400"
  >
    {/* Icon Container */}
    <div className="flex items-center justify-center">
      <span className="relative flex h-6 w-6 items-center justify-center text-gray-500 transition-colors duration-200 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-gray-300 dark:group-hover:text-white dark:group-focus:text-white">
        {icon}
      </span>
    </div>

    {/* Label */}
    {isOpen && (
      <span className="ml-3 overflow-hidden text-sm font-medium whitespace-nowrap text-gray-700 transition-all duration-200 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-gray-200 dark:group-hover:text-white dark:group-focus:text-white">
        {label}
      </span>
    )}

    {/* Active Indicator */}
    <span className="absolute inset-y-0 left-0 w-1 rounded-r-lg bg-blue-600 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white" />
  </Link>
);
