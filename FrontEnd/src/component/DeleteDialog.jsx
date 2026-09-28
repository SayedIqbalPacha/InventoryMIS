import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";

export default function DeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  loading,
  name,
  tableName,
}) {
  const { t } = useTranslation();
  return (
    // <DeleteDialog

    //   open={deleteOpen}

    //   onOpenChange={setDeleteOpen}

    //   onConfirm={handleDelete}

    //   loading={deleteLoading}

    //   name={
    //     customerToDelete?.customer_name
    //   }
    //
    //    tableName="Customer"

    // />

    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[calc(100%-2rem)] max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("deleteItemTitle", { tableName })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirm", { name })} {t("deleteCannotUndo")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel disabled={loading} className="w-full sm:w-auto">
            {t("cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? t("deleting") : t("delete")}{" "}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
