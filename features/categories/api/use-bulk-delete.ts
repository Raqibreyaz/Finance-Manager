import { toast } from "sonner";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type ResponseType = InferResponseType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.categories)["bulk-delete"]["$post"]
>["json"];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories["bulk-delete"]["$post"]({
        json,
      });

      return await response.json();
    },
    onSuccess: (_, { ids }) => {
      toast.success("Selected Categories Deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      ids.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      });
    },
    onError: () => {
      toast.error("Failed to Delete the Selected Categories");
    },
  });

  return mutation;
};
