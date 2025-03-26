import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSun,
  FiMoon,
  FiGlobe,
  FiLogIn,
  FiUserPlus,
  //   FiRocket,
  FiLogOut,
} from "react-icons/fi";

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  // Set document direction based on language
  useEffect(() => {
    const rtlLanguages = ["ar", "he"];
    document.documentElement.dir = rtlLanguages.includes(i18n.language)
      ? "rtl"
      : "ltr";
  }, [i18n.language]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", !isDark);
    localStorage.theme = !isDark ? "dark" : "light";
  };

  // Cycle through languages
  const toggleLanguage = () => {
    const languages = ["en", "ar", "he"];
    const currentIndex = languages.indexOf(i18n.language);
    const newLang = languages[(currentIndex + 1) % languages.length];
    i18n.convertDetectedLanguage(newLang);
  };

  // Navigation function
  const goToHome = () => {
    window.location.href = "/home";
  };

  // Feature Card Component
  const FeatureCard = ({ icon, title, text }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-blue-500"
    >
      <div className="text-4xl mb-4 animate-float">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-balance">{text}</p>
    </motion.div>
  );

  // Testimonial Card Component
  const TestimonialCard = ({ name, role, text, avatar }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg relative hover:shadow-xl transition-shadow duration-300"
    >
      <div className="absolute -top-6 left-6">
        <img
          src={avatar}
          alt={name}
          className="w-14 h-14 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
        />
      </div>
      <blockquote className="text-lg text-gray-600 dark:text-gray-300 mb-4 relative pl-8">
        <span className="absolute left-0 top-0 text-4xl text-gray-300 dark:text-gray-600">
          “
        </span>
        {text}
      </blockquote>
      <div className="flex items-center justify-end gap-3">
        <div className="text-right">
          <p className="font-bold text-gray-800 dark:text-white">{name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );

  // Data
  const features = [
    {
      icon: "🚀",
      title: t("WelcomePage.feature1_title", "Fast Implementation"),
      text: t(
        "WelcomePage.feature1_text",
        "Get started in minutes with our intuitive platform"
      ),
    },
    {
      icon: "🛡️",
      title: t("WelcomePage.feature2_title", "Secure Platform"),
      text: t(
        "WelcomePage.feature2_text",
        "Military-grade encryption for your data"
      ),
    },
    {
      icon: "💡",
      title: t("WelcomePage.feature3_title", "Innovative Solutions"),
      text: t(
        "WelcomePage.feature3_text",
        "Cutting-edge technology for your business"
      ),
    },
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      role: t("WelcomePage.ceo", "CEO"),
      text: t(
        "WelcomePage.testimonial1",
        "This platform transformed our business operations!"
      ),
      avatar: "https://i.pravatar.cc/60?img=1",
    },
    {
      name: "Sarah Smith",
      role: t("WelcomePage.cto", "CTO"),
      text: t(
        "WelcomePage.testimonial2",
        "The best solution we've ever implemented"
      ),
      avatar: "https://i.pravatar.cc/60?img=2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 w-full p-4 backdrop-blur-md bg-white/50 dark:bg-gray-900/50 z-50">
        <div className="max-w-6xl mx-auto flex justify-end gap-2">
          <button
            onClick={toggleLanguage}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
            aria-label={t("WelcomePage.toggle_language")}
          >
            <FiGlobe className="text-lg" />
            <span className="font-medium">{i18n.language.toUpperCase()}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all duration-300"
            aria-label={t("WelcomePage.toggle_theme")}
          >
            {document.documentElement.classList.contains("dark") ? (
              <FiSun className="text-lg" />
            ) : (
              <FiMoon className="text-lg" />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="p-3 bg-red-500 text-white rounded-lg shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <FiLogOut />
              <span>{t("WelcomePage.logout")}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mt-20">
        <AnimatePresence>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              {t("WelcomePage.welcome_title", "Welcome to")}{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent relative">
                {t("WelcomePage.company_name", "AI Full Stack Course Calm")}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 animate-underline" />
              </span>
            </h1>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative group mx-auto w-full max-w-3xl"
            >
              <img
                src="https://source.unsplash.com/random/1600x900?technology"
                alt="Company showcase"
                className="rounded-2xl shadow-2xl transform transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent rounded-2xl" />
            </motion.div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center mb-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 animate-pulse opacity-10 bg-gradient-to-r from-white to-transparent" />

            {isAuthenticated ? (
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t("WelcomePage.welcome_title", "Welcome")} {user?.name || ""}
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToHome}
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold flex items-center gap-2 mx-auto hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {/* <FiRocket /> */}
                  {t("WelcomePage.start", "Start")}
                </motion.button>
              </div>
            ) : (
              <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-6">
                  {t("WelcomePage.cta_title", "Ready to Get Started?")}
                </h2>
                <div className="flex flex-col md:flex-row justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loginWithRedirect()}
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FiLogIn />
                    {t("WelcomePage.login", "Login")}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loginWithRedirect({ screen_hint: "signup" })}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <FiUserPlus />
                    {t("WelcomePage.register", "Register")}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-3 gap-8 mb-20"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>

          {/* Testimonials Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-8 mb-20"
          >
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="text-center text-gray-600 dark:text-gray-400">
          <p className="mb-6 text-lg font-medium">
            {t(
              "WelcomePage.footer_text",
              "Join 1,000+ companies already using our platform"
            )}
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.img
                key={i}
                whileHover={{ scale: 1.1 }}
                src={`https://source.unsplash.com/random/80x80?logo&${i}`}
                alt="Company logo"
                className="w-16 h-16 grayscale hover:grayscale-0 transition-all duration-300 rounded-xl"
                loading="lazy"
              />
            ))}
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            {t("WelcomePage.company_name", "AI Full Stack Course Calm")}.{" "}
            {t("WelcomePage.rights_reserved", "All rights reserved")}.
          </p>
        </footer>
      </div>

      {/* Background Elements */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl animate-pulse"></div>
    </div>
  );
};

export default WelcomePage;
