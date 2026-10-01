import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import prs from "./locales/prs.json";

const storedLanguage = localStorage.getItem("inventory-language") || "en";
const savedLanguage = storedLanguage.toLowerCase().startsWith("prs")
  ? "prs"
  : "en";

function updateDocumentLanguage(language) {
  const isDari = language.toLowerCase().startsWith("prs");

  document.documentElement.lang = language;
  document.documentElement.dir = isDari ? "rtl" : "ltr";
}

updateDocumentLanguage(savedLanguage);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    prs: { translation: prs },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  supportedLngs: ["en", "prs"],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on("languageChanged", (language) => {
  localStorage.setItem("inventory-language", language);
  updateDocumentLanguage(language);
});

export default i18n;
