import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertCategorySchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Trash } from "lucide-react";

export const formSchema = insertCategorySchema.pick({ name: true });

export type FormValues = z.input<typeof formSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled: boolean;
}

export const CategoryForm: React.FC<Props> = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Food, Travel etc."
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full capitalize" disabled={disabled}>
          {id ? "save changes" : "create category"}
        </Button>
        {!!id && (
          <Button
            variant={"outline"}
            className="w-full"
            onClick={handleDelete}
            disabled={disabled}
            type="button"
          >
            <Trash className="size-4 mr-2" />
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
};
