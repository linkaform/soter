"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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
  resumen?: DiaCarrusel[];
  selectedDay: number | null;
  onDaySelect: Dispatch<SetStateAction<number>>
}

interface DiaCarrusel {
  dia: number;
  estado: string;
  record_id?: string;
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
  resumen,
  selectedDay,
  onDaySelect,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<any>(null);
  const dias: DiaCarrusel[] = (() => {
    if (Array.isArray(resumen)) return resumen;
    if (data?.area?.estados) return data.area.estados;
    if (data?.recorrido?.estados) return data.recorrido.estados;
    return [];
  })();

  useEffect(() => {
    if (!api || selectedDay == null || dias.length === 0) return;
  
    const index = dias.findIndex(d => d.dia === selectedDay);
    if (index < 0) return;
  
    const scroll = () => api.scrollTo(index);
    api.on("init", scroll);
    requestAnimationFrame(scroll);
    return () => {
      api.off("init", scroll);
    };
  }, [api, selectedDay, dias]);
  
  

  if (dias.length === 0) return null;
          

  return (
    <div className="flex justify-center  mb-2">
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
        }}
        className="w-[300px] mx-auto"
      >
        <CarouselContent className="px-4 py-2" ref={carouselRef}>
          {dias.map(({ dia, estado }: EstadoDia) => {
            const date = new Date(2025, 8, dia);
            const dayOfWeek = date.getDay();
            const isSelected = selectedDay === dia;

            return (
              <CarouselItem key={dia} className="basis-auto px-1">
                <div className="flex flex-col items-center min-w-[30px]">
                  <button
                    data-dia={dia}
                    type="button"
                    onClick={() => {onDaySelect(dia); console.log("diaaaa",dia,estado);}}
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