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
      className={`fixed flex h-[100dvh] flex-col border-r border-gray-200 bg-white shadow-lg transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${isOpen ? "w-64" : "w-20"} `}
      dir={direction}
    >
      {/* Header Section */}
      <div
        className={`flex items-center ${
          isOpen ? "justify-between" : "justify-center"
        } border-b p-4 dark:border-gray-700`}
      >
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-gray-700">
              <FiHome className="h-6 w-6 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              {t("company")}
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={t("toggle_sidebar")}
        >
          <ChevronIcon
            className={`h-6 w-6 text-gray-600 dark:text-gray-300 ${
              isOpen ? "transform transition-transform" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent flex-1 space-y-1 overflow-y-auto p-2">
        <NavItem
          icon={
            <FiHome
              className={`h-6 w-6 transition-colors ${
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
              className={`h-6 w-6 transition-colors ${
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
              className={`h-6 w-6 transition-colors ${
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
      <div className="border-t p-4 dark:border-gray-700">
        <div className="mb-4 flex items-center justify-between space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle toggleDarkMode={toggleDarkMode} isOpen={isOpen} />

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="group flex-1 rounded-lg p-3 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:hover:bg-gray-700"
          >
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5 text-gray-500 transition-colors group-hover:text-blue-600 dark:text-gray-300 dark:group-hover:text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-medium text-gray-600 transition-colors group-hover:text-blue-600 dark:text-gray-200 dark:group-hover:text-blue-400">
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
              className="group flex w-full items-center rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <img
                src={user.picture}
                alt={t("user_profile")}
                className="h-8 w-8 rounded-full ring-2 ring-blue-500 transition-all group-hover:ring-blue-300 dark:ring-blue-400"
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
                } rounded-lg bg-white py-1 shadow-xl transition-all dark:bg-gray-800`}
                dir={direction}
              >
                <a
                  href="#"
                  className="block px-4 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("settings")}
                </a>
                <button
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: window.location.origin },
                    })
                  }
                  className="block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="w-full rounded-lg bg-blue-600 p-2 text-sm text-white transition-colors hover:bg-blue-500"
          >
            {t("login")}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
