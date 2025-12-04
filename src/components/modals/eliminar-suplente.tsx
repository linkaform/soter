/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Dispatch, SetStateAction } from "react";

interface EliminarSuplenteModalProps {
  title: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  isLoading: boolean;
}

export const EliminarSuplenteModal: React.FC<EliminarSuplenteModalProps> = ({
  title,
  open,
  setOpen,
  onDelete,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 mb-5 flex flex-col items-center">
          <p className="text-center">
            ¿Está seguro que desea eliminar el guardia suplente?
          </p>
          <small>Una vez confirmada la acción no se podrá deshacer.</small>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              onDelete();      // Ejecuta la acción
              setOpen(false);  // Cierra el modal automáticamente
            }}
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Confirmar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
