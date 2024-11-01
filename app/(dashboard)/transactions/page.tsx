"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-create-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { columns } from "./columns";
import { Row } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

const TransactionsPage = () => {
  const NewTransaction = useNewTransaction();
  const TransactionsQuery = useGetTransactions();
  const DeleteTransactions = useBulkDeleteTransactions();

  const isDeleteDisabled =
    TransactionsQuery.isLoading || DeleteTransactions.isPending;

  const transactions = TransactionsQuery.data || [];
  console.log(transactions);
  if (TransactionsQuery.isLoading) {
    return (
      <div className="border">
        <Card className="border-none drop-shadow-sm border">
          <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full flex items-center justify-center">
              <Loader2 className="animate-spin size-6 text-slate-300" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transactions History
          </CardTitle>
          <Button onClick={NewTransaction.onOpen}>
            <Plus className="size-4 mr-1" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={transactions}
            filterKey="payee"
            onDelete={(rows) => {
              const ids = rows.map((r) => r.original.id);
              // DeleteTransactions.mutate({ ids });
            }}
            disabled={isDeleteDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
