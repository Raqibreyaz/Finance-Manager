import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import {
  AccountForm,
  FormValues,
} from "@/features/accounts/components/account-form";
import { useConfirm } from "@/components/use-confirm";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory();

  const categoryQuery = useGetCategory(id);
  const editCategoryMutation = useEditCategory(id);
  const deleteCategoryMutation = useDeleteCategory(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure?",
    "You Are About To Delete This Transaction!"
  );

  const isLoading = categoryQuery.isLoading;

  const isPending = editCategoryMutation.isPending || deleteCategoryMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editCategoryMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = categoryQuery.data
    ? { name: categoryQuery.data.name }
    : { name: "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Your Category</SheetTitle>
            <SheetDescription>Edit an Existing Category</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="szie-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={async (): Promise<void> => {
                // will open the confirm dialog
                const ok = await confirm();

                // if user has confirmed the delete action then delete
                if (ok) {
                  deleteCategoryMutation.mutate(undefined, {
                    onSuccess: () => {
                      onClose();
                    },
                  });
                }
              }}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
