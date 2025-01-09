import { SetStateAction } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface SuccessModalProps {
  title: string;
  description: string;
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  description,
  open,
  setOpen,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 my-10">
          <p className="text-center">{description}</p>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Ok
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
