import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ExitGuardModalProps {
  title: string;
  children: React.ReactNode;
  empleado: string;
  onConfirm: () => void;
}

export const ExitGuardModal: React.FC<ExitGuardModalProps> = ({
  title,
  children,
  empleado,
  onConfirm
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 mb-5">
          <p className="text-center mb-3">
            ¿Estas seguro que quieres registrar la salida del guardia{" "}
            <span className="font-semibold">{empleado}?</span>
          </p>

          <p className="text-center">
            Una vez confirmada, la acción no se podrá deshacer.{" "}
          </p>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white"
           onClick={onConfirm}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
