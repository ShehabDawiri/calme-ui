import React, { useState } from "react";
import { NavItem } from "./NavItem";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import {
  FiHome,
  FiFileText,
  FiMic,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

const Sidebar = ({
  isOpen,
  toggleSidebar,
  toggleDarkMode,
  toggleLanguage,
}: SidebarProps) => {
  const { t, i18n } = useTranslation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const location = useLocation();

  const isRouteActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const direction = ["ar", "he"].includes(i18n.language) ? "rtl" : "ltr";
  const ChevronIcon = isOpen
    ? direction === "rtl"
      ? FiChevronRight
      : FiChevronLeft
    : FiMenu;

  return (
    <aside
      className={`fixed h-screen flex flex-col border-r transition-all duration-300 
        shadow-lg border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800
        ${isOpen ? "w-64" : "w-20"}
      `}
      dir={direction}
    >
      {/* Header Section */}
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } p-4 border-b dark:border-gray-700`}
      >
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-gray-700">
              <FiHome className="w-6 h-6 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {t("company")}
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={t("toggle_sidebar")}
        >
          <ChevronIcon
            className={`w-6 h-6 text-gray-600 dark:text-gray-300 ${
              isOpen ? "transform transition-transform" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <NavItem
          icon={
            <FiHome
              className={`w-6 h-6 transition-colors ${
                isRouteActive("/home")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
          }
          label={t("navItem.home")}
          isOpen={isOpen}
          to="/home"
        />
        <NavItem
          icon={
            <FiFileText
              className={`w-6 h-6 transition-colors ${
                isRouteActive("/SessionNotes")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
          }
          label={t("navItem.session_notes")}
          isOpen={isOpen}
          to="/SessionNotes"
        />
        <NavItem
          icon={
            <FiMic
              className={`w-6 h-6 transition-colors ${
                isRouteActive("/record")
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
          }
          label={t("navItem.record")}
          isOpen={isOpen}
          to="/record"
        />
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center justify-between mb-4 space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle toggleDarkMode={toggleDarkMode} isOpen={isOpen} />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex-1 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                 transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className="text-sm font-medium text-gray-600 group-hover:text-blue-600 
                          dark:text-gray-200 dark:group-hover:text-blue-400 transition-colors"
              >
                {i18n.language.toUpperCase()}
              </span>
            </div>
          </button>
        </div>

        {/* User Profile */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            >
              <img
                src={user.picture}
                alt={t("user_profile")}
                className="w-8 h-8 rounded-full ring-2 ring-blue-500 group-hover:ring-blue-300 dark:ring-blue-400 transition-all"
              />
              {isOpen && (
                <div
                  className={`ml-3 ${
                    direction === "rtl" ? "mr-3 text-right" : "text-left"
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 group-hover:text-blue-500 dark:text-gray-400">
                    {t("view_profile")}
                  </p>
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div
                className={`absolute bottom-full mb-2 w-full ${
                  direction === "rtl" ? "right-0" : "left-0"
                } rounded-lg shadow-xl py-1 transition-all bg-white dark:bg-gray-800`}
                dir={direction}
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("settings")}
                </a>
                <button
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="w-full p-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            {t("login")}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
