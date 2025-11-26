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
import { Input } from "../ui/input";

interface NombreSuplenteModalProps {
    title: string;
    nombreSuplente: string;
    setNombreSuplente: Dispatch<SetStateAction<string>>;
    onSuplenteConfirmado: () => void;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export const NombreSuplenteModal: React.FC<NombreSuplenteModalProps> = ({
  title,
  nombreSuplente,
  setNombreSuplente,
  onSuplenteConfirmado,
  open,
  setOpen
}) => {
    
    return (
    <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className="max-w-xl">
            <DialogHeader>
            <DialogTitle className="text-2xl text-center  font-bold ">
                {title}
            </DialogTitle>
            </DialogHeader>

        <div className="p-4">
            <Input
            placeholder="Nombre del suplente"
            className="resize-none"
            value={nombreSuplente}
            onChange={(e) => setNombreSuplente(e.target.value)}
            />
                        
            <div className="flex gap-5 mt-5">
                <DialogClose asChild>
                    <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                    Cancelar
                    </Button>
                </DialogClose>

                <Button
                    className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
                    onClick={() => {
                        setOpen(false); onSuplenteConfirmado();}}
                    disabled={nombreSuplente.trim() === ""}

                >
                    Confirmar
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};