// ModalDescargarPase.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ModalDescargarPaseProps {
  open: boolean;
  onClose: () => void;
  onDescargarImagen: () => void;
  onDescargarPDF: () => void;
}

const ModalDescargarPase: React.FC<ModalDescargarPaseProps> = ({
  open,
  onClose,
  onDescargarImagen,
  onDescargarPDF,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg text-center font-bold">
            Descargar pase de entrada
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-2">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onDescargarImagen}
          >
            Descargar como imagen
          </Button>
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            onClick={onDescargarPDF}
          >
            Descargar como PDF
          </Button>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDescargarPase;