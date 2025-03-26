import { useState, useEffect, useCallback } from "react";
import Sidebar from "./test/Sidebar";
import { useTranslation } from "react-i18next";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { t, i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const isDark =
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.theme = newDarkMode ? "dark" : "light";
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  const toggleLanguage = () => {
    const languages = ["en", "ar", "he"];
    const currentIndex = languages.indexOf(i18n.language);
    const newLang = languages[(currentIndex + 1) % languages.length];

    i18n.changeLanguage(newLang.split("-")[0]);
    document.documentElement.dir = ["ar", "he"].includes(newLang)
      ? "rtl"
      : "ltr";
  };

  // Determine if current language is RTL

  useEffect(() => {
    const isRTL = ["ar", "he"].includes(i18n.language);
    setIsRTL(isRTL);
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div className="h-[100dvh] w-96 bg-amber-600">
      <div className="flex h-full w-full">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          toggleDarkMode={toggleDarkMode}
          toggleLanguage={toggleLanguage}
        />

        <main
          className={`h-[100dvh] flex-1 overflow-y-auto transition-all duration-300 ${
            isRTL
              ? isSidebarOpen
                ? "mr-64"
                : "mr-20"
              : isSidebarOpen
                ? "ml-64"
                : "ml-20"
          }`}
        >
          {/* Floating Toggle Button for Mobile */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`fixed top-4 ${
              isRTL ? "right-4" : "left-4"
            } z-50 rounded-full bg-white p-2 shadow-lg md:hidden dark:bg-gray-800`}
          >
            <svg
              className="h-6 w-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
