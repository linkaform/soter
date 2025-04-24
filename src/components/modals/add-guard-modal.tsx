/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import SearchInput from "../search-input";
import { useGetSupportGuards } from "@/hooks/useGetSupportGuards";
import Image from "next/image";
import { useShiftStore } from "@/store/useShiftStore";

interface AddGuardModalProps {
  title: string;
  children: React.ReactNode;
  onAddGuardias?: (selectedGuardias: GuardiaApoyo[]) => void;
}

type GuardiaApoyo = {
  id: string;
  empleado: string;
  avatar: string;
  status: string;
};

export const AddGuardModal: React.FC<AddGuardModalProps> = ({
  title,
  children,
}) => {
  const { supportGuards, addSupportGuardMutation, isLoading } = useGetSupportGuards();
  const { location, area, checkin_id } = useShiftStore();
  const [selectedGuard, setSelectedGuard] = useState<any>("");
  const [searchText, setSearchText] = useState<string>("");
  const filteredGuards = useMemo(() => {
    const uniqueGuards = supportGuards?.filter((guardia: any, index: number, self: any[]) =>
      index === self.findIndex((g) => g.id === guardia.id)
    );
  
    return uniqueGuards?.filter((guardia: any) =>
      guardia.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [supportGuards, searchText]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl min-h-[50vh]   max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>


        {isLoading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="w-16 h-16 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>

        <SearchInput
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="space-y-4">
          {filteredGuards?.map((guardia: any) => (
            <div
              key={guardia.user_id}
              onClick={() =>
                setSelectedGuard((prev: any) =>
                  prev?.user_id === guardia.user_id ? null : guardia
                )
              }
              className={`flex items-center justify-between px-4 py-2 border-b cursor-pointer ${
                selectedGuard?.user_id === guardia.user_id
                  ? "bg-[#9abcea]"
                  : "bg-white"
              }`
            }
            >
              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden">
                  <Image
                    src={guardia.picture || "/nouser.svg"}
                    alt={`${guardia.name || "Sin nombre"} avatar`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>

                <div>
                  <p className="font-semibold">{guardia?.name}</p>
                  <p className="text-sm text-gray-500">{guardia?.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGuards?.length === 0 && (
          <div className="text-center py-4">No se encontraron registros.</div>
        )}

        <div className="flex gap-5">
          <DialogClose asChild>
            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => {
              if (!selectedGuard) {
                console.log("No hay guardias seleccionados.");
                return;
              }

             addSupportGuardMutation.mutate({
                area,
                location,
                checkin_id: checkin_id,
                support_guards: [
                  { user_id: selectedGuard.user_id, name: selectedGuard.name },
                ],
              })
            
            }}
          >
            Agregar
          </Button>
        </div>

        </>
        )}
      </DialogContent>
    </Dialog>
  );
};