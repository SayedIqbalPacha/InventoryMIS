import en from "@/locales/en.json";
import defaultI18n from "@/i18n";

const knownApiErrors = {
  "Incorrect email or password": "incorrectEmailOrPassword",
  "This email is already registered": "emailAlreadyRegistered",
  "User does not exist": "userDoesNotExist",
  "Your account is inactive. Please contact support.": "inactiveAccount",
  "Current password is incorrect": "currentPasswordIncorrect",
  "Passwords are not the same!": "passwordsDoNotMatch",
  "Please provide your name/email/password": "requiredFieldsMissing",
};

export function translateApiError(error, t, i18n = defaultI18n, fallbackKey = "unexpectedError") {
  if (typeof i18n === "string") {
    fallbackKey = i18n;
    i18n = defaultI18n;
  }
  const message = typeof error === "string" ? error : error?.message;
  if (!message) return t(fallbackKey);

  const matchingLocaleKey = Object.keys(en).find((candidate) => en[candidate] === message);
  const key = knownApiErrors[message] || matchingLocaleKey || message;
  if (i18n.exists(key)) return t(key);

  const language = i18n.resolvedLanguage || i18n.language;
  return language?.startsWith("prs") ? t(fallbackKey) : message;
}
