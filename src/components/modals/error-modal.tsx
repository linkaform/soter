
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ErrorModalProps {
  title: string;
  children: React.ReactNode;
  message: string;
  description: string;
}


export const ErrorModal: React.FC<ErrorModalProps> = ({
  title,
  children,
  message,
  description
}) => {
 
 
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>


        <div className="px-16 text-center">

          <p className="mb-2">{message}</p>

          <p>{description}</p>


        </div>


        <div className="flex ">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancelar
                </Button>
              </DialogClose>




           


            </div>

        



       
      </DialogContent>
    </Dialog>
  );
};
