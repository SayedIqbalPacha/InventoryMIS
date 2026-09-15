import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatDate(date) {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function getSaleKey(sale) {
  return `${sale.sales_id}-${sale.item_id}`;
}

export function SalesTable({ data = [] }) {
  const total = data.reduce(
    (sum, sale) => sum + Number(sale.total_sale_afn || 0),
    0,
  );

  return (
    <Table>
      <TableCaption>Your most recent sales</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead>Sale</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No sales found.
            </TableCell>
          </TableRow>
        ) : (
          data.map((sale) => (
            <TableRow key={getSaleKey(sale)}>
              <TableCell className="font-medium">#{sale.sales_id}</TableCell>

              <TableCell>{sale.customer_name}</TableCell>

              <TableCell>{sale.item_name}</TableCell>

              <TableCell>{formatDate(sale.sales_date)}</TableCell>

              <TableCell className="text-right">
                {formatNumber(sale.total_sale_afn)} AFN
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Total shown</TableCell>

          <TableCell className="text-right">
            {formatNumber(total)} AFN
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
