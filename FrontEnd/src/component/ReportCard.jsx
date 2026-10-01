import { formatLocaleNumber } from "@/lib/localeFormatters";

export default function ReportCard({
  title,
  value = 0,
  suffix = "",
  decimals = 2,
  formatDariNumbers = false,
}) {
  const formattedValue = formatLocaleNumber(value, formatDariNumbers, {
    formatEnglish: true,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const displayedSuffix = suffix;

  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <p className="truncate text-sm text-muted-foreground">{title}</p>

      <div className="mt-2 flex min-w-0 items-baseline gap-1">
        <p className="min-w-0 truncate text-2xl font-bold tracking-tight sm:text-2xl">
          {formattedValue}
        </p>

        {displayedSuffix && (
          <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
            {displayedSuffix}
          </span>
        )}
      </div>
    </div>
  );
}
