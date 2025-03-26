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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            {t("Home.welcome")}, {user?.name || t("Home.user")} 👋
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t("Home.getStarted")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => navigate("/record")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FiMic className="text-4xl text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {t("Home.startRecording")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("Home.startRecordingDesc")}
              </p>
              <button className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                {t("Home.start")}
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => navigate("/SessionNotes")}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                <FiPieChart className="text-4xl text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                {t("Home.dashboard")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {t("Home.dashboardDesc")}
              </p>
              <button className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors">
                {t("Home.viewDashboard")}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            {t("Home.recentActivity")}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
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
