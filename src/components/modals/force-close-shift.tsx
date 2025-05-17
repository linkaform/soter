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
import { useGetShift } from "@/hooks/useGetShift";
import { formatDateToText } from "@/lib/utils";

type BoohtInfo={
    status?: string
    user_id?: string
    stated_at?: string
    guard_on_dutty?: string
    checkin_id?: string
}

interface StartShiftModalProps {
  title: string;
  children: React.ReactNode;
  boothInfo: BoohtInfo
}

export const ForceCloseShift: React.FC<StartShiftModalProps> = ({
  title,
  children,boothInfo
}) => {
  const { area, location } = useShiftStore();
  const { forceCloseShift } = useGetShift(false);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mb-2">
          <p className="text-center">
            La caseta actual no esta disponible. Fue abierta por el guardia{" "}
            <span className="font-semibold">{boothInfo?.guard_on_dutty}</span> el dia 
            <span className="font-semibold"> { formatDateToText(boothInfo?.stated_at ||"") }</span>
            . ¿Desea proceder con el cierre forzado de la caseta? 
            <span className="font-semibold"> Tenga en cuenta que una vez confirmado, esta accion no podrá deshacerse.</span>
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
                if(boothInfo?.checkin_id)
                  forceCloseShift.mutate({ area: area, location: location, checkin_id: boothInfo?.checkin_id });
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
