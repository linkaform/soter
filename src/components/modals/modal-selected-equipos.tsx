import React from "react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { Equipo } from "@/lib/update-pass-full";

interface Props {
  title: string;
  children: React.ReactNode;
  selectedEquipos:Equipo[]
}

export const SelectedEquiposModal: React.FC<Props> = ({
  title,
  children,
  selectedEquipos
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>

          <Separator />
        </DialogHeader>

        {selectedEquipos && selectedEquipos.length>0?
            <div className="overflow-auto border rounded-md">
              <table className="min-w-full table-auto text-sm text-left">
                <thead className="bg-gray-100 font-semibold">
                  <tr>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Nombre</th>
                    <th className="px-4 py-2">Marca</th>
                    <th className="px-4 py-2">Modelo</th>
                    <th className="px-4 py-2">Serie</th>
                    <th className="px-4 py-2">Color</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEquipos.map((equipo, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{equipo?.tipo}</td>
                      <td className="px-4 py-2">{equipo?.nombre}</td>
                      <td className="px-4 py-2">{equipo?.marca}</td>
                      <td className="px-4 py-2">{equipo?.modelo}</td>
                      <td className="px-4 py-2">{equipo?.serie}</td>
                      <td className="px-4 py-2">{equipo?.color}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        :
          <div className="text-center text-gray-500">No hay equipos seleccionados</div>
        }

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};