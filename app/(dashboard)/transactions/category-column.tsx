import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface Props {
  id: string;
  categoryId: string | null;
  category: string | null;
}

export const CategoryColumn: React.FC<Props> = ({
  id,
  category,
  categoryId,
}) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const { onOpen: onOpenTransaction } = useOpenTransaction();

  return (
    <div
      onClick={() => {
        if (categoryId) onOpenCategory(categoryId);
        else onOpenTransaction(id);
      }}
      className={cn(
        "flex item-center cursor-pointer hover:underline",
        !category && "text-rose-500"
      )}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0 " />}
      {category || "Uncategorized"}
    </div>
  );
};
