import { CloseShiftModal } from "@/components/modals/close-shift-modal";
import { StartShiftModal } from "@/components/modals/start-shift-modal";
import { Button } from "@/components/ui/button";
import { useGetShift } from "@/hooks/useGetShift";
import React from "react";

const TurnStatus = () => {
  const { shift, startShiftMutation, closeShiftMutation } = useGetShift();

  return (
    <div className="flex items-center flex-col md:flex-row justify-between mb-10 md:mb-5">
      <div className="flex mb-5 lg:mb-0">
        <div className="flex space-x-10">
          <div className="">
            <p className="">Estatus del Turno:</p>
            <p
              className={`font-semibold ${
                shift?.guard?.status_turn === "Turno Cerrado"
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {shift?.guard?.status_turn}
            </p>
          </div>
        </div>
      </div>
      <div>
        <StartShiftModal
          title="Confirmación"
          startShiftMutation={startShiftMutation}
        >
            {shift?.guard?.status_turn === "Turno Cerrado" && (
              <Button className="w-[520px] md:w-[300px] bg-blue-500  hover:bg-blue-600">
                Iniciar turno
              </Button>
            )}
        </StartShiftModal>



        <CloseShiftModal
          title="Confirmación"
          closeShiftMutation={closeShiftMutation}
        >
        {shift?.guard?.status_turn !== "Turno Cerrado" && (
          <Button
            className="w-[520px] md:w-[300px] bg-red-600 hover:bg-red-700"
          >
            Cerrar turno
          </Button>
        )}
        </CloseShiftModal>

      </div>
    </div>
  );
};

export default TurnStatus;
