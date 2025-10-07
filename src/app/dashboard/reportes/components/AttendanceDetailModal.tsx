import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAttendanceDetail } from "../hooks/useAsistenciasReport";
import ImagePreviewModal from "./ImagePreviewModal";

const statusColors: Record<string, string> = {
    presente: "bg-green-500 text-white",
    retardo: "bg-blue-400 text-white",
    falta: "bg-red-500 text-white",
    falta_por_retardo: "bg-yellow-500 text-white",
    dia_libre: "bg-gray-300 text-gray-600",
    sin_registro: "bg-gray-100 text-gray-400",
};

const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

interface AttendanceDetailModalProps {
    open: boolean;
    onClose: () => void;
    names: string[];
    selectedDay: number;
    ubicacion: string;
}

const AttendanceDetailModal: React.FC<AttendanceDetailModalProps> = ({
    open,
    onClose,
    names,
    selectedDay,
    ubicacion,
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState<number>(selectedDay);
    const { attendanceDetail, isLoadingAttendanceDetail, errorAttendanceDetail } = useAttendanceDetail({
        enabled: open,
        names,
        selectedDay: currentDay,
        location: ubicacion,
    });
    const images = [
        {
            src: attendanceDetail?.guardia_generales?.foto_inicio_turno?.[0]?.file_url,
            alt: "Foto inicio de turno",
            order: 1,
        },
        {
            src: attendanceDetail?.guardia_generales?.foto_cierre_turno?.[0]?.file_url,
            alt: "Foto cierre de turno",
            order: 2,
        },
    ];
    
    const statusTurn = attendanceDetail?.guardia_generales?.status_turn || "sin_registro";
    const tagColor = statusColors[statusTurn] || statusColors["sin_registro"];

    const handleCircleClick = (dia: number) => {
        setCurrentDay(dia);
    };

    useEffect(() => {
        if (open) setCurrentDay(selectedDay);
    }, [open, selectedDay]);

    return (
        <Dialog open={open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
            <DialogContent className="max-w-xl">
                {isLoadingAttendanceDetail ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl">🧑‍✈️</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">{names[0] ?? "Nombre no disponible"}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            {attendanceDetail?.guardia_generales?.tipo_guardia
                                                ?.replace(/_/g, " ")
                                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Guardia Regular"
                                            } • {attendanceDetail?.guardia_generales?.incidente_location}
                                        </div>
                                        <div className="text-xs text-gray-700 mt-1">
                                            Estado laboral: <span className="font-semibold text-green-600">● Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex items-center justify-center h-64">
                            <span className="text-gray-500">Cargando detalles de asistencia...</span>
                        </div>
                    </>
                ) : errorAttendanceDetail ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl">🧑‍✈️</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">{names[0] ?? "Nombre no disponible"}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            {attendanceDetail?.guardia_generales?.tipo_guardia
                                                ?.replace(/_/g, " ")
                                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Guardia Regular"
                                            } • {attendanceDetail?.guardia_generales?.incidente_location}
                                        </div>
                                        <div className="text-xs text-gray-700 mt-1">
                                            Estado laboral: <span className="font-semibold text-green-600">● Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center justify-center h-64">
                            <span className="text-red-500">Error al cargar los detalles de asistencia.</span>
                        </div>
                    </>
                ) : Object.keys(attendanceDetail?.guardia_generales || {}).length === 0 ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl">🧑‍✈️</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">{names[0] ?? "Nombre no disponible"}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            {attendanceDetail?.guardia_generales?.tipo_guardia
                                                ?.replace(/_/g, " ")
                                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Guardia Regular"
                                            } • {attendanceDetail?.guardia_generales?.incidente_location}
                                        </div>
                                        <div className="text-xs text-gray-700 mt-1">
                                            Estado laboral: <span className="font-semibold text-green-600">● Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        {/* Días de asistencia en carrousel */}
                        <div className="flex justify-center mt-4 mb-2">
                            <Carousel
                                opts={{
                                    align: "start",
                                    slidesToScroll: 5,
                                }}
                                className="w-full max-w-[420px] mx-auto"
                            >
                                <CarouselContent className="px-6 py-2">
                                    {attendanceDetail?.asistencia_mes?.map(({ status, dia }: { status: string; dia: number }) => {
                                        const date = new Date(2025, 8, dia);
                                        const dayOfWeek = date.getDay();
                                        return (
                                            <CarouselItem key={dia} className="basis-auto px-1">
                                                <div className="flex flex-col items-center min-w-[30px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCircleClick(dia)}
                                                        className={`flex items-center justify-center rounded-full h-8 w-8 font-bold text-xs 
                                                            ${statusColors[status] || statusColors["sin_registro"]} border border-white shadow 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-400
                                                            ${currentDay === dia ? "ring-2 ring-blue-500 border-blue-500" : ""}
                                                        `}
                                                        title={status}
                                                    >
                                                        {dia}
                                                    </button>
                                                    <span className="text-[11px] text-gray-500">{dayNames[dayOfWeek]}</span>
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        <div className="flex items-center justify-center h-64">
                            <span className="text-gray-400">No hay detalles de asistencia disponibles.</span>
                        </div>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        <span className="text-3xl">🧑‍✈️</span>
                                    </div>
                                    <div>
                                        <div className="text-lg font-semibold">{names[0] ?? "Nombre no disponible"}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                            {attendanceDetail?.guardia_generales?.tipo_guardia
                                                ?.replace(/_/g, " ")
                                                .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Tipo no disponible"
                                            } • {attendanceDetail?.guardia_generales?.incidente_location}
                                        </div>
                                        <div className="text-xs text-gray-700 mt-1">
                                            Estado laboral: <span className="font-semibold text-green-600">● Activo</span>
                                        </div>
                                    </div>
                                </div>
                            </DialogTitle>
                        </DialogHeader>
                        {/* Días de asistencia en carrousel */}
                        <div className="flex justify-center mt-4 mb-2">
                            <Carousel
                                opts={{
                                    align: "start",
                                    slidesToScroll: 5,
                                }}
                                className="w-full max-w-[420px] mx-auto"
                            >
                                <CarouselContent className="px-6 py-2">
                                    {attendanceDetail?.asistencia_mes?.map(({ status, dia }: { status: string; dia: number }) => {
                                        const date = new Date(2025, 8, dia);
                                        const dayOfWeek = date.getDay();
                                        return (
                                            <CarouselItem key={dia} className="basis-auto px-1">
                                                <div className="flex flex-col items-center min-w-[30px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCircleClick(dia)}
                                                        className={`flex items-center justify-center rounded-full h-8 w-8 font-bold text-xs 
                                                            ${statusColors[status] || statusColors["sin_registro"]} border border-white shadow 
                                                            focus:outline-none focus:ring-2 focus:ring-blue-400
                                                            ${currentDay === dia ? "ring-2 ring-blue-500 border-blue-500" : ""}
                                                        `}
                                                        title={status}
                                                    >
                                                        {dia}
                                                    </button>
                                                    <span className="text-[11px] text-gray-500">{dayNames[dayOfWeek]}</span>
                                                </div>
                                            </CarouselItem>
                                        );
                                    })}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                        {/* Tabs */}
                        <Tabs defaultValue="generales" className="w-full mt-4">
                            <TabsList className="w-full flex">
                                <TabsTrigger value="generales" className="flex-1">Generales</TabsTrigger>
                                <TabsTrigger value="actividades" className="flex-1">Actividades</TabsTrigger>
                            </TabsList>
                            <TabsContent value="generales">
                                <ScrollArea className="h-[460px] pr-2">

                                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <div className="text-gray-500 text-sm font-medium mb-1">Detalle del turno:</div>
                                                <div className="text-lg font-bold mb-2">{attendanceDetail?.guardia_generales?.fecha_inicio_turno}</div>
                                                <div className="text-sm mb-1">
                                                    <span className="text-gray-500">Turno:</span>
                                                    <span className="font-semibold ml-1">{attendanceDetail?.guardia_generales?.nombre_horario}: {attendanceDetail?.guardia_generales?.hora_entrada?.slice(0, 5)} - {attendanceDetail?.guardia_generales?.hora_salida?.slice(0, 5)} hrs</span>
                                                </div>
                                                <div className="text-sm mb-1">
                                                    <span className="text-gray-500">Caseta:</span>
                                                    <span className="font-semibold ml-1">{attendanceDetail?.guardia_generales?.incidente_area}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Inicio:</span>
                                                    <span className="font-semibold ml-1">
                                                        {attendanceDetail?.guardia_generales?.fecha_inicio_turno
                                                            ? attendanceDetail.guardia_generales.fecha_inicio_turno.slice(11, 16)
                                                            : ""}
                                                    </span>
                                                    <span className="text-gray-500 ml-4">Cierre:</span>
                                                    <span className="font-semibold ml-1">
                                                        {attendanceDetail?.guardia_generales?.fecha_inicio_turno
                                                            ? attendanceDetail.guardia_generales?.fecha_cierre_turno?.slice(11, 16)
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-200">
                                                    {attendanceDetail?.guardia_generales?.foto_inicio_turno?.[0] ? (
                                                        <>
                                                            <Image
                                                                src={attendanceDetail.guardia_generales.foto_inicio_turno[0]?.file_url}
                                                                alt="Guardia inicio"
                                                                width={96}
                                                                height={64}
                                                                className="cursor-pointer"
                                                                onClick={()=>{
                                                                    setModalOpen(true);
                                                                }}
                                                            />
                                                            <ImagePreviewModal
                                                                open={modalOpen}
                                                                onClose={() => setModalOpen(false)}
                                                                images={images}
                                                            />
                                                        </>
                                                    ) : (
                                                        <Image
                                                            src="https://f001.backblazeb2.com/file/app-linkaform/public-client-126/68600/6076166dfd84fa7ea446b917/2025-09-17T15:12:50.png"
                                                            alt="Guardia inicio"
                                                            width={96}
                                                            height={64}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-200">
                                                    {attendanceDetail?.guardia_generales?.foto_cierre_turno?.[0] ? (
                                                        <>
                                                            <Image
                                                                src={attendanceDetail.guardia_generales.foto_cierre_turno[0]?.file_url}
                                                                alt="Guardia cierre"
                                                                width={96}
                                                                height={64}
                                                                className="cursor-pointer"
                                                                onClick={()=>{
                                                                    setModalOpen(true);
                                                                }}
                                                            />
                                                            <ImagePreviewModal
                                                                open={modalOpen}
                                                                onClose={() => setModalOpen(false)}
                                                                images={images}
                                                            />
                                                        </>
                                                    ) : (
                                                        <Image
                                                            src="https://f001.backblazeb2.com/file/app-linkaform/public-client-126/68600/6076166dfd84fa7ea446b917/2025-09-17T15:12:50.png"
                                                            alt="Guardia cierre"
                                                            width={96}
                                                            height={64}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                            <div className="mt-3">
                                                <span className={`inline-block ${tagColor} text-xs font-semibold px-3 py-1 rounded-lg`}>
                                                  {statusTurn.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Sin registro"}
                                                </span>
                                            </div>
                                        <div className="mt-4">
                                            <div className="mb-2">
                                                <div className="text-xs text-gray-500 mb-1">Comentarios inicio</div>
                                                {attendanceDetail?.guardia_generales?.comentario_inicio_turno ? (
                                                    <div className="bg-white rounded-lg border p-3 text-sm text-gray-700">
                                                        {attendanceDetail.guardia_generales.comentario_inicio_turno}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-100 rounded-lg border p-3 text-sm text-gray-400 italic">
                                                        Sin comentarios
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 mb-1">Comentarios cierre</div>
                                                {attendanceDetail?.guardia_generales?.comentario_cierre_turno ? (
                                                    <div className="bg-white rounded-lg border p-3 text-sm text-gray-700">
                                                        {attendanceDetail.guardia_generales.comentario_cierre_turno}
                                                    </div>
                                                ) : (
                                                    <div className="bg-gray-100 rounded-lg border p-3 text-sm text-gray-400 italic">
                                                        Sin comentarios
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Indicadores de septiembre */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-gray-500 text-sm font-medium mb-3">
                                            Indicadores: <span className="text-gray-700 font-semibold">{new Date().toLocaleString("es-MX", { month: "long" }).charAt(0).toUpperCase() +
                                                new Date().toLocaleString("es-MX", { month: "long" }).slice(1)}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="border rounded-lg p-3 flex items-center gap-3">
                                                <span className="text-green-500 text-2xl">✔️</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-800">{attendanceDetail?.indicadores_generales?.porcentaje_asistencias || 0}%</div>
                                                    <div className="text-xs text-gray-500">Asistencias</div>
                                                </div>
                                            </div>
                                            <div className="border rounded-lg p-3 flex items-center gap-3">
                                                <span className="text-yellow-500 text-2xl">⏰</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-800">{attendanceDetail?.indicadores_generales?.retardos || 0}%</div>
                                                    <div className="text-xs text-gray-500">Retardos</div>
                                                </div>
                                            </div>
                                            <div className="border rounded-lg p-3 flex items-center gap-3">
                                                <span className="text-red-500 text-2xl">❌</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-800">{attendanceDetail?.indicadores_generales?.faltas || 0}</div>
                                                    <div className="text-xs text-gray-500">Faltas</div>
                                                </div>
                                            </div>
                                            <div className="border rounded-lg p-3 flex items-center gap-3">
                                                <span className="text-gray-400 text-2xl">🔨</span>
                                                <div>
                                                    <div className="font-bold text-lg text-gray-800">{attendanceDetail?.indicadores_generales?.horas_trabajadas || ""}</div>
                                                    <div className="text-xs text-gray-500">Horas trabajadas</div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="mt-4 text-sm text-gray-500">
                                            Promedio puntualidad: <span className="font-bold text-gray-700">3 min</span>
                                        </div> */}
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                            <TabsContent value="actividades">
                                <div className="relative">
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-0 rounded-xl">
                                        <span className="text-lg font-bold text-gray-700 mb-2">🚧 Work in progress</span>
                                        <span className="text-sm text-gray-500">Esta sección estará disponible pronto.</span>
                                    </div>
                                    <ScrollArea className="h-[460px] pr-2">
                                        {/* Indicadores */}
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                            <div className="text-gray-500 text-sm font-medium mb-3">
                                                Indicadores: <span className="text-gray-700 font-semibold">{new Date().toLocaleString("es-MX", { month: "long" }).charAt(0).toUpperCase() +
                                                    new Date().toLocaleString("es-MX", { month: "long" }).slice(1)}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-4 mb-4">
                                                <div className="border rounded-lg p-3 flex items-center gap-3">
                                                    <span className="text-green-500 text-2xl">🛂</span>
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-800">953</div>
                                                        <div className="text-xs text-gray-500">Accesos autorizados</div>
                                                    </div>
                                                </div>
                                                <div className="border rounded-lg p-3 flex items-center gap-3">
                                                    <span className="text-blue-500 text-2xl">🛡️</span>
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-800">49</div>
                                                        <div className="text-xs text-gray-500">Rondines realizados</div>
                                                    </div>
                                                </div>
                                                <div className="border rounded-lg p-3 flex items-center gap-3">
                                                    <span className="text-yellow-500 text-2xl">⚠️</span>
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-800">232</div>
                                                        <div className="text-xs text-gray-500">Incidencias reportadas</div>
                                                    </div>
                                                </div>
                                                <div className="border rounded-lg p-3 flex items-center gap-3">
                                                    <span className="text-red-500 text-2xl">❗</span>
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-800">141</div>
                                                        <div className="text-xs text-gray-500">Fallas reportadas</div>
                                                    </div>
                                                </div>
                                                <div className="border rounded-lg p-3 flex items-center gap-3">
                                                    <span className="text-pink-500 text-2xl">👜</span>
                                                    <div>
                                                        <div className="font-bold text-lg text-gray-800">135</div>
                                                        <div className="text-xs text-gray-500">Objetos reportados</div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Últimas actividades */}
                                            <div className="mt-6">
                                                <div className="text-gray-700 font-semibold mb-3 text-base">Últimas actividades</div>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-green-500 text-xl mt-1">🛂</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800">Acceso autorizado</div>
                                                            <div className="text-xs text-gray-500">Roberto Gómez López - visita general</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 whitespace-nowrap mt-1">2025-09-10&nbsp;09:24:55</div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-blue-500 text-xl mt-1">🛡️</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800">Rondin completado</div>
                                                            <div className="text-xs text-gray-500">Recorrido completo en estacionamiento subterráneo.</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 whitespace-nowrap mt-1">2025-09-09&nbsp;21:10:12</div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-yellow-500 text-xl mt-1">⚠️</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800">Falla reportada</div>
                                                            <div className="text-xs text-gray-500">Luz de la caseta no enciende.</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 whitespace-nowrap mt-1">2025-09-09&nbsp;18:00:23</div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-red-500 text-xl mt-1">❗</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800">Incidencia registrada</div>
                                                            <div className="text-xs text-gray-500">Reporte por puerta dañada en acceso norte.</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 whitespace-nowrap mt-1">2025-09-08&nbsp;17:45:47</div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <span className="text-pink-500 text-xl mt-1">👜</span>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-gray-800">Objeto perdido</div>
                                                            <div className="text-xs text-gray-500">Se encontró cartera negra en pasillo central.</div>
                                                        </div>
                                                        <div className="text-xs text-gray-400 whitespace-nowrap mt-1">2025-09-08&nbsp;10:15:45</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}
                <DialogClose asChild>
                    <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={onClose}
                        type="button"
                    >
                        Cerrar
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default AttendanceDetailModal;