import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type T = (typeof client.api.transactions)[":id"]["$patch"];

type ResponseType = InferResponseType<T>;
type RequestType = InferRequestType<T>["json"];

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[":id"]["$patch"]({
        param: { id },
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction Updated");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error) => {
      toast.error("Failed to Edit Transaction");
    },
  });

  return mutation;
};
