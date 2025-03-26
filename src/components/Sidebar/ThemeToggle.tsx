import React from "react";
import { useTranslation } from "react-i18next";

// Sub-component for Theme Toggle
export const ThemeToggle = ({
  toggleDarkMode,
  isOpen,
}: {
  toggleDarkMode: () => void;
  isOpen: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <button
        onClick={toggleDarkMode}
        className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
      >
        {/* Light mode icon (hidden in dark mode) */}
        <svg
          className="w-6 h-6 text-yellow-400 dark:hidden"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>

        {/* Dark mode icon (visible in dark mode) */}
        <svg
          className="hidden w-6 h-6 text-gray-600 dark:block"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>

        {isOpen && (
          <>
            {/* Light mode text (hidden in dark mode) */}
            <span className="ml-3 text-sm dark:text-gray-200 group-hover:text-yellow-400 transition-colors dark:hidden">
              {t("lightMode")}
            </span>

            {/* Dark mode text (visible in dark mode) */}
            <span className="ml-3 text-sm text-gray-600 group-hover:text-blue-600 transition-colors hidden dark:block">
              {t("darkMode")}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
