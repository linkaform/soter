"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { ViewRondinesDetallePerimetroExt } from "./modals/rondines-inspeccion-perimetro-exterior";

interface CarruselDetalleRondinProps {
  rondinesHoraSeleccionada: any
  diaSelected: number;
  estatus: string;
  startIndex?: number;
  onClose: () => void;
}

export const CarruselDetalleRondin: React.FC<CarruselDetalleRondinProps> = ({
  rondinesHoraSeleccionada,
  diaSelected,
  estatus,
  startIndex = 0,
  onClose,
}) => {
  // Filtramos los rondines de la hora seleccionada

  const [activeIndex, setActiveIndex] = useState(startIndex);
  const prev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? rondinesHoraSeleccionada.length - 1 : prev - 1
    );

  const next = () =>
    setActiveIndex((prev) =>
      prev === rondinesHoraSeleccionada.length - 1 ? 0 : prev + 1
    );

  console.log("TODOS LOS RONDINES???", rondinesHoraSeleccionada)


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {rondinesHoraSeleccionada.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-[-50px] bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <div className="relative flex items-center justify-center w-full h-[650px]">
          {rondinesHoraSeleccionada.map((rondin: any, index: number) => {
            const isActive = index === activeIndex;
            const isLeft = index === (activeIndex - 1 + rondinesHoraSeleccionada.length) % rondinesHoraSeleccionada.length;
            const isRight = index === (activeIndex + 1) % rondinesHoraSeleccionada.length;

            let position = "opacity-0 scale-75 translate-x-0 rotate-[0deg]";
            let zIndex = "z-0";

            if (isActive) {
              position = "opacity-100 scale-100 translate-x-0 rotate-[0deg]";
              zIndex = "z-20";
            } else if (isLeft) {
              position = "opacity-50 scale-[0.8] -translate-x-[230px]";
              zIndex = "z-10";
            } else if (isRight) {
              position = "opacity-50 scale-[0.8] translate-x-[230px]";
              zIndex = "z-10";
            }
            console.log("RONDIN", rondin)
            return (
              <div
                key={index}
                className={`absolute transition-all ${position} ${zIndex} w-[55%] h-[600px]`}
                style={{
                  transitionDuration: "900ms",
                  transitionTimingFunction: "cubic-bezier(.25,.8,.25,1)",
                }}
              >
                <div className="relative bg-white rounded-xl shadow-xl p-4 border">
                  {isActive && (
                    <button
                      onClick={onClose}
                      className="absolute top-2 right-2 z-50 bg-black/80 hover:bg-black text-white rounded-full p-1"
                    >
                      <X size={18} strokeWidth={2.5} />
                    </button>
                  )}

                  <ViewRondinesDetallePerimetroExt
                    estatus={estatus}
                    diaSelected={diaSelected}
                    selectedRondin={rondin}
                    areaSelected={{
                      area: rondin.areas[0] || null,
                      estadoDia: rondin.areas[0]?.estados?.find(
                        (e: { dia: number }) => e.dia === diaSelected
                      ),
                    }}
                    activeIndex={activeIndex}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {rondinesHoraSeleccionada.length > 1 && (
          <button
            onClick={next}
            className="absolute right-[-50px] bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </div>
  );
};
