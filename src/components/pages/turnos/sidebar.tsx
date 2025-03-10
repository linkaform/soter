import { ChangeBoothModal } from "@/components/modals/change-booth-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetShift } from "@/hooks/useGetShift";
import useAuthStore from "@/store/useAuthStore";
import React from "react";

const Sidebar = () => {
  const { shift } = useGetShift();

  const { userEmailSoter, userNameSoter } = useAuthStore();

  const getInitials = (name: string | null) => {
    if (!name) return "N/A"; // Si no hay nombre, usa "N/A"
    return name
      .split(" ") 
      .map((word) => word[0])
      .join("")
      .toUpperCase(); 
  };

  return (
    <div className="max-w-[520px]  lg:max-w-[320px] mx-auto">
      <div className="flex  flex-col space-y-5 mb-10 ">
        <Avatar className="w-32 h-32 mx-auto">
          <AvatarImage
            width="300"
            height="300"
            src={shift?.guard?.picture || "/image/sidebar.png"}
            alt="Avatar"
          />
          <AvatarFallback>{getInitials(userNameSoter)}</AvatarFallback>
        </Avatar>

        <div className="">


          <p className="font-bold text-2xl">{userNameSoter}</p>
          <p className="">{shift?.guard?.position}</p>
          <p className="">{userEmailSoter}</p>
        </div>

        <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700">
          Cambiar Imagen
        </Button>
      </div>

      <div className="flex flex-col space-y-5 mb-10">
        <div className="flex">
          <div className="w-full">
            <p>Ubicación:</p>
            <p className="">{shift?.location?.name || "---"}</p>{" "}
          </div>

          <div className="w-full">
            <p>Ciudad:</p>
            <p className="">{shift?.location?.city || "---"}</p>
          </div>
        </div>

        <div className="flex">
          <div className="w-full">
            <p>Estado:</p>
            <p className="">{shift?.location?.state || "---"}</p>
          </div>

          <div className="w-full">
            <p>Dirección:</p>
            <p className="">{shift?.location?.address || "---"}</p>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="w-full">
            <p>Caseta:</p>
            <p className="">{shift?.location?.area || "---"}</p>
          </div>
        </div>

        <ChangeBoothModal title="Cambiar caseta">
          <Button
            className="w-full  bg-blue-500 text-white hover:bg-blue-600"
            disabled={shift?.guard?.status_turn == "Turno Abierto"}
          >
            Cambiar Caseta
          </Button>
        </ChangeBoothModal>
      </div>
      <div className="flex  flex-col space-y-5 mb-10">
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
              <p className="">Guardia en turno:</p>
              <p className="">{shift?.booth_status?.guard_on_dutty || "---"}</p>
            </div>
            <div className="">
              <p className="">Fecha de inicio de turno:</p>
              <div className="flex justify-between">
                <p className="">{shift?.booth_status?.stated_at || "---"}</p>
              </div>
            </div>
          </>
        )}
        {/* 
         <ForceExitModal title="Confirmación">
          <Button className="w-full bg-red-500 text-white hover:bg-red-600"
            disabled={shift?.guard?.status_turn == "Turno Abierto"}

          >
            Forzar Salida
          </Button>
        </ForceExitModal>  */}
      </div>
    </div>
  );
};

export default Sidebar;
