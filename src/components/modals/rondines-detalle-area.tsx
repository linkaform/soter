import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { Building2, Calendar1, ChevronLeft, ChevronRight, Clock, Route } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { Imagen } from "@/lib/update-pass-full";
import DaysCarousel from "../daysCarousel";
import { useCheckById } from "@/hooks/Rondines/useCheckById";

interface ViewRondinesDetalleAreaProps {
  title: string;
  areaSelected:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  diaSelected: number
  rondin:string
  estatus:string
  selectedRondin:any
}

type Incidente = {
    categoria: string;
    subcategoria: string;
    incidente: string;
    accion_tomada: string;
    fecha_hora_incidente: string; 
    evidencias: any[];         
    documentos: any[];         
    comentarios: string;
  };

export const ViewDetalleArea: React.FC<ViewRondinesDetalleAreaProps> = ({
  title,
  areaSelected,
  children,
  setIsSuccess,
  isSuccess,
  diaSelected,
  rondin,
  estatus,
  selectedRondin
}) => {

    console.log("Data", areaSelected, title, estatus)
    const { data:getCheckById} = useCheckById(areaSelected?.estadoDia?.record_id);
    console.log("selectedRondin",selectedRondin)
    console.log("getCheckById",getCheckById)
    const img=[{file_url:"/nouser.svg", file_name:"Imagen"},{file_url:"/nouser.svg", file_name:"Imagen"}]
    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<Incidente>();

    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(diaSelected);
    const [view, setView] = useState<"lista" | "detalle">("lista");
    
    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">

        {view === "lista" && (
          <div>
             <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-2xl text-center font-bold">
                    {getCheckById?.area}
                </DialogTitle>
            </DialogHeader>

            <DaysCarousel
                data={areaSelected}
                selectedDay={diaSeleccionado}
                onDaySelect={setDiaSeleccionado}
            />

            <div className="flex items-center justify-center">
            <Carousel className="w-44">
                <CarouselContent>
                    {getCheckById?.fotos.map((a: Imagen, index: number) => {
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
                                src={ "/mountain.svg"}
                                alt="Imagen"
                                className="w-full h-40 object-cover rounded-lg "
                            />
                            )}
                        </div>
                        </CarouselItem>
                    );
                    })}
                    </CarouselContent>
            
                    {getCheckById?.fotos.length > 1 ? (
                        <>
                        <CarouselPrevious type="button" />
                        <CarouselNext type="button" />
                        </>
                    ) : null}
                </Carousel>
            </div>

            <div className="flex flex-col gap-y-3">
                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Route /></div>
                    <div className="flex flex-col"> 
                        <p>Rondin</p>
                        <p className="text-gray-400">{selectedRondin?.titulo}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Calendar1/> </div>
                    <div className="flex flex-col"> 
                        <p>Fecha y hora de inspección</p>
                        <p className="text-gray-400">{getCheckById?.hora_de_check}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Building2/> </div>
                    <div className="flex flex-col"> 
                        <p>Ubicación</p>
                        <p className="text-gray-400">{getCheckById?.ubicacion || "Ubicación demo" }</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"> <Clock/> </div>
                    <div className="flex flex-col"> 
                        <p>Tiempo</p>
                        <p className="text-gray-400">{getCheckById?.tiempo_translado}</p>
                    </div>
                </div>
{/* 
                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Bus /> </div>
                    <div className="flex flex-col"> 
                        <p>Translado</p>
                        <p className="text-gray-400">{"Demo"}</p>
                    </div>
                </div> */}
            </div>
            <div className="flex gap-3 mt-3">
                <div className=""> 
                    <p className="text-base font-semibold">Comentarios</p>
                    <p className="text-gray-400">{getCheckById?.comentarios || "No hay comentarios disponibles."}</p>
                </div>
            </div>

            {estatus=== "incidencias" && 
                <div className="animate-fadeIn mt-3">
                    <h2 className="text-base font-semibold ">Incidentes en recorrido</h2>

                    <div className="divide-y divide-gray-200">
                        {getCheckById?.incidencias.map((i:any) => (
                        <div
                        key={`${i.id}-${Math.random()}`}
                            className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 rounded-md px-1"
                            onClick={() => {
                            setIncidenteSeleccionado(i);
                            setView("detalle");
                            }}
                        >
                            <div>
                            <p className="text-sm font-medium text-gray-800">{i?.incidente}</p>
                            <p className="text-xs text-gray-500">{i?.fecha_hora_incidente}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-500" />
                        </div>
                        ))}
                    </div>
                </div>
            }

          </div>
        )}


        {view === "detalle" && incidenteSeleccionado && (
             <>
             <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-2xl text-center font-bold">
                    {incidenteSeleccionado?.incidente}
                </DialogTitle>
            </DialogHeader>
            <div className="animate-fadeIn">
                <div className="flex items-center mb-3">
                    <button
                        onClick={() => setView("lista")}
                        className="text-black hover:text-black mr-2"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-base font-semibold">Detalle del incidente</h2>

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
                                                    src={"/mountain.svg"}
                                                    alt="Imagen"
                                                    className="w-full h-40 object-cover rounded-lg " />
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
                        <div className="bg-slate-200 p-3 rounded"><Route /></div>
                        <div className="flex flex-col">
                            <p>Rondin</p>
                            <p className="text-gray-400">{rondin}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"><Building2 /> </div>
                        <div className="flex flex-col">
                            <p>Ubicación</p>
                            <p className="text-gray-400 ">{getCheckById?.ubicacion}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"> <Clock/> </div>
                        <div className="flex flex-col">
                            <p>Area</p>
                            <p className="text-gray-400">{getCheckById?.area}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"><Calendar1 /> </div>
                        <div className="flex flex-col">
                            <p>Fecha y hora de registro</p>
                            <p className="text-gray-400">{incidenteSeleccionado?.fecha_hora_incidente}</p>
                        </div>
                    </div>
                    

                    
                </div>
                <div className="flex gap-3 mt-3">
                    <div className="">
                        <p className="text-base font-semibold">Comentarios</p>
                        <p className="text-gray-400">{incidenteSeleccionado?.comentarios || "No hay comentarios disponibles" }</p>
                    </div>
                </div>
            </div>
            </>
        )}
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

		 <div className="flex gap-1 my-2 col-span-2">
          	<DialogClose asChild>
            <Button className="w-full bg-gray-200 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          	</DialogClose>
        </div>

        </DialogContent>
    </Dialog>
  );
};
