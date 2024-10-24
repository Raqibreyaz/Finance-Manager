import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type T = (typeof client.api.accounts)[":id"]["$patch"];

type ResponseType = InferResponseType<T>;
type RequestType = InferRequestType<T>["json"];

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[":id"]["$patch"]({
        param: { id },
        json,
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Updated");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      // TODO: invalidate summary and transactions
    },
    onError: (error) => {
      console.log(error);

      toast.error("Failed to Edit Account");
    },
  });

  return mutation;
};
