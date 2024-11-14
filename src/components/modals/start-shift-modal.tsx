"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface StartShiftModalProps {
  title: string;
  children: React.ReactNode;
}

export const StartShiftModal: React.FC<StartShiftModalProps> = ({
  title,
  children,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedGuardias, setSelectedGuardias] = useState([
    "Carlos Rodríguez Pérez",
    "Felipe Carranza Piña",
    "Fernando López García",
  ]);

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
          <p className="text-center mb-5">
            ¿Desea iniciar el turno en la caseta
            <span className="font-semibold"> 6 Poniente </span>
            en la
            <span className="font-semibold"> Planta Monterrey?</span>
          </p>
          <div>
            <p className="font-semibold mb-3">Guardias de Apoyo:</p>
            <ul className="list-disc ml-6">
              {selectedGuardias.length > 0 ? (
                selectedGuardias.map((guardia, index) => (
                  <li key={index}>{guardia}</li>
                ))
              ) : (
                <li className="text-gray-500">
                  No hay guardias seleccionados.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>


          <DialogClose asChild>
          <Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white ">
            Confirmar
          </Button>
          </DialogClose>

        </div>
      </DialogContent>
    </Dialog>
  );
};
