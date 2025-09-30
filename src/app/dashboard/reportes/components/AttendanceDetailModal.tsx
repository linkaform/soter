import React from "react";
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

const statusColors: Record<string, string> = {
    asistencia: "bg-green-500 text-white",
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
    const { attendanceDetail, isLoadingAttendanceDetail, errorAttendanceDetail } = useAttendanceDetail({
        enabled: open,
        names,
        selectedDay,
        location: ubicacion,
    });

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
                        <div className="flex items-center justify-center h-64">
                            <span className="text-red-500">Error al cargar los detalles de asistencia.</span>
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
                                <CarouselContent className="px-6">
                                    {attendanceDetail?.asistencia_mes?.map(({ status, dia }: { status: string; dia: number }) => {
                                        const date = new Date(2025, 8, dia);
                                        const dayOfWeek = date.getDay();
                                        return (
                                            <CarouselItem key={dia} className="basis-auto px-1">
                                                <div className="flex flex-col items-center min-w-[30px]">
                                                    <span
                                                        className={`flex items-center justify-center rounded-full h-8 w-8 font-bold text-xs ${statusColors[status] || statusColors["sin_registro"]} border border-white shadow`}
                                                        title={status}
                                                    >
                                                        {dia}
                                                    </span>
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
                                                            ? attendanceDetail.guardia_generales.fecha_cierre_turno.slice(11, 16)
                                                            : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                                                    {attendanceDetail?.guardia_generales?.foto_inicio_turno?.[0] ? (
                                                        <Image
                                                            src={attendanceDetail.guardia_generales.foto_inicio_turno[0]?.file_url}
                                                            alt="Guardia inicio"
                                                            width={96}
                                                            height={64}
                                                        />
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
                                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                                                    {attendanceDetail?.guardia_generales?.foto_cierre_turno?.[0] ? (
                                                        <Image
                                                            src={attendanceDetail.guardia_generales.foto_cierre_turno[0]?.file_url}
                                                            alt="Guardia cierre"
                                                            width={96}
                                                            height={64}
                                                        />
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
                                            <div>
                                                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-lg">
                                                    {attendanceDetail?.guardia_generales?.status_turn?.replace(/_/g, " ")
                                                        .replace(/\b\w/g, (l: string) => l.toUpperCase()) || "Sin registro"}
                                                </span>
                                            </div>
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
                                    <div className="bg-white rounded-xl p-4">
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
                                <div className="p-4 text-sm text-gray-700">
                                    Actividades de prueba...
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