import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ViewDetalleArea } from "./modals/view-detalle-area-rondin";
import { useState } from "react";

interface CarruselDetalleAreaProps {
  areas: any[];
  diaSelected: number;
  rondin: string;
  estatus: string;
  selectedRondin: any;
  startIndex?: number;
  onClose: () => void;
}

export const CarruselDetalleArea: React.FC<CarruselDetalleAreaProps> = ({
  areas,
  diaSelected,
  rondin,
  estatus,
  selectedRondin,
  startIndex = 0,
  onClose,
}) => {
  const [activeIndex, setActiveIndex] = useState(startIndex);

  const prev = () =>
    setActiveIndex((prev: number) =>
      prev === 0 ? areas.length - 1 : prev - 1
    );

  const next = () =>
    setActiveIndex((prev: number) =>
      prev === areas.length - 1 ? 0 : prev + 1
    );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/70" onClick={onClose} >
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center" onClick={(e) => e.stopPropagation()}>

        {areas && areas.length > 1 &&
          <button
            onClick={prev}
            className="absolute left-[-50px] bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronLeft size={28} />
          </button>
        }
        <div className="relative flex items-center justify-center w-full h-[650px]">

          {areas.map((area, index) => {
            const isActive = index === activeIndex;
            const isLeft = index === (activeIndex - 1 + areas.length) % areas.length;
            const isRight = index === (activeIndex + 1) % areas.length;

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

            return (
              <div
                key={index}
                className={`
                  absolute transition-all 
                  ${position} ${zIndex}
                  w-[55%]
                  h-[600px]
                `}
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

                  <ViewDetalleArea
                    areaSelected={{
                      area: area,
                      estadoDia: area.estados?.find((e: { dia: number; }) => e.dia === diaSelected),
                    }}
                    diaSelected={diaSelected}
                    rondin={rondin}
                    estatus={estatus}
                    selectedRondin={selectedRondin}
                    onClose={onClose}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {areas && areas.length > 1 &&
          <button
            onClick={next}
            className="absolute right-[-50px] bg-white p-2 rounded-full shadow-lg"
          >
            <ChevronRight size={28} />
          </button>
        }
      </div>
    </div>
  );
};
