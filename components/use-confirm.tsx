import { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";

export const useConfirm = (
  title: string,
  message: string
): [() => React.JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  //   when triggered, it will set the resolvable function
  const confirm = async () =>
    new Promise((resolve, reject) => setPromise({ resolve }));

  const handleClose = () => setPromise(null);

  //   when triggered , it will invoke the resolvable function with a true mark
  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  //   when triggered , it will invoke the resolvable function with a true mark
  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button onClick={handleCancel} variant={"outline"}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};
