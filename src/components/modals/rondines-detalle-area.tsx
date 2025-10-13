import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { AlarmClock, Calendar, Repeat2, User } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { Imagen } from "@/lib/update-pass-full";

interface ViewRondinesDetalleAreaProps {
  title: string;
  data:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
}

export const ViewDetalleArea: React.FC<ViewRondinesDetalleAreaProps> = ({
  title,
  data,
  children,
  setIsSuccess,
  isSuccess,
}) => {

    console.log(data)
    const img=[{file_url:"/nouser.svg", file_name:"Imagen"},{file_url:"/nouser.svg", file_name:"Imagen"}]
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const añoActual = hoy.getFullYear();
    const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const dias = Array.from({ length: 31 }, (_, i) => {
      const fecha = new Date(añoActual, mesActual, i + 1);
      return {
        numero: i + 1,
        diaSemana: diasSemana[fecha.getDay()],
      };
    });

    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
  
    const scrollLeft = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({ left: -100, behavior: "smooth" });
        }
      };
      
    const scrollRight = () => {
    if (scrollRef.current) {
        scrollRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
    };

    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">

        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full flex items-center">
            <button onClick={scrollLeft} className="z-10 px-2 text-xl font-bold text-gray-600 hover:text-black">
                ‹
            </button>
            {/* Contenedor scrollable */}
            <div
                ref={scrollRef}
                className="flex overflow-x-auto  divide-gray-300 space-x-2 px-2"
            >
                {dias.map((dia, index) => (
                <div
                    key={index}
                    onClick={() => setDiaSeleccionado(dia.numero)}
                    className="w-10 h-14 flex flex-col items-center justify-center cursor-pointer transition hover:bg-gray-100 rounded"
                >
                    {/* NÚMERO del día con círculo azul si está seleccionado */}
                    <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-bold
                        ${diaSeleccionado === dia.numero ? "bg-blue-600" : "bg-transparent text-gray-800"}`}
                    >
                    {dia.numero}
                    </div>

                    {/* Día de la semana */}
                    <div className="text-xs text-gray-600 capitalize mt-1">
                    {dia.diaSemana}
                    </div>
                </div>
                ))}
            </div>

            {/* Flecha derecha */}
            <button
                onClick={scrollRight}
                className="z-10 px-2 text-xl font-bold text-gray-600 hover:text-black"
            >
                ›
            </button>
            </div>

        <div className="flex items-center justify-center">
        <Carousel className="w-44">
            <CarouselContent>
                {img.map((a: Imagen, index: number) => {
                const isVideo = a.file_url?.match(/\.(mp4|webm|ogg|mov|avi)$/i);

                return (
                    <CarouselItem key={index}>
                    <div className="p-1 relative">
                        {isVideo ? (
                        <video
                            controls
                            className="w-full h-40 object-cover rounded-lg"
                        >
                            <source src={a.file_url} type="video/mp4" />
                            Tu navegador no soporta la reproducción de video.
                        </video>
                        ) : (
                        <Image
                            height={160}
                            width={160}
                            src={a.file_url || "/nouser.svg"}
                            alt="Imagen"
                            className="w-full h-40 object-cover rounded-lg"
                        />
                        )}
                    </div>
                    </CarouselItem>
                );
                })}
                </CarouselContent>
        
                {img.length > 1 ? (
                    <>
                    <CarouselPrevious type="button" />
                    <CarouselNext type="button" />
                    </>
                ) : null}
            </Carousel>
        </div>

		<div className="flex flex-col gap-y-3">
            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                <div className="flex flex-col"> 
                    <p>Rondin</p>
                    <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                <div className="flex flex-col"> 
                    <p>Ubicación</p>
                    <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"> <User/> </div>
                <div className="flex flex-col"> 
                    <p>Incidente</p>
                    <p className="text-gray-400">Roberto Pérez López</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><AlarmClock /> </div>
                <div className="flex flex-col"> 
                    <p>Duración aproximada</p>
                    <p className="text-gray-400">1:30hrs</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="bg-slate-200 p-3 rounded"><Repeat2/> </div>
                <div className="flex flex-col"> 
                    <p>Fecha y hora de inspección</p>
                    <p className="text-gray-400">Abr 12 2025 12:00pm</p>
                </div>
            </div>
        </div>

        {/* <div className="flex  justify-end">
        <Button
			type="submit"
			className="w-1/2  bg-blue-500 hover:bg-blue-600 text-white " disabled={false} onClick={()=>{}}>
			{false ? (<>
				  <> <Loader2 className="animate-spin" /> {"Descargando Reporte..."} </>
			</>) : (<> <FileDown/> Descargar Reporte</>)}
		</Button>
        </div>

        <p className="font-bold">Áreas a inspeccionar</p>
		<div className="overflow-y-auto">
			<div>
                <ul>
                    {areasInspeccionar.map((area, index) => (
                        <li className="py-2" key={index}>
                           <div className="flex gap-3">
                                <div className="w-1 h-12 bg-blue-500"></div>
                                <div>
                                    <p>{area}</p>
                                    <p className="text-gray-400">6/Abril/2025 12:01:58 hrs</p>
                                </div>
                           </div>
                        </li>
                    ))}
                </ul>
            </div>
		</div> */}

		 <div className="flex gap-1 my-5 col-span-2">
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
