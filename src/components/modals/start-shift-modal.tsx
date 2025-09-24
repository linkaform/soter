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
import { useShiftStore } from "@/store/useShiftStore";
import { useGuardSelectionStore } from "@/store/useGuardStore";
import { useGetShift } from "@/hooks/useGetShift";
import { Imagen } from "@/lib/update-pass-full";

interface StartShiftModalProps {
  title: string;
  children: React.ReactNode;
  evidencia: Imagen[]
}

export const StartShiftModal: React.FC<StartShiftModalProps> = ({
  title,
  children,
  evidencia, 
}) => {
  const { area, location } = useShiftStore();

  const { selectedGuards } = useGuardSelectionStore();

  const { startShiftMutation } = useGetShift(false);

  const guardNames = selectedGuards
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
            ¿Desea iniciar el turno en la ubicación{" "}
            <span className="font-semibold">{area}</span> en la
            <span className="font-semibold"> {location}</span>
            {guardNames?.length > 0 ? (
              <>
                {"  "}con los siguientes guardias{" "}
                <span className="font-semibold">{guardNames}</span>?
              </>
            ) : (
              "?"
            )}
          </p>
        </div>

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                const formattedGuards = selectedGuards?.map(
                  (guard: { user_id: number; name: string }) => ({
                    user_id: guard.user_id,
                    name: guard.name,
                  })
                );

                startShiftMutation.mutate({ employee_list: formattedGuards ,fotografia:evidencia});
              }}
            >
              Confirmar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
