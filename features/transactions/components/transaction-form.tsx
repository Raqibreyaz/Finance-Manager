import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema, insertTransactionSchema } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Trash } from "lucide-react";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMilliunits } from "@/lib/utils";

export const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({ id: true });

export type FormValues = z.input<typeof formSchema>;
export type ApiFormValues = z.input<typeof apiSchema>;

interface Props {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
}

export const TransactionForm: React.FC<Props> = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log(values);

    const amountInMilliunits = convertAmountToMilliunits(
      parseFloat(values.amount)
    );
    onSubmit({ ...values, amount: amountInMilliunits });
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
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  onChange={field.onChange}
                  value={field.value}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an Category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add a Payee"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional Notes"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className="w-full capitalize" disabled={disabled}>
          {id ? "save changes" : "create transaction"}
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
            Delete Transaction
          </Button>
        )}
      </form>
    </Form>
  );
};
