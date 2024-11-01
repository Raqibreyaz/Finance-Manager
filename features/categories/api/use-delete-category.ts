import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type T = (typeof client.api.categories)[":id"]["$delete"];

type ResponseType = InferResponseType<T>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[":id"]["$delete"]({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category Deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // TODO: invalidate summary and transactions
    },
    onError: (error) => {
      toast.error("Failed to Delete Category");
    },
  });

  return mutation;
};
