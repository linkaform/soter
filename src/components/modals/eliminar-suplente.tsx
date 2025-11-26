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
  open:boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  onDelete:()=>void;
}

export const EliminarSuplenteModal: React.FC<EliminarSuplenteModalProps> = ({
  title,
  open,
  setOpen,
  onDelete
}) => {

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16 mb-5">
          <p className="text-center mb-5">
            ¿Esta seguro que desea eliminar el guardia suplente?
          </p>
          <small>Una vez confirmada la accion no se podra deshacer.</small>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
            onClick={()=>onDelete()}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};