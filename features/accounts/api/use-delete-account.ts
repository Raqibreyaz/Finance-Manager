import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type T = (typeof client.api.accounts)[":id"]["$delete"];

type ResponseType = InferResponseType<T>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[":id"]["$delete"]({
        param: { id },
      });

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Deleted");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });    
    },
    onError: (error) => {
      toast.error("Failed to Delete Account");
    },
  });

  return mutation;
};
