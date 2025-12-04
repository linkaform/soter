"use client";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { Building2, Calendar1, ChevronLeft, ChevronRight, Clock, Loader2, Route } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import Image from "next/image";
import { Imagen } from "@/lib/update-pass-full";
import DaysCarousel from "../daysCarousel";
import { useCheckById } from "@/hooks/Rondines/useCheckById";
import { useCreateIncidenciaRondin } from "@/hooks/Rondines/useCeateIncidenciaRondin";

interface ViewRondinesDetalleAreaProps {
  areaSelected:any
  diaSelected: number
  rondin:string
  estatus:string
  selectedRondin:any
  onClose: ()=>void;
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
  areaSelected,
  diaSelected,
  rondin,
  estatus,
  selectedRondin,
  onClose,
}) => {

    const [checkSelected, setCheckSelected] = useState(areaSelected?.estadoDia?.record_id ||"692719584c99eda82536ef55") //areaSelected?.estadoDia?.record_id
    const { data:getCheckById, isLoadingRondin:isLoadingCheckById} = useCheckById(checkSelected);
    const { createIncidenciaMutation , isLoading} = useCreateIncidenciaRondin();

	function crearNuevaIncidencia(data:any){
        const formatData ={
            reporta_incidencia:"",
            fecha_hora_incidencia: data.fecha_hora_incidente,
            ubicacion_incidencia:data.ubicacion_incidente,
            area_incidencia: data.area_incidente,
            categoria: data.categoria,
            sub_categoria:data.subcategoria,
            incidente:data.incidemte,
            tipo_incidencia: data.incidente,
            comentario_incidencia: data.comentarios,
            evidencia_incidencia: data.evidencias,
            documento_incidencia:data.docuementos,
            acciones_tomadas_incidencia:[],
            prioridad_incidencia: "leve",
            notificacion_incidencia: "no",
        }
        createIncidenciaMutation.mutate(formatData, {
            onSuccess: () => {
                if (onClose) onClose();
            },
          });
    }

    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<Incidente>();

    const [diaSeleccionado, setDiaSeleccionado] = useState<number>(diaSelected ||0);
    const [view, setView] = useState<"lista" | "detalle">("lista");
    

    useEffect(() => {
        if (!getCheckById || !diaSeleccionado) return; 
      
        const estadoFiltrado = getCheckById?.checks_mes?.area?.estados?.find(
          (e: any) => e.dia === diaSeleccionado
        );
        console.log("estadoFiltrado?.record_id", estadoFiltrado?.record_id);
      
        if (estadoFiltrado?.record_id) {
          setCheckSelected(estadoFiltrado.record_id);
        }
      }, [diaSeleccionado, getCheckById]);

    return (
    // <Dialog open={isSuccess} onOpenChange={setIsSuccess} modal>
    //   <DialogTrigger asChild>{children}</DialogTrigger>
    //   <DialogContent className="max-w-md overflow-y-auto max-h-[80vh] min-h-[60vh]  flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
       
                <div className=" overflow-y-auto  h-[550px]">
                {view === "lista" && (
                    <div>
                        <div className="flex-shrink-0">
                            <div className="text-2xl text-center font-bold">
                                {getCheckById?.area || areaSelected?.area?.nombre}
                            </div>
                        </div>
    
                        <DaysCarousel
                            data={areaSelected}
                            selectedDay={diaSeleccionado}
                            onDaySelect={setDiaSeleccionado}
                        />

                        {!isLoadingCheckById ? 
                            <>

                                {(!getCheckById || Object.keys(getCheckById).length === 0) ? (
                                   <div className="flex flex-col items-center justify-between overflow-hidden">
                                   <div className="text-center text-xl mt-3 font-bold">
                                       Área no inspeccionada.
                                   </div>
                               
                                   <small className="text-gray-500 italic mt-1 mb-3">
                                       Una vez inspeccionada, el detalle aparecerá aquí.
                                   </small>
                               
                                   <Image
                                       height={100}
                                       width={400}
                                       src="/area_no_inspeccionada.jpg"
                                       alt="Imagen"
                                       className="object-cover rounded-lg p-0 "
                                   />
                               </div>
                               
                                ) : (
                                    <>

                                        {getCheckById?.fotos?.length > 0 ? (  
                                            <div className="flex items-center justify-center">
                                            <Carousel className="w-44">
                                                <CarouselContent>
                                                        { getCheckById?.fotos.map((a: Imagen, index: number) => {
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
                                                                    src={a.file_url || "/mountain.svg"}
                                                                    alt="Imagen"
                                                                    className="w-full h-40 object-cover rounded-lg"
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
                                                    ) :null}
                                                </Carousel>
                                            </div>
                                        ) : (
                                            <div className="w-full text-center py-8 text-gray-500 text-sm ">
                                                No hay imágenes disponibles.
                                            </div>
                                        )}
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
                                                    <p className="text-gray-400">{getCheckById?.hora_de_check || "No disponible"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="bg-slate-200 p-3 rounded"><Building2/> </div>
                                                <div className="flex flex-col"> 
                                                    <p>Ubicación</p>
                                                    <p className="text-gray-400">{getCheckById?.ubicacion || "No disponible" }</p>
                                                </div>
                                            </div>
            
                                            <div className="flex gap-3">
                                                <div className="bg-slate-200 p-3 rounded"> <Clock/> </div>
                                                <div className="flex flex-col"> 
                                                    <p>Tiempo</p>
                                                    <p className="text-gray-400">{getCheckById?.tiempo_translado || "No disponible"}</p>
                                                </div>
                                            </div>
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
                                                    {getCheckById && getCheckById?.incidencias.map((i:any) => (
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
                                    </>
                                )}
                               
                            </>
                        : 
                        <div>
                            <div className="flex flex-col justify-start place-items-center mt-20">
                                <div className="w-16 h-16 border-8  border-t-blue-500 rounded-full animate-spin"></div>
                                <span className="text-gray-500">
                                    Cargando información...
                                </span>
                            </div>
                        </div>
                    }   
                    </div>
                )}
    
                {view === "detalle" && incidenteSeleccionado && (
                    <>
                    <div className="flex-shrink-0">
                        <div className="text-2xl text-center font-bold">
                            {incidenteSeleccionado?.incidente}
                        </div>
                    </div>
                    <div className="animate-fadeIn mt-2">
                        <div className="flex items-center mb-3">
                            <button
                                onClick={() => setView("lista")}
                                className="text-black hover:text-black mr-2"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <h2 className="text-base font-semibold">Detalle del incidente</h2>
    
                        </div>
                        {incidenteSeleccionado?.evidencias?.length > 0 ? (  
                        <div className="flex items-center justify-center">
                            <Carousel className="w-44">
                                <CarouselContent>
                                {incidenteSeleccionado?.evidencias?.length > 0 ? (
                                    incidenteSeleccionado.evidencias.map((a: Imagen, index: number) => {
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
                                                src={a.file_url || "/mountain.svg"}
                                                alt="Imagen"
                                                className="w-full h-40 object-cover rounded-lg"
                                                />
                                            )}
                                            </div>
                                        </CarouselItem>
                                        );
                                    })
                                    ) : null}
                                </CarouselContent>
                                {incidenteSeleccionado?.evidencias.length > 1 ? (
                                            <>
                                            <CarouselPrevious type="button" />
                                            <CarouselNext type="button" />
                                            </>
                                        ) :
                                       null
                                        }
                            </Carousel>
                        </div>
                        ):(
                            <div className="w-full text-center py-8 text-gray-500 text-sm ">
                                No hay imágenes disponibles.
                            </div>
                        )}
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
    
                    <Button
                    type="submit"
                    className="w-full  bg-yellow-500 hover:bg-yellow-600 text-white " disabled={isLoading} onClick={()=>{crearNuevaIncidencia(incidenteSeleccionado)}}>
                    {isLoading ? (<>
                            <> <Loader2 className="animate-spin" /> {"Generando Incidencia..."} </>
                    </>) : (<> Generar Incidencia</>)}
                    </Button>
                    </>
   
                )}
                </div>
    
  );
};
