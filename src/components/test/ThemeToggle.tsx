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
        className="group flex w-full items-center rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {/* Light mode icon (hidden in dark mode) */}
        <svg
          className="h-6 w-6 text-yellow-400 dark:hidden"
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
          className="hidden h-6 w-6 text-gray-600 dark:block"
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
            <span className="ml-3 text-sm transition-colors group-hover:text-yellow-400 dark:hidden dark:text-gray-200">
              {t("lightMode")}
            </span>

            {/* Dark mode text (visible in dark mode) */}
            <span className="ml-3 hidden text-sm text-gray-600 transition-colors group-hover:text-blue-600 dark:block">
              {t("darkMode")}
            </span>
          </>
        )}
      </button>
    </div>
  );
};
