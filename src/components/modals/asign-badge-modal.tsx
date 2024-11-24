import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface AssingBadgeModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const AssingBadgeModal: React.FC<AssingBadgeModalProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 mb-5">
          {
           description && <p>{description}</p>
          }  
           
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
