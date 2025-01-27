/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UseMutationResult } from "@tanstack/react-query";
import { useShiftStore } from "@/store/useShiftStore";
import { useGetShift } from "@/hooks/useGetShift";

interface CloseShiftModalProps {
  title: string;
  children: React.ReactNode;
  closeShiftMutation: UseMutationResult<any, Error, void, void>
}

export const CloseShiftModal: React.FC<CloseShiftModalProps> = ({
  title,
  children,
  closeShiftMutation
}) => {


  const { shift } = useGetShift();
  
  const { area, location } = useShiftStore();


  

    const guardNames = shift?.support_guards
    ?.map((guardia: { name: string }) => guardia.name)
    .join(", ");




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
            ¿Seguro que quieres cerrar el turno en la {" "} 
            <span className="font-semibold">{area}</span>
          {" "}  en la
            <span className="font-semibold"> {location} </span>
            <span className="">con los siguientes</span>

            <span className="font-semibold"> {guardNames}?</span>

          </p>
         
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>


          <Button className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
             onClick={() => closeShiftMutation.mutate()}
          >
            Confirmar
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
};
