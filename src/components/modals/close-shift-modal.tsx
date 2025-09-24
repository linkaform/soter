/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Imagen } from "@/lib/update-pass-full";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useGetShift } from "@/hooks/useGetShift";

interface CloseShiftModalProps {
  title: string;
  children: React.ReactNode;
  shift: any;
  area: string;
  location: string;
  identificacion: Imagen[];
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  title,
  children,
  shift,
  area,
  location,
  identificacion
}) => {
  const { closeShiftMutation } = useGetShift( false);
  
  const guardNames = Array.isArray(shift?.support_guards) && shift.support_guards.length > 0
    ? shift.support_guards
        .filter((guardia: { name: string }) => guardia && guardia.name && guardia.name.trim() !== "")
        .map((guardia: { name: string }) => guardia.name)
        .join(", ")
    : "";

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
            Estás a punto de cerrar el turno en la{" "}
            <span className="font-semibold">{area}</span> de la {" "}
            <span className="font-semibold">{location}</span>
            {guardNames?.length > 0 && (
              <>
                {" "}
                con los siguientes guardias de apoyo: {" "}
                <span className="font-semibold">{guardNames}</span>
              </>
            )}
            {" "}¿Deseas continuar?
          </p>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button
            className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => closeShiftMutation.mutate({fotografia:identificacion})}
          >
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};