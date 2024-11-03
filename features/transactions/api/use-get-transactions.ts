import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { useSearchParams } from "next/navigation";

export const useGetTransactions = () => {
  const params = useSearchParams();

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";
  const categoryId = params.get("categoryId") || "";

  const query = useQuery({
    queryKey: ["transactions", { from, to, accountId, categoryId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
          categoryId
        },
      });

      if (!response.ok) throw new Error("failed to fetch transactions");

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
