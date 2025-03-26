import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: ["en", "ar", "he"],
    load: "currentOnly", // Only load the exact language (no regional fallbacks)
    cleanCode: true, // Clean language codes (en-US -> en)
    nonExplicitSupportedLngs: false, // Disable regional variants
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    detection: {
      order: [
        "localStorage", // Check localStorage first
        "cookie",
        "navigator", // Then browser language
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"],
      convertDetectedLanguage: (lng) => {
        // Convert regional codes to base language
        const baseLng = lng.split("-")[0];
        return ["en", "ar", "he"].includes(baseLng) ? baseLng : "en";
      },
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
