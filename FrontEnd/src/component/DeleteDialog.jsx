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


export default function DeleteDialog({open,onOpenChange,onConfirm,loading,name,tableName,}) {

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
            Delete {tableName}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <strong>{name}</strong>?
            This action cannot be undone.
          </AlertDialogDescription>

        </AlertDialogHeader>


        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">

          <AlertDialogCancel disabled={loading} className="w-full sm:w-auto">
            Cancel
          </AlertDialogCancel>


          <AlertDialogAction
            className="w-full sm:w-auto"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Deleting..."
              : "Delete"}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>

  );
}