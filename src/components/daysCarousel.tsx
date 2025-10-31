"use client";

import React, { useEffect, useRef } from "react";
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
  data: {
    area: {
      nombre: string;
      estados: EstadoDia[];
    };
    estadoDia: EstadoDia;
  };
  selectedDay: number | null;
  onDaySelect: (day: number) => void;
}

const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const DaysCarousel: React.FC<DaysCarouselProps> = ({
  data,
  selectedDay,
  onDaySelect,
}) => {
  const { area } = data;
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
          {area.estados.map(({ dia }: EstadoDia) => {
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
                    className={`flex items-center justify-center rounded-full h-8 w-8 font-bold text-xs
                      border border-gray-200 shadow-sm
                      ${
                        isSelected
                          ? "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400"
                          : "bg-gray-100 text-gray-600"
                      }
                      transition-all duration-150 ease-in-out
                      focus:outline-none
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