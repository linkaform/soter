import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const defaultEmployee = {
  name: "Juan Pérez",
  position: "Guardia",
  location: "Plaza Las Brisas",
  status: "Activo",
  avatar: "/avatar-guard.png",
  days: [
    { day: 6, label: "Lu", status: "present" },
    { day: 7, label: "Ma", status: "present" },
    { day: 8, label: "Mi", status: "present" },
    { day: 9, label: "Ju", status: "present" },
    { day: 10, label: "Vi", status: "present" },
    { day: 11, label: "Sa", status: "present" },
    { day: 12, label: "Do", status: "present" },
    { day: 13, label: "Lu", status: "present" },
    { day: 14, label: "Ma", status: "present" },
    { day: 15, label: "Mi", status: "present" },
    { day: 16, label: "Ju", status: "present" },
    { day: 17, label: "Vi", status: "absent" },
    { day: 18, label: "Sa", status: "late" },
    { day: 19, label: "Do", status: "present" },
    { day: 20, label: "Lu", status: "present" },
  ],
  shift: {
    date: "2025-09-16",
    name: "T1: 7:00 - 19:00 hrs",
    location: "Puerta caseta seguridad",
    start: "07:00",
    end: "19:00",
    images: [
      "/guard1.jpg",
      "/guard2.jpg"
    ],
    commentsStart: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    commentsEnd: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis."
  },
  indicators: {
    present: 95,
    late: 2,
    absent: 1,
    worked: "160/168",
    avgPunctuality: "3 min"
  }
};

interface EmployeeAttendanceDetailModalProps {
  open: boolean;
  onClose: () => void;
  employee?: typeof defaultEmployee;
  attendanceData?: any; // Datos de asistencia detallados
  shift?: string;
}

const EmployeeAttendanceDetailModal: React.FC<EmployeeAttendanceDetailModalProps> = ({
  open,
  onClose,
  employee = defaultEmployee,
  attendanceData,
  shift
}) => {
  const [activePrincipalTab, setActivePrincipalTab] = useState("principal");

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='max-w-xl' aria-describedby='add-note-description'>
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription id='add-note-description'></DialogDescription>
          </DialogHeader>
          <div className="flex flex-row sm:flex-row items-center sm:items-start gap-4 px-6 pt-6 pb-2">
            <Image
              width={80}
              height={80}
              src={attendanceData?.foto_inicio_turno?.[0]?.file_url || employee.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover object-top border-2 border-gray-200"
            />
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <span className="text-2xl font-semibold">{attendanceData?.user_name || ""}</span>
              </div>
              <div>
                <span className="text-gray-500 text-base">
                  {attendanceData?.tipo_guardia
                    ? attendanceData.tipo_guardia
                        .split("_")
                        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")
                    : ""}
                </span>
                <span className="hidden sm:inline mx-2 text-gray-300">·</span>
                <span className="text-gray-500 text-base">{attendanceData?.incidente_location || ""}</span>
              </div>
              <div className="mt-1 text-gray-400 text-base">
                Estado laboral:{" "}
                <span className="inline-flex items-center gap-1 font-semibold text-green-700">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  Activo
                </span>
              </div>
            </div>
          </div>
          <Tabs
            value={activePrincipalTab}
            onValueChange={setActivePrincipalTab}
            defaultValue="principal"
          >
            <TabsList>
              <TabsTrigger value="generales">Generales</TabsTrigger>
              <TabsTrigger value="actividades">Actividades</TabsTrigger>
            </TabsList>
            <TabsContent value="generales">
              <div className="px-6 pt-4 pb-2 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                    <div className="text-gray-500 text-base mb-1 md:mb-0">
                    Detalle del turno:{" "}
                    <span className="font-semibold text-gray-700">
                      {attendanceData?.fecha_inicio_turno
                      ? attendanceData.fecha_inicio_turno.split(" ")[0]
                      : ""}
                    </span>
                    </div>
                  <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-md">
                    Asistencia a tiempo
                  </span>
                </div>
                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col gap-x-4 gap-y-1 mb-2">
                      <div>
                        <span className="text-gray-700 font-medium">Turno: </span>
                        <span className="text-gray-600 font-semibold">{shift}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 font-medium">Caseta: </span>
                        <span className="text-gray-600 font-semibold">{attendanceData?.incidente_area || ""}</span>
                      </div>
                      <div>
                        <span className="text-gray-700 font-medium">Inicio: </span>
                        <span className="text-gray-600 font-semibold">{attendanceData?.fecha_inicio_turno?.split(" ")[1]}</span>
                        <span className="text-gray-600 font-light"> | </span>
                        <span className="text-gray-700 font-medium">Cierre: </span>
                        <span className="text-gray-600 font-semibold">{attendanceData?.fecha_cierre_turno?.split(" ")[1]}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-2">
                      {attendanceData?.foto_inicio_turno?.[0]?.file_url && (
                        <Image
                          src={attendanceData.foto_inicio_turno[0].file_url}
                          alt="Foto inicio turno"
                          width={90}
                          height={60}
                          className="rounded-md object-cover border w-[90px] h-[60px]"
                        />
                      )}
                      {attendanceData?.foto_cierre_turno?.[0]?.file_url && (
                        <Image
                          src={attendanceData.foto_cierre_turno?.[0]?.file_url}
                          alt="Foto cierre turno"
                          width={90}
                          height={60}
                          className="rounded-md object-cover border w-[90px] h-[60px]"
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Comentarios inicio</div>
                    <div className="border rounded p-2 text-sm bg-white">{attendanceData?.comentario_inicio_turno || "Sin comentarios"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Comentarios cierre</div>
                    <div className="border rounded p-2 text-sm bg-white">{attendanceData?.comentario_cierre_turno || "Sin comentarios"}</div>
                  </div>
                </div>
              </div>
              <div className="px-6 pt-4 pb-6 w-full">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-gray-500 text-base mb-3">
                    Indicadores: <span className="font-semibold text-gray-700">Septiembre</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <div>
                        <div className="text-lg font-bold text-gray-800">{employee.indicators.present}%</div>
                        <div className="text-sm text-gray-500">Asistencias</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <Clock className="w-6 h-6 text-yellow-500" />
                      <div>
                        <div className="text-lg font-bold text-gray-800">{employee.indicators.late}</div>
                        <div className="text-sm text-gray-500">Retardos</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <XCircle className="w-6 h-6 text-red-500" />
                      <div>
                        <div className="text-lg font-bold text-gray-800">{employee.indicators.absent}</div>
                        <div className="text-sm text-gray-500">Faltas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 13V7a5 5 0 00-10 0v6M5 19h14M12 17v2" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">{employee.indicators.worked}</div>
                        <div className="text-sm text-gray-500">Horas trabajadas</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-base text-gray-500">
                    Promedio puntualidad: <span className="font-semibold text-gray-700">{employee.indicators.avgPunctuality}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="actividades">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-gray-500 text-base mb-3">
                    Indicadores: <span className="font-semibold text-gray-700">Septiembre</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-100">
                        {/* Icono acceso */}
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">953</div>
                        <div className="text-sm text-gray-500">Accesos autorizados</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100">
                        {/* Icono rondín */}
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">49</div>
                        <div className="text-sm text-gray-500">Rondines realizados</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-yellow-100">
                        {/* Icono incidencia */}
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">232</div>
                        <div className="text-sm text-gray-500">Incidencias reportadas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100">
                        {/* Icono falla */}
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.415 1.415M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">141</div>
                        <div className="text-sm text-gray-500">Fallas reportadas</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border rounded-lg bg-white p-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-pink-100">
                        {/* Icono objeto */}
                        <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="16" height="16" x="4" y="4" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" /></svg>
                      </span>
                      <div>
                        <div className="text-lg font-bold text-gray-800">135</div>
                        <div className="text-sm text-gray-500">Objetos reportados</div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Últimas actividades */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-base font-semibold text-gray-700 mb-4">Últimas actividades</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                            {/* Icono acceso */}
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" d="M17 16v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2" /></svg>
                          </span>
                          <span className="font-semibold text-gray-700">Acceso autorizado</span>
                        </div>
                        <div className="text-sm text-gray-500">Roberto Gómez López - visita general</div>
                      </div>
                      <span className="text-xs text-gray-400">2025-09-10&nbsp;&nbsp;09:24:55</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100">
                            {/* Icono rondín */}
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                          </span>
                          <span className="font-semibold text-gray-700">Rondin completado</span>
                        </div>
                        <div className="text-sm text-gray-500">Recorrido completo en estacionamiento subterráneo.</div>
                      </div>
                      <span className="text-xs text-gray-400">2025-09-09&nbsp;&nbsp;21:10:12</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100">
                            {/* Icono falla */}
                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </span>
                          <span className="font-semibold text-gray-700">Falla reportada</span>
                        </div>
                        <div className="text-sm text-gray-500">Luz de la caseta no enciende.</div>
                      </div>
                      <span className="text-xs text-gray-400">2025-09-09&nbsp;&nbsp;18:00:23</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                            {/* Icono incidencia */}
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414M6.343 17.657l-1.415 1.415M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </span>
                          <span className="font-semibold text-gray-700">Incidencia registrada</span>
                        </div>
                        <div className="text-sm text-gray-500">Reporte por puerta dañada en acceso norte.</div>
                      </div>
                      <span className="text-xs text-gray-400">2025-09-08&nbsp;&nbsp;17:45:47</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100">
                            {/* Icono objeto */}
                            <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect width="16" height="16" x="4" y="4" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6v6H9z" /></svg>
                          </span>
                          <span className="font-semibold text-gray-700">Objeto perdido</span>
                        </div>
                        <div className="text-sm text-gray-500">Se encontró cartera negra en pasillo central.</div>
                      </div>
                      <span className="text-xs text-gray-400">2025-09-08&nbsp;&nbsp;10:15:45</span>
                    </div>
                  </div>
              </div>
            </TabsContent>
          </Tabs>

        </DialogContent>
      </Dialog>
    </>
  )
};

export default EmployeeAttendanceDetailModal;