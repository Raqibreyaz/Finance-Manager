import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

interface Props {
  accountId: string;
  account: string;
}

export const AccountColumn: React.FC<Props> = ({  account, accountId }) => {
  const { onOpen: onOpenAccount } = useOpenAccount();

  return (
    <div
      onClick={() => onOpenAccount(accountId)}
      className="flex item-center cursor-pointer hover:underline"
    >
      
      {account}
    </div>
  );
};
