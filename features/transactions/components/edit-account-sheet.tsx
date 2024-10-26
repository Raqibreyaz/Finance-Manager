import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import {
  AccountForm,
  FormValues,
} from "@/features/accounts/components/account-form";
import { useConfirm } from "@/components/use-confirm";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { aggregationFns } from "@tanstack/react-table";

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);
  const deleteMutation = useDeleteAccount(id);

  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure?",
    "You Are About To Delete This Transaction!"
  );

  const isLoading = accountQuery.isLoading;

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: "" };

  console.log("rendering edit sheet");

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Your Account</SheetTitle>
            <SheetDescription>Edit an Existing Account</SheetDescription>
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
                  deleteMutation.mutate(undefined, {
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
