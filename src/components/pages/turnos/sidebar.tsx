import { ChangeBoothModal } from "@/components/modals/change-booth-modal";
import { ForceExitModal } from "@/components/modals/force-exit-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetShift } from "@/hooks/useGetShift";
import useAuthStore from "@/store/useAuthStore";
import React from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { uploadProfilePicture } from "@/lib/change-guard-picture";

const Sidebar = () => {
  const { shift } = useGetShift();

  const { user } = useAuthStore();


  console.log(user?.profile_picture)


  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; 

    console.log(file)
  if (file) {
      try {
        const result =  uploadProfilePicture(file); // Sube la imagen
        console.log("Respuesta del servidor:", result); // Maneja la respuesta
      } catch (error) {
        console.error("Error al subir la imagen:", error); // Maneja errores
      }
    } else {
      console.error("No se seleccionó ningún archivo.");
    } 
  };


  return (
    <div className="max-w-[520px]  lg:max-w-[320px] mx-auto">
      <div className="flex  flex-col space-y-5 mb-5">
        {user?.profile_picture ? (
          <Image
            src={user.profile_picture}
            alt="profile picture"
            width={128} 
            height={128}
            className="rounded-full object-cover mx-auto"
            priority
          />
        ) : (
          <div className="rounded-full w-32 h-32 bg-gray-200 flex items-center justify-center text-2xl font-bold text-white">
            {user ? `${user.name[0]}${user.first_name[0]}`.toUpperCase() : "?"}
          </div>
        )}

        <div className="">
          <p className="font-bold text-2xl">{user?.name}</p>
          <p className="text-sm">Guardia líder</p>
          <p className="text-sm">{user?.email}</p>
        </div>

        <div>
      {/* Input de archivo oculto */}
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
       className="hidden"
      />

  
      <Label htmlFor="file-input" className="">
        <div className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-md text-center cursor-pointer">
        Cambiar Imagen

        </div>

      </Label>

    </div>
      </div>

      <div className="flex flex-col space-y-5 mb-5">
        <div className="flex">
          <div className="w-full">
            <p className="text-sm">Ubicación:</p>
            <p className="text-sm font-semibold">
              {shift?.location?.name || "---"}
            </p>
          </div>

          <div className="w-full">
            <p className="text-sm">Ciudad:</p>
            <p className="text-sm font-semibold">{shift?.location?.city || "---"}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <p className="text-sm">Estado:</p>
            <p className="text-sm font-semibold">{shift?.location?.state || "---"}</p>
          </div>

          <div className="w-full">
            <p className="text-sm">Dirección:</p>
            <p className="text-sm font-semibold">{shift?.location?.address || "---"}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="w-full">
            <p className="text-sm">Caseta:</p>
            <p className="text-sm font-semibold">{shift?.location?.area || "---"}</p>
          </div>
        </div>

        <ChangeBoothModal title="Cambiar caseta">
          <Button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700"
            disabled={shift?.guard?.status_turn == "Turno Abierto"}
          >
            Cambiar Caseta
          </Button>
        </ChangeBoothModal>
      </div>
      <div className="flex  flex-col space-y-5 mb-5">
        <div className="">
          <p>Estatus de la caseta:</p>
          <Badge
            className={`text-white ${
              shift?.booth_status?.status === "Disponible"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {shift?.booth_status?.status || "---"}
          </Badge>
        </div>

        {shift?.booth_status?.status === "No Disponible" && (
          <>
            <div className="">
              <p className="text-sm">Guardia en turno:</p>
              <p className="text-sm">
                {shift?.booth_status?.guard_on_dutty || "---"}
              </p>
            </div>
            <div className="">
              <p className="text-sm">Fecha de inicio de turno:</p>
              <div className="flex justify-between">
                <p className="text-sm">
                  {shift?.booth_status?.stated_at || "---"}
                </p>
              </div>
            </div>
          </>
        )}

        <ForceExitModal title="Confirmación">
          <Button  className="w-full bg-red-500 text-white hover:bg-red-600">
            Forzar Salida
          </Button>
        </ForceExitModal>
      </div>
    </div>
  );
};

export default Sidebar;
