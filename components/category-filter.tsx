"use client";

import qs from "query-string";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSummary } from "@/features/summary/use-get-summary";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";

export const CategoryFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const categoryId = params.get("categoryId") || "all";
  const accountId = params.get("accountId") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const x = pathname === "/" ? useGetSummary() : useGetTransactions();

  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories();

  const onChange = (newValue: string) => {
    const query = { categoryId: newValue, accountId, from, to };
    if (newValue === "all") query.categoryId = "";

    const url = qs.stringifyUrl(
      { url: pathname, query },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <Select
      onValueChange={onChange}
      value={categoryId}
      disabled={isLoadingCategories || x.isLoading}
    >
      <SelectTrigger className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-white/30 transition">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories?.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
