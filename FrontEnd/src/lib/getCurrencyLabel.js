const CURRENCY_TRANSLATION_KEYS = {
  AFG: "currencyLabelAFG",
  CALDAR: "currencyLabelCALDAR",
  EURO: "currencyLabelEURO",
  POUND: "currencyLabelPOUND",
  RUPPI: "currencyLabelRUPPI",
  USD: "currencyLabelUSD",
};

export function getCurrencyLabel(currencyCode, t) {
  const code = String(currencyCode ?? "");
  const translationKey = CURRENCY_TRANSLATION_KEYS[code.trim().toUpperCase()];

  return translationKey ? t(translationKey) : code;
}
