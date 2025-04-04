import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { motion } from "framer-motion";
import { FiMic, FiPieChart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth0();
  const navigate = useNavigate();
  return (
    <div className="flex h-[100dvh] w-[100dvw] items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 transition-colors duration-300 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-gray-800 md:text-5xl dark:text-white">
            {t("Home.welcome")}, {user?.name || t("Home.user")} 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("Home.getStarted")}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer rounded-3xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
            onClick={() => navigate("/record")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-blue-100 p-4 dark:bg-blue-900">
                <FiMic className="text-4xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                {t("Home.startRecording")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("Home.startRecordingDesc")}
              </p>
              <button className="mt-6 rounded-xl bg-blue-600 px-8 py-3 text-white transition-colors hover:bg-blue-700">
                {t("Home.start")}
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer rounded-3xl bg-white p-8 shadow-xl transition-all hover:shadow-2xl dark:bg-gray-800"
            onClick={() => navigate("/SessionNotes")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-purple-100 p-4 dark:bg-purple-900">
                <FiPieChart className="text-4xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-white">
                {t("Home.dashboard")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("Home.dashboardDesc")}
              </p>
              <button className="mt-6 rounded-xl bg-purple-600 px-8 py-3 text-white transition-colors hover:bg-purple-700">
                {t("Home.viewDashboard")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="mx-auto mt-16 max-w-4xl">
          <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">
            {t("Home.recentActivity")}
          </h2>
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-300">
              {t("Home.noRecentActivity")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
