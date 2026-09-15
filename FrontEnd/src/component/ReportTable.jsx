export default function ReportTable({
  title,
  columns = [],
  data = [],
  emptyMessage = "No data available.",
}) {
  return (
    <section className="min-w-0 rounded-xl border bg-card shadow-sm">
      {/* HEADER */}

      <div className="border-b p-4 sm:p-5">
        <h2 className="text-base font-semibold sm:text-lg">{title}</h2>
      </div>

      {/* TABLE */}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b bg-muted/40">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 font-medium"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="border-b last:border-0">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="whitespace-nowrap px-4 py-3"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
