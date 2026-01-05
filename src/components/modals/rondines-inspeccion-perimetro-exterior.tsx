"use client";

import { Button } from "../ui/button";
import { capitalizeFirstLetter } from "@/lib/utils";
import {useState } from "react";
import { AlarmClock, Building2, Calendar, Calendar1, ChevronLeft, ChevronRight, Clock, FileDown, Loader2, Repeat2, Route, Tag } from "lucide-react";
import { Badge } from "../ui/badge";
import DaysCarousel from "../daysCarousel";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Imagen } from "@/lib/update-pass";
import Image from "next/image";
import { useBitacoraById } from "@/hooks/Rondines/useBitacoraById";

interface ViewRondinesDetalleAreaProps {
    areaSelected: any
    diaSelected: number
    selectedRondin: any
    activeIndex: number
    estatus:string
}
// interface Incidente {
//     id: number;
//     folio: string;
//     incidencia: string;
//     descripcion: string;
//     accion: string;
//     evidencia: string;
//     fecha: string;
//   }


export const ViewRondinesDetallePerimetroExt: React.FC<ViewRondinesDetalleAreaProps> = ({
    diaSelected,
    selectedRondin,
    areaSelected,
}) => {
    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState<any | null>(null);
    const [view, setView] = useState<"lista" | "detalle">("lista");
    const [diaSeleccionado, setDiaSeleccionado] = useState<number>(diaSelected || 0);
    
    const recordId = selectedRondin?.resumen?.find(
        (item: { dia: number }) => item.dia === diaSeleccionado
      )?.record_id;
      
      const estatus = selectedRondin?.resumen?.find(
        (item: { dia: number }) => item.dia === diaSeleccionado
      )?.estado;

      const { data: getBitacoraById, isLoadingRondin:isLoadingBitacoraById } =
        useBitacoraById(recordId ?? "");

    return (

        <div className=" overflow-y-auto  h-[550px]">
            {view === "lista" && (
                <>
                    <div className="flex-shrink-0">
                        <div className="text-2xl text-center font-bold">
                            {selectedRondin?.titulo} 
                        </div>
                    </div>

                    <DaysCarousel
                        resumen={selectedRondin?.resumen}
                        selectedDay={diaSeleccionado}
                        onDaySelect={setDiaSeleccionado}
                    />

                    {!isLoadingBitacoraById ? (
                        <>
                            {(!getBitacoraById || Object.keys(getBitacoraById).length === 0) ? (
                                <div className="flex flex-col items-center justify-between overflow-hidden">
                                    <div className="text-center text-xl mt-3 font-bold">
                                        Rondin no inspeccionado.
                                    </div>
                                    <small className="text-gray-500 italic mt-1 mb-3">
                                        Una vez inspeccionado, el detalle aparecerá aquí.
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
                                    <div className="flex flex-col gap-y-3">
                                        {/* Información general */}
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><Calendar /></div>
                                            <div className="flex flex-col">
                                                <p>Fecha y hora programada</p>
                                                <p className="text-gray-500 text-sm">{getBitacoraById?.fecha_hora_programada || "No disponible"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><Calendar /></div>
                                            <div className="flex flex-col">
                                                <p>Fecha inicio</p>
                                                <p className="text-gray-500 text-sm">{getBitacoraById?.fecha_inicio || "No disponible"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><Calendar /></div>
                                            <div className="flex flex-col">
                                                <p>Fecha fin</p>
                                                <p className="text-gray-500 text-sm">{getBitacoraById?.fecha_fin || "No disponible"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><AlarmClock /></div>
                                            <div className="flex flex-col">
                                                <p>Duración</p>
                                                <p className="text-gray-500 text-sm">{getBitacoraById?.duracion || "No disponible"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><Tag /></div>
                                            <div className="flex flex-col">
                                                <p>Estatus</p>
                                                <div>
                                                    <Badge
                                                      className={`text-white text-sm ${
                                                        estatus === "finalizado" ||
                                                        estatus === "realizado"
                                                          ? "bg-green-600 hover:bg-green-600"
                                                          : estatus === "cerrado"
                                                          ? "bg-gray-600 hover:bg-gray-600"
                                                          : estatus === "programado"
                                                          ? "bg-purple-600 hover:bg-purple-600"
                                                          : estatus === "en_proceso"
                                                          ? "bg-blue-600 hover:bg-blue-600"
                                                            : estatus === "incidencias"
                                                          ? "bg-red-600 hover:bg-red-600"
                                                             : estatus === "fuera_de_hora"
                                                          ? "bg-pink-600 hover:bg-pink-600"
                                                              : estatus === "no_inspeccionada"
                                                          ? "bg-yellow-600 hover:bg-yellow-600"
                                                             : estatus === "no_aplica"
                                                          ? "bg-gray-400 hover:bg-gray-400"
                                                          : estatus === "cancelado"
                                                          ? "bg-gray-400 hover:bg-gray-400"
                                                          : "bg-gray-400 hover:bg-gray-400"
                                                      }`}
                                                    >
                                                        {capitalizeFirstLetter(estatus).replace(/_/g, " ")}  
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="bg-slate-200 p-3 rounded"><Repeat2 /></div>
                                            <div className="flex flex-col">
                                                <p>Recurrencia</p>
                                                <p className="text-gray-400 text-sm">{getBitacoraById?.recurrencia || "No disponible"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white"
                                            disabled={false}
                                            onClick={() => { }}
                                        >
                                            {false ? (
                                                <>
                                                    <Loader2 className="animate-spin" /> {"Descargando Reporte..."}
                                                </>
                                            ) : (
                                                <>
                                                    <FileDown /> Descargar Reporte
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <p className="font-bold">Áreas a inspeccionar</p>
                                    <div>
                                        <ul>
                                            {(getBitacoraById?.areas_a_inspeccionar ?? []).map((area: any, index: number) => (
                                                <li className="py-2" key={index}>
                                                    <div className="flex gap-3">
                                                        <div className="w-1 h-12 bg-blue-500"></div>
                                                        <div>
                                                            <p>{area?.rondin_area}</p>
                                                            <p className="text-gray-400">{"Fecha no disponible"}</p>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="animate-fadeIn mt-3">
                                        <h2 className="text-base font-semibold">Incidentes en recorrido</h2>

                                        <div className="divide-y divide-gray-200">
                                        {getBitacoraById?.incidencias?.length > 0 ? (
                                        getBitacoraById.incidencias.map((i: any, index: number) => (
                                            <div
                                            key={i.id ?? index}
                                            className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50 rounded-md px-1"
                                            onClick={() => {
                                                setIncidenteSeleccionado(i);
                                                setView("detalle");
                                            }}
                                            >
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">
                                                {i?.tipo_de_incidencia}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                {i?.fecha_hora_incidente_bitacora}
                                                </p>
                                            </div>
                                            <ChevronRight size={18} className="text-gray-500" />
                                            </div>
                                        ))
                                        ) : (
                                        <p className="text-sm text-gray-400 py-2">
                                            No hay incidencias registradas
                                        </p>
                                        )}

                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col justify-start place-items-center mt-20">
                            <div className="w-16 h-16 border-8 border-t-blue-500 rounded-full animate-spin"></div>
                            <span className="text-gray-500">Cargando información...</span>
                        </div>
                    )}
                </>
            )}

            {view === "detalle" && incidenteSeleccionado && (
                <>
                    <div className="flex-shrink-0">
                        <div className="text-2xl text-center font-bold">
                            {incidenteSeleccionado?.tipo_de_incidencia}
                        </div>
                    </div>
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
                        {incidenteSeleccionado?.incidente_evidencia.length ?
                            <>
                                <div className="flex items-center justify-center">
                                    <Carousel className="w-44">
                                        <CarouselContent>
                                            {incidenteSeleccionado?.incidente_evidencia.map((a: Imagen, index: number) => {
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
                                                                    className="w-full h-40 object-cover rounded-lg " />
                                                            )}
                                                        </div>
                                                    </CarouselItem>
                                                );
                                            })}
                                        </CarouselContent>

                                        {incidenteSeleccionado?.incidente_evidencia.length > 1 ? (
                                            <>
                                                <CarouselPrevious type="button" />
                                                <CarouselNext type="button" />
                                            </>
                                        ) : null}
                                    </Carousel>
                                </div>
                            </>
                            : (
                                <div className="w-full text-center py-8 text-gray-500 text-sm ">
                                    No hay imágenes disponibles.
                                </div>
                            )}


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
                                    <p className="text-gray-500 text-sm">{areaSelected.area.ubicacion || "No dispopnible"}</p>
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
                                    <p className="text-gray-400">{incidenteSeleccionado?.fecha_hora_incidente_bitacora || "No disponible"}</p>
                                </div>
                            </div>



                        </div>
                        <div className="flex gap-3 mt-3">
                            <div className="">
                                <p className="text-base font-semibold">Comentarios</p>
                                <p className="text-gray-400">{incidenteSeleccionado?.comentario_incidente_bitacora}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
