import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function PrintButton({
  contentRef,
  title = "Print / save PDF",
  documentTitle = "Inventory-Report",
}) {
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle,
  });

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handlePrint}
      className="gap-2 mb-1"
    >
      <Printer className="h-4 w-4" />
      {title}
    </Button>
  );
}
