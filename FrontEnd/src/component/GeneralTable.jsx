import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import {
  formatLocaleId,
  formatLocaleNumber,
  isIdColumn,
} from "@/lib/localeFormatters";
export default function GeneralTable({ columns, data, actions, getRowId }) {
  const { t, i18n } = useTranslation();
  const isDari = (i18n.resolvedLanguage || i18n.language).startsWith("prs");

  return (
    <div className=" w-full overflow-auto rounded-md border scrollbar-thin h-[calc(100vh-250px)]">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className="sticky top-0 bg-background rtl:text-right"
              >
                {column.label}
              </TableHead>
            ))}

            {actions && (
              <TableHead className="text-end sticky top-0 z-20 bg-background">
                {t("actions")}
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                // it tells that they loop over these columns and didnt found data
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-24 text-center"
              >
                {t("noDataFound")}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                // here we pass the id of specific customer or anytable to separate the each row , like in list we pass key
                key={getRowId ? getRowId(row) : JSON.stringify(row)}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className="whitespace-nowrap rtl:text-right"
                  >
                    {/* this structure is called bracket notation which take the specific value of an object */}
                    {column.render
                      ? column.render(row)
                      : column.format === "id" || isIdColumn(column.key)
                        ? formatLocaleId(row[column.key], isDari)
                      : column.format === "number"
                        ? formatLocaleNumber(row[column.key], isDari)
                        : (row[column.key] ?? "-")}
                  </TableCell>
                ))}

                {actions && (
                  <TableCell className="text-end">
                    {/* here we write actions(row) to mention this action is belong to which cell or data in a cell*/}
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
