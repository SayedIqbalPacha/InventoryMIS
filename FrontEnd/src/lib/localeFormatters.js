const DARI_LOCALE = "fa-AF-u-ca-gregory";

function parseDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value ?? "").trim();
  if (!text) return null;

  // Treat date-only values as UTC so the displayed day cannot shift by timezone.
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(text);
  const parsed = dateOnly
    ? new Date(Date.UTC(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])))
    : new Date(text);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatLocaleDate(value, isDari, options = {}) {
  const { fallback = "-", formatEnglish = false, ...dateOptions } = options;
  if (value == null || value === "") return fallback;

  const date = parseDate(value);
  if (!date) return fallback;

  if (!isDari && !formatEnglish) {
    return value instanceof Date
      ? value.toISOString().slice(0, 10)
      : String(value).slice(0, 10);
  }

  return new Intl.DateTimeFormat(isDari ? DARI_LOCALE : undefined, {
    timeZone: "UTC",
    ...(isDari
      ? { year: "numeric", month: "2-digit", day: "2-digit" }
      : {}),
    ...dateOptions,
  }).format(date);
}

export function formatLocaleNumber(value, isDari, options = {}) {
  const {
    fallback = "-",
    formatEnglish = false,
    ...numberOptions
  } = options;
  if (value == null || value === "") return fallback;

  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  if (!isDari && !formatEnglish) return value;

  return new Intl.NumberFormat(isDari ? "fa-AF" : undefined, numberOptions).format(
    number,
  );
}

export function formatLocaleId(value, isDari, fallback = "-") {
  if (value == null || value === "") return fallback;
  if (!isDari) return value;

  return String(value).replace(/[0-9]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

export function isIdColumn(key) {
  const normalized = String(key ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .toLowerCase();

  return normalized === "id" || normalized.endsWith("_id");
}
