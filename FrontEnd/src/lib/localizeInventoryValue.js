import dariInventoryValues from "@/locales/itemData.prs.json";

export function localizeInventoryValue(value, isDari) {
  if (!isDari || typeof value !== "string") {
    return value ?? "-";
  }

  const normalizedValue = value.trim().toLowerCase();
  return dariInventoryValues[normalizedValue] || value;
}
