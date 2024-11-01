"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useConfirm } from "@/components/use-confirm";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";

interface Props {
  id: string;
}

export const Actions = ({ id }: Props) => {
  const { onOpen } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are You Sure?",
    "You are about to Delete this Transaction!"
  );

  const deleteMutation = useDeleteTransaction (id);

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) deleteMutation.mutate();
  };

  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="size-8 p-0">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={deleteMutation.isPending}
            onClick={handleDelete}
          >
            <Trash className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
