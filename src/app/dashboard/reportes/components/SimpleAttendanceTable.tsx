import React, { useState, useMemo, useEffect } from "react";
import { CheckCircle, XCircle, Clock, MinusCircle, CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";

type StatusType = "asistencia" | "retardo" | "falta" | "falta_por_retardo" | "dia_libre" | "sin_registro";

const statusConfig: Record<StatusType, { color: string; icon: JSX.Element; label: string }> = {
  asistencia: {
    color: "bg-green-500 text-white",
    icon: <CheckCircle className="w-4 h-4" />,
    label: "Asistencia",
  },
  retardo: {
    color: "bg-blue-400 text-white",
    icon: <Clock className="w-4 h-4" />,
    label: "Retardo",
  },
  falta: {
    color: "bg-red-500 text-white",
    icon: <XCircle className="w-4 h-4" />,
    label: "Falta",
  },
  falta_por_retardo: {
    color: "bg-yellow-500 text-white",
    icon: <XCircle className="w-4 h-4" />,
    label: "Falta por retardo",
  },
  dia_libre: {
    color: "bg-gray-300 text-gray-600",
    icon: <CalendarOff className="w-4 h-4" />,
    label: "Día libre",
  },
  sin_registro: {
    color: "bg-gray-100 text-gray-400",
    icon: <MinusCircle className="w-4 h-4" />,
    label: "Sin registro",
  },
};

interface EmployeeAttendance {
  employee_id: number;
  nombre: string;
  ubicacion: string;
  asistencia_mes: { status: StatusType; dia: number }[];
  resumen: { asistencias: number; retardos: number; faltas: number };
}

interface SimpleAttendanceTableProps {
    data: EmployeeAttendance[];
    daysInMonth: number;
    groupByLocation?: boolean;
    timeframe?: "mes" | "semana";
    month?: number;
    year?: number;
    selectedStatus?: string[]; // <-- agrega esto
}

function getWeeks(daysInMonth: number, month: number, year: number) {
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    week.push(day);
    // Sunday (0) or last day of month
    if (date.getDay() === 0 || day === daysInMonth) {
      weeks.push(week);
      week = [];
    }
  }
  // Completa la última semana a 7 días
  if (weeks.length > 0 && weeks[weeks.length - 1].length < 7) {
    const lastWeek = weeks[weeks.length - 1];
    const missing = 7 - lastWeek.length;
    for (let i = 0; i < missing; i++) {
      lastWeek.push(null); // null para celdas vacías
    }
  }
  return weeks;
}

const statusPriority: Record<StatusType, number> = {
  asistencia: 6,
  retardo: 5,
  dia_libre: 4,
  falta_por_retardo: 3,
  falta: 2,
  sin_registro: 1,
};

export const SimpleAttendanceTable: React.FC<SimpleAttendanceTableProps> = ({
  data,
  daysInMonth,
  groupByLocation = false,
  timeframe = "mes",
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
  selectedStatus = [], // <-- ¡Agrega aquí!
}) => {
  const [search, setSearch] = useState("");
  const [selectedWeek, setSelectedWeek] = useState(0);

  // Filtra empleados por nombre
  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(emp =>
      emp.nombre.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [data, search]);

  // Ejemplo dentro de SimpleAttendanceTable
  const today = new Date();
  const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();
  const currentDay = isCurrentMonth ? today.getDate() : 1;

  // Filtra empleados por status seleccionado en el día actual
  const statusFilteredData = useMemo(() => {
    if (!selectedStatus || selectedStatus.length === 0) return filteredData;
    return filteredData.filter(emp => {
      const dayObj = emp.asistencia_mes.find(d => d.dia === currentDay);
      return (
        (dayObj && selectedStatus.includes(dayObj.status)) ||
        !dayObj ||
        dayObj.status === "sin_registro"
      );
    });
  }, [filteredData, selectedStatus, currentDay]);

  // Agrupa empleados por ubicación si se activa
  const locationMap = useMemo(() => {
    const map = new Map<string, EmployeeAttendance[]>();
    statusFilteredData.forEach(emp => {
      if (!map.has(emp.ubicacion)) map.set(emp.ubicacion, []);
      map.get(emp.ubicacion)!.push(emp);
    });
    return map;
  }, [statusFilteredData]);

  
  const mergedData = useMemo(() => {
    if (groupByLocation) return statusFilteredData;

    const map = new Map<number, EmployeeAttendance>();

    statusFilteredData.forEach(emp => {
      if (!map.has(emp.employee_id)) {
        map.set(emp.employee_id, { ...emp, asistencia_mes: [...emp.asistencia_mes] });
      } else {
        const merged = map.get(emp.employee_id)!;
        emp.asistencia_mes.forEach(dayObj => {
          const idx = merged.asistencia_mes.findIndex(d => d.dia === dayObj.dia);
          if (idx === -1) {
            merged.asistencia_mes.push(dayObj);
          } else {
            const mergedDay = merged.asistencia_mes[idx];
            const bestStatus =
              statusPriority[dayObj.status] > statusPriority[mergedDay.status]
                ? dayObj
                : mergedDay;
            merged.asistencia_mes[idx] = bestStatus;
          }
        });
      }
    });

    // Agrupa todos los status por día y deja solo el de mayor prioridad
    map.forEach(emp => {
      const dayMap = new Map<number, { status: StatusType; dia: number }[]>();
      emp.asistencia_mes.forEach(d => {
        if (!dayMap.has(d.dia)) dayMap.set(d.dia, []);
        dayMap.get(d.dia)!.push(d);
      });
      emp.asistencia_mes = Array.from(dayMap.values()).map(arr =>
        arr.reduce((prev, curr) =>
          statusPriority[curr.status] > statusPriority[prev.status] ? curr : prev
        )
      );
      emp.asistencia_mes.sort((a, b) => a.dia - b.dia);

      // --- Recalcula el resumen aquí ---
      let asistencias = 0, retardos = 0, faltas = 0;
      emp.asistencia_mes.forEach(d => {
        if (d.status === "asistencia") asistencias++;
        else if (d.status === "retardo") retardos++;
        else if (d.status === "falta" || d.status === "falta_por_retardo") faltas++;
      });
      emp.resumen = { asistencias, retardos, faltas };
    });

    return Array.from(map.values());
  }, [statusFilteredData, groupByLocation]);

  // Semanas del mes
  const weeks = useMemo(() => getWeeks(daysInMonth, month, year), [daysInMonth, month, year]);

  // Posiciona en la semana actual al cambiar mes/año/timeframe
  useEffect(() => {
    if (timeframe === "semana") {
      const today = new Date();
      const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();
      const currentDay = isCurrentMonth ? today.getDate() : 1;
      const idx = weeks.findIndex(week => week.includes(currentDay));
      setSelectedWeek(idx >= 0 ? idx : 0);
    }
  }, [month, year, timeframe, weeks]);

  // Días a mostrar según vista
  const daysToShow = timeframe === "semana" ? weeks[selectedWeek] : Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full overflow-x-auto">
      {timeframe === "semana" && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className="p-2 rounded-full border bg-white shadow hover:bg-blue-50 transition disabled:opacity-50"
            disabled={selectedWeek === 0}
            onClick={() => setSelectedWeek(w => Math.max(0, w - 1))}
            aria-label="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex flex-col items-center border border-blue-200 min-w-[160px]">
            <span className="text-sm font-semibold text-blue-700">
              Semana {selectedWeek + 1}
            </span>
            <span className="text-xs text-gray-600">
              {daysToShow.filter(Boolean)[0]} - {daysToShow.filter(Boolean).slice(-1)[0]}
            </span>
          </div>
          <button
            className="p-2 rounded-full border bg-white shadow hover:bg-blue-50 transition disabled:opacity-50"
            disabled={selectedWeek === weeks.length - 1}
            onClick={() => setSelectedWeek(w => Math.min(weeks.length - 1, w + 1))}
            aria-label="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {groupByLocation && (
              <th className="sticky left-0 bg-white z-10 p-2 border-b text-left">Ubicación</th>
            )}
            <th className={`sticky ${groupByLocation ? "left-[120px]" : "left-0"} bg-white z-10 p-2 border-b text-left`}>
              <div>
                <span>Empleado</span>
                <input
                  type="text"
                  placeholder="Buscar empleado..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="mt-2 w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </th>
            {daysToShow.map((day, idx) => (
              <th key={idx} className="p-2 border-b text-center">{day ? day : ""}</th>
            ))}
            <th className="p-2 border-b text-center">Asistencias</th>
            <th className="p-2 border-b text-center">Retardos</th>
            <th className="p-2 border-b text-center">Faltas</th>
          </tr>
        </thead>
        <tbody>
          {groupByLocation
            ? [...locationMap.entries()].map(([ubicacion, empleados]) =>
                empleados.map((emp, empIdx) => (
                  <tr key={emp.employee_id} className={empIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {empIdx === 0 && (
                      <td
                        rowSpan={empleados.length}
                        className="sticky left-0 bg-white z-10 p-2 border-b font-semibold align-top"
                      >
                        {ubicacion}
                      </td>
                    )}
                    <td className={`sticky left-[120px] bg-white z-10 p-2 border-b font-medium align-top`}>
                      {emp.nombre}
                    </td>
                    {daysToShow.map((day, i) => {
                      if (!day) {
                        return <td key={i} className="p-1 border-b text-center bg-gray-100"></td>;
                      }
                      const dayObj = emp.asistencia_mes.find(d => d.dia === day);
                      const status = dayObj?.status || "sin_registro";
                      const config = statusConfig[status] || statusConfig["sin_registro"];
                      return (
                        <td key={i} className="p-1 border-b text-center">
                          <span
                            className={`inline-flex items-center justify-center rounded-full w-7 h-7 ${config.color}`}
                            title={config.label}
                          >
                            {config.icon}
                          </span>
                        </td>
                      );
                    })}
                    <td className="p-2 border-b text-center">{emp.resumen.asistencias}</td>
                    <td className="p-2 border-b text-center">{emp.resumen.retardos}</td>
                    <td className="p-2 border-b text-center">{emp.resumen.faltas}</td>
                  </tr>
                ))
              )
            : mergedData.map((emp, empIdx) => (
                <tr key={emp.employee_id} className={empIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="sticky left-0 bg-white z-10 p-2 border-b font-medium align-top">
                    {emp.nombre}
                  </td>
                  {daysToShow.map((day, i) => {
                    const isTodayCol = day === currentDay && selectedStatus.length > 0;
                    if (!day) {
                      return <td key={i} className="p-1 border-b text-center bg-gray-100"></td>;
                    }
                    const dayObj = emp.asistencia_mes.find(d => d.dia === day);
                    const status = dayObj?.status || "sin_registro";
                    const config = statusConfig[status] || statusConfig["sin_registro"];
                    return (
                      <td
                        key={i}
                        className={`p-1 border-b text-center ${isTodayCol ? "bg-yellow-300" : ""}`}
                      >
                        <span
                          className={`inline-flex items-center justify-center rounded-full w-7 h-7 ${config.color}`}
                          title={config.label}
                        >
                          {config.icon}
                        </span>
                      </td>
                    );
                  })}
                  <td className="p-2 border-b text-center">{emp.resumen.asistencias}</td>
                  <td className="p-2 border-b text-center">{emp.resumen.retardos}</td>
                  <td className="p-2 border-b text-center">{emp.resumen.faltas}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};