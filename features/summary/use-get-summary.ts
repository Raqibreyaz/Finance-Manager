import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";
import { convertAmountFromMilliunits } from "@/lib/utils";

export const useGetSummary = () => {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";
  const categoryId = params.get("categoryId") || "";

  const query = useQuery({
    queryKey: ["summary", { from, to, accountId, categoryId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({
        query: {
          from,
          to,
          accountId,
          categoryId
        },
      });

      if (!response.ok) throw new Error("failed to fetch Summary");

      const { data } = await response.json();

      return {
        ...data,
        incomeAmount: convertAmountFromMilliunits(data.incomeAmount),
        expensesAmount: convertAmountFromMilliunits(data.expensesAmount),
        remainingAmount: convertAmountFromMilliunits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMilliunits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMilliunits(day.income),
          expenses: convertAmountFromMilliunits(day.expenses),
        })),
      };
    },
  });

  return query;
};
