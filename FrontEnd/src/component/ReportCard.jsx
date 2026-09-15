export default function ReportCard({
  title,
  value = 0,
  suffix = "",
  decimals = 2,
}) {
  const formattedValue = Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div className="min-w-0 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
      <p className="truncate text-sm text-muted-foreground">{title}</p>

      <div className="mt-2 flex min-w-0 items-baseline gap-1">
        <p className="min-w-0 truncate text-2xl font-bold tracking-tight sm:text-2xl">
          {formattedValue}
        </p>

        {suffix && (
          <span className="shrink-0 text-xs text-muted-foreground sm:text-sm">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
