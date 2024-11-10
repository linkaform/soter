import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ForceExitModalProps {
  title: string;
  children: React.ReactNode;
}

export const ForceExitModal: React.FC<ForceExitModalProps> = ({
  title,
  children,
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

        <div className="p-12">
          <p className="text-center mb-3">
            La caseta actual fue abierta por el guardia
            <span className="font-semibold"> Jacinto Martínez Sánchez </span>
            el día
            <span className="font-semibold"> 24 de Junio del 2024 </span>a las
            <span className="font-semibold"> 11:03:25 horas. </span>
          </p>

          <p className="text-center">
            ¿Desea proceder con el cierre forzado de la caseta? Una vez
            confirmado, la acción no podrá deshacerse.
          </p>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white ">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
