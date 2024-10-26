"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

const CategoriesPage = () => {
  const NewCategory = useNewCategory();
  const categoriesQuery = useGetCategories();
  const deleteCategories = useBulkDeleteCategories();

  const isDeleteDisabled =
    categoriesQuery.isLoading || deleteCategories.isPending;

  const categories = categoriesQuery.data || [];

  if (categoriesQuery.isLoading) {
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
            Categories Page
          </CardTitle>
          <Button onClick={NewCategory.onOpen}>
            <Plus className="size-4 mr-1" />
            Add New
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={categories}
            filterKey="name"
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteCategories.mutate({ ids });
            }}
            disabled={isDeleteDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
