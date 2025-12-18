"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
interface EstadoDia {
  dia: number;
  estado: string;
}

interface DaysCarouselProps {
  data?: {
    area?: {
      nombre: string;
      estados: EstadoDia[];
    };
    recorrido?: {
      nombre: string;
      estados: EstadoDia[];
    };
    estadoDia?: EstadoDia;
  };
  selectedDay: number | null;
  onDaySelect: Dispatch<SetStateAction<number>>
}

const estadoColors: Record<string, string> = {
  finalizado: "bg-green-600 text-white",
  fuera_de_hora: "bg-pink-600 text-white",
  no_inspeccionada: "bg-amber-500 text-white",
  cancelado: "bg-slate-400 text-white",
  en_progreso: "bg-blue-500 text-white",
  cerrado: "bg-gray-500 text-white",
  incidencias: "bg-red-500 text-white",
  programado: "bg-purple-500 text-white",
  no_aplica: "bg-gray-300 text-white",
};

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const DaysCarousel: React.FC<DaysCarouselProps> = ({
  data,
  selectedDay,
  onDaySelect,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!carouselRef.current || selectedDay == null) return;

    const button = carouselRef.current.querySelector<HTMLButtonElement>(
      `[data-dia='${selectedDay}']`
    );

    if (button) {
      button.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDay]);

  if (!data) return null;
  const { area, recorrido } = data;
  const source = area || recorrido;

  if (!source) return null;

  return (
    <div className="flex justify-center  mb-2">
      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 5,
        }}
        className="w-[300px] mx-auto"
      >
        <CarouselContent className="px-4 py-2" ref={carouselRef}>
          {source.estados.map(({ dia, estado }: EstadoDia) => {
            const date = new Date(2025, 8, dia);
            const dayOfWeek = date.getDay();

            const isSelected = selectedDay === dia;

            return (
              <CarouselItem key={dia} className="basis-auto px-1">
                <div className="flex flex-col items-center min-w-[30px]">
                  <button
                    data-dia={dia}
                    type="button"
                    onClick={() => onDaySelect(dia)}
                    className={`
                    flex items-center justify-center rounded-full h-8 w-8 font-bold text-xs
                    border shadow-sm
                    ${isSelected ? "ring-2 ring-blue-400 border-blue-600" : ""}
                    ${estadoColors[estado] ?? "bg-gray-100 text-gray-600"}
                  `}
                    title={`Día ${dia}`}
                  >
                    {dia}
                  </button>

                  <span className="text-[10px] text-gray-500 mt-[2px]">
                    {dayNames[dayOfWeek]}
                  </span>
                </div>
              </CarouselItem>
            );
          })}

        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default DaysCarousel;