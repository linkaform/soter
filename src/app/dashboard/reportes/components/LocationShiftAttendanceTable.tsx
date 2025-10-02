import React, { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AttendanceDetailModal from "./AttendanceDetailModal";

const statusColors: Record<string, string> = {
  presente: "bg-green-500 text-white",
  retardo: "bg-blue-400 text-white",
  falta: "bg-red-500 text-white",
  falta_por_retardo: "bg-yellow-500 text-white",
  dia_libre: "bg-gray-300 text-gray-600",
  sin_registro: "bg-gray-100 text-gray-400",
};

function getAbbreviation(name: string) {
  if (!name || name === "sin_registro") return "-";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

interface GuardiasPorDia {
  nombre: string;
  status: string;
}

interface RowData {
  ubicacion: string;
  turno_ref: string;
  asistencia_mes: { dia: number; empleados: string[] }[];
  resumen: { asistencias: number; retardos: number; faltas: number };
}

interface LocationShiftAttendanceTableProps {
  data: RowData[];
  month: number;
  year: number;
  timeframe?: "mes" | "semana";
}

const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

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

// GuardiasCircles ya NO tiene modal ni estado propio
const GuardiasCircles: React.FC<{ guardias: GuardiasPorDia[], onGuardClick?: (names: string[]) => void }> = ({ guardias, onGuardClick }) => {
  const maxVisible = 2;
  const visibles = guardias.slice(0, maxVisible);
  const extra = guardias.length - maxVisible;

  return (
    <div className="flex items-center justify-center relative min-h-[10px] min-w-[28px]">
      {visibles.map((g, idx) => (
        <button
          type="button"
          key={idx}
          disabled={!onGuardClick}
          onClick={() => onGuardClick && onGuardClick([g.nombre])}
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] ${statusColors[g.status] || statusColors["sin_registro"]} border border-white shadow absolute cursor-pointer`}
          style={
            visibles.length > 1
              ? { left: `${idx * 12}px`, zIndex: 10 - idx }
              : { position: "static" }
          }
          title={`${g.nombre} (${g.status})`}
        >
          {getAbbreviation(g.nombre)}
        </button>
      ))}
      {extra > 0 && (
        <button
          type="button"
          onClick={() => onGuardClick && onGuardClick(guardias.slice(maxVisible).map(g => g.nombre))}
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] bg-gray-200 text-gray-700 border border-white shadow absolute cursor-pointer`}
          style={{
            left: `${maxVisible * 12}px`,
            zIndex: 10 - maxVisible,
          }}
          title={guardias.slice(maxVisible).map(g => g.nombre).join(", ")}
        >
          +{extra}
        </button>
      )}
      {guardias.length === 0 && (
        <span
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] ${statusColors["sin_registro"]} border border-white shadow`}
        >
          -
        </span>
      )}
    </div>
  );
};

const LocationShiftAttendanceTable: React.FC<LocationShiftAttendanceTableProps> = ({
  data,
  month,
  year,
  timeframe = "mes",
}) => {
  // Estado para el modal y los nombres seleccionados
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedUbicacion, setSelectedUbicacion] = useState<string>("");

  // Agrupa los registros por ubicación
  const ubicacionMap = useMemo(() => {
    const map = new Map<string, RowData[]>();
    (data || []).forEach(item => {
      if (!map.has(item.ubicacion)) map.set(item.ubicacion, []);
      map.get(item.ubicacion)!.push(item);
    });
    return map;
  }, [data]);

  // Días y semanas del mes
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return {
      day,
      dayName: dayNames[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  }), [daysInMonth, month, year]);

  const weeks = useMemo(() => getWeeks(daysInMonth, month, year), [daysInMonth, month, year]);
  const [selectedWeek, setSelectedWeek] = useState(0);

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
  const daysToShow = timeframe === "semana"
    ? weeks[selectedWeek].filter(Boolean).map(dayNum => days.find(d => d.day === dayNum)!)
    : days;

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
              {daysToShow[0]?.day} - {daysToShow[daysToShow.length - 1]?.day}
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
            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10 min-w-[120px]">Ubicación</th>
            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-[120px] z-10 min-w-[120px]">Turno</th>
            {daysToShow.map(day => (
              <th
                key={day.day}
                className={`p-1 border-b-2 border-gray-300 text-center min-w-[32px] max-w-[36px] ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}`}
              >
                <div className="text-xs font-bold">{day.day.toString().padStart(2, '0')}</div>
                <div className="text-[10px]">{day.dayName}</div>
              </th>
            ))}
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">A</th>
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">R</th>
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">F</th>
          </tr>
        </thead>
        <tbody>
          {[...ubicacionMap.entries()].map(([ubicacion, rows], locationIndex) => {
            return rows.map((row, rowIndex) => (
              <tr key={`${ubicacion}-${row.turno_ref}-${rowIndex}`} className={locationIndex % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                {/* Ubicación solo en la primera fila del grupo, usando rowSpan */}
                {rowIndex === 0 && (
                  <td
                    rowSpan={rows.length}
                    className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10 font-semibold align-top"
                  >
                    {ubicacion}
                  </td>
                )}
                {/* Turno */}
                <td className="p-2 border-b border-gray-200 bg-white sticky left-[120px] z-10">
                  {row.turno_ref}
                </td>
                {/* Celdas de asistencia */}
                {daysToShow.map(day => {
                  const asistencia = row.asistencia_mes?.find?.(a => a.dia === day.day);
                  const guardias: GuardiasPorDia[] = Array.isArray(asistencia?.empleados)
                    ? asistencia.empleados
                        .filter(e => typeof e === "string" && e && e !== "sin_registro-sin_registro")
                        .map(e => {
                          const [nombre, status] = e.split("-");
                          return { nombre, status };
                        })
                    : [];
                  return (
                    <td
                      key={`${row.turno_ref}-${day.day}`}
                      className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                    >
                      <GuardiasCircles
                        guardias={guardias}
                        onGuardClick={
                          guardias.length > 0
                            ? (names) => {
                                setSelectedNames(names);
                                setSelectedDay(day.day);
                                setModalOpen(true);
                                setSelectedUbicacion(ubicacion);
                              }
                            : undefined
                        }
                      />
                    </td>
                  );
                })}
                {/* Resumen */}
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {row.resumen?.asistencias ?? 0}
                </td>
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {row.resumen?.retardos ?? 0}
                </td>
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {row.resumen?.faltas ?? 0}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
      {/* Modal global, fuera de la tabla */}
      <AttendanceDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        names={selectedNames}
        selectedDay={selectedDay ?? 1}
        ubicacion={selectedUbicacion}
      />
    </div>
  );
};

export default LocationShiftAttendanceTable;