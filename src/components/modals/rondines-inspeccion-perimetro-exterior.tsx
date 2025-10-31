import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";
import { AlarmClock, Building2, Calendar, Calendar1, ChevronLeft, ChevronRight, Clock, FileDown, Loader2, Repeat2, Route, Tag } from "lucide-react";
import { Badge } from "../ui/badge";
import DaysCarousel from "../daysCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Imagen } from "@/lib/update-pass";
import Image from "next/image";

interface ViewRondinesDetalleAreaProps {
  title: string;
  areaSelected:any
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  children: React.ReactNode;
  estatus:string
  diaSelected: number
  selectedRondin:any
}
interface Incidente {
    id: number;
    folio: string;
    incidencia: string;
    descripcion: string;
    accion: string;
    evidencia: string;
    fecha: string;
  }
  

export const ViewRondinesDetallePerimetroExt: React.FC<ViewRondinesDetalleAreaProps> = ({
  title,
  children,
  setIsSuccess,
  isSuccess,
  estatus,
  diaSelected,
  selectedRondin,
  areaSelected
//   area
}) => {
    console.log("DIA SELECCIONADO", areaSelected,  title)
    const areasInspeccionar=[
        "Caseta de vigilancia planta 1", "Área de rampa 24", "Cisterna", "Sub estación norte planta 3", "Cajas no enrampadas"
    ]
    const img=[{file_url:"/nouser.svg", file_name:"Imagen"},{file_url:"/nouser.svg", file_name:"Imagen"}]
    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<Incidente | null>(null);
    const incidentes: Incidente[] = [
        {
          id: 1,
          folio: "INC-001",
          incidencia: "Falla energía eléctrica",
          descripcion: "Durante el recorrido se detectó una falla eléctrica en el pasillo principal.",
          accion: "Se reportó al área de mantenimiento para su atención inmediata.",
          evidencia: "Foto subida al sistema con el tablero afectado.",
          fecha: "Abr 04, 2025 12:29:56 hrs",
        },
        {
          id: 2,
          folio: "INC-002",
          incidencia: "Puerta sin cerrar",
          descripcion: "Se encontró una puerta de acceso sin seguro.",
          accion: "Se cerró la puerta y se notificó al personal de seguridad.",
          evidencia: "Imagen de la puerta abierta tomada a las 12:35 hrs.",
          fecha: "Abr 04, 2025 12:36:10 hrs",
        },
        {
          id: 3,
          folio: "INC-003",
          incidencia: "Área sin iluminación",
          descripcion: "El pasillo del segundo piso no tenía iluminación funcional.",
          accion: "Se levantó reporte para revisión de luminarias.",
          evidencia: "Video corto mostrando el área sin luz.",
          fecha: "Abr 04, 2025 12:40:22 hrs",
        },
      ];

    const [view, setView] = useState<"lista" | "detalle">("lista");
    const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(diaSelected);
    return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md overflow-y-auto max-h-[80vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">

       

        {view === "lista" && (
            <>
             <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-2xl text-center font-bold">
                {selectedRondin?.titulo}
            </DialogTitle>
            </DialogHeader>

            <DaysCarousel
                data={{area:areaSelected.area, estadoDia:{dia:diaSelected, estado:estatus}}}
                selectedDay={diaSeleccionado}
                onDaySelect={setDiaSeleccionado}
            />

            <div className="flex flex-col gap-y-3">
                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                    <div className="flex flex-col"> 
                        <p>Fecha y hora programada</p>
                        <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                    <div className="flex flex-col"> 
                        <p>Fecha inicio</p>
                        <p className="text-gray-500 text-sm">Abr 12 2025 12:00pm</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Calendar /> </div>
                    <div className="flex flex-col"> 
                        <p>Fecha fin</p>
                        <p className="text-gray-500 text-sm">Abr 12 2025 12:10pm</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><AlarmClock /> </div>
                    <div className="flex flex-col"> 
                        <p>Duración</p>
                        <p className="text-gray-400">1:30hrs</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Tag /> </div>
                    <div className="flex flex-col"> 
                        <p>Estatus</p>
                        <div>
                        <Badge
                        className={`text-white text-sm ${
                            estatus == "finalizado"
                            ? "bg-green-600"
                            : estatus == "cerrado"
                            ? "bg-gray-600"
                            : estatus == "programado"
                            ? "bg-purple-600"
                            : estatus == "en progreso"
                            ? "bg-blue-600"
                            : estatus == "cancelado"
                            ? "bg-gray-400"
                            : "bg-gray-400"
                        }`}
                        >
                        {capitalizeFirstLetter(estatus)}
                        </Badge>
                    </div>
                    </div>
                </div>

                {/* <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"> <User/> </div>
                    <div className="flex flex-col"> 
                        <p>Asignado</p>
                        <p className="text-gray-400">Roberto Pérez López</p>
                    </div>
                </div> */}


                <div className="flex gap-3">
                    <div className="bg-slate-200 p-3 rounded"><Repeat2/> </div>
                    <div className="flex flex-col"> 
                        <p>Recurrencia</p>
                        <p className="text-gray-400">Abr 12 2025 12:00pm</p>
                    </div>
                </div>
            </div>

            <div className="flex  justify-end">
            <Button
                type="submit"
                className="w-1/2  bg-blue-500 hover:bg-blue-600 text-white " disabled={false} onClick={()=>{}}>
                {false ? (<>
                    <> <Loader2 className="animate-spin" /> {"Descargando Reporte..."} </>
                </>) : (<> <FileDown/> Descargar Reporte</>)}
            </Button>
            </div>

            <p className="font-bold">Áreas a inspeccionar</p>
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

            <div className="animate-fadeIn mt-3">
                <h2 className="text-base font-semibold ">Incidentes en recorrido</h2>

                <div className="divide-y divide-gray-200">
                    {incidentes.map((i) => (
                    <div
                        key={i.id}
                        className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 rounded-md px-1"
                        onClick={() => {
                        setIncidenteSeleccionado(i);
                        setView("detalle");
                        }}
                    >
                        <div>
                        <p className="text-sm font-medium text-gray-800">{i.incidencia}</p>
                        <p className="text-xs text-gray-500">{i.fecha}</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-500" />
                    </div>
                    ))}
                </div>
            </div>

            </>
        )}


        {view === "detalle" && incidenteSeleccionado && (
             <>
             <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-2xl text-center font-bold">
                    {incidenteSeleccionado.incidencia}
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
                            <p className="text-gray-500 text-sm">{selectedRondin?.titulo}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"><Building2 /> </div>
                        <div className="flex flex-col">
                            <p>Ubicación</p>
                            <p className="text-gray-500 text-sm">{areaSelected.area.ubicacion || "Ubicación demo"}</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"> <Clock /> </div>
                        <div className="flex flex-col">
                            <p>Area</p>
                            <p className="text-gray-400">Demo</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-slate-200 p-3 rounded"><Calendar1 /> </div>
                        <div className="flex flex-col">
                            <p>Fecha y hora de registro</p>
                            <p className="text-gray-400">Abr 12 2025 12:00pm</p>
                        </div>
                    </div>
                    

                    
                </div>
                <div className="flex gap-3 mt-3">
                    <div className="">
                        <p className="text-base font-semibold">Comentarios</p>
                        <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </div>
            </div>
            </>
        )}

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
