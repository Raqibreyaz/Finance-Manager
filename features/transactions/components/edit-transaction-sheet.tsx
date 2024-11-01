import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/components/use-confirm";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { ApiFormValues, TransactionForm } from "./transaction-form";
import { insertTransactionSchema } from "@/db/schema";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

const formSchema = insertTransactionSchema.omit({ id: true });

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map(({ id, name }) => ({
    label: name,
    value: id,
  }));

  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure?",
    "You Are About To Delete This Transaction!"
  );

  const isLoading =
    transactionQuery.isLoading ||
    accountQuery.isLoading ||
    categoryQuery.isLoading;

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const onSubmit = (values: ApiFormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const defaultValues = transactionQuery.data
    ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date
          ? new Date(transactionQuery.data.date)
          : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes,
      }
    : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: "",
      };

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) deleteMutation.mutate(undefined, { onSuccess: () => onClose() });
  };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an Existing Transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="szie-4 text-muted-foreground animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              defaultValues={defaultValues}
              onSubmit={onSubmit}
              disabled={isPending}
              onCreateCategory={onCreateCategory}
              categoryOptions={categoryOptions}
              onCreateAccount={onCreateAccount}
              accountOptions={accountOptions}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};
