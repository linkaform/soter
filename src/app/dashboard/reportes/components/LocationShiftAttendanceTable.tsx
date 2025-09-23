import React from "react";
import ShiftAttendanceCell from "./ShiftAttendanceCell";
import { ShiftAttendance } from "../types/attendance";

interface LocationShiftAttendanceTableProps {
  data: ShiftAttendance[];
  month: number;
  year: number;
}

const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

export const LocationShiftAttendanceTable: React.FC<LocationShiftAttendanceTableProps> = ({
  data,
  month,
  year,
}) => {
  // Obtener el número de días del mes
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    return {
      day,
      dayName: dayNames[dayOfWeek],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    };
  });

  // Agrupar por ubicación
  const locationMap = new Map<string, ShiftAttendance[]>();
  data.forEach(item => {
    if (!locationMap.has(item.location)) locationMap.set(item.location, []);
    locationMap.get(item.location)?.push(item);
  });

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10 min-w-[120px]">Ubicación</th>
            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-[120px] z-10 min-w-[120px]">Turno</th>
            {days.map(day => (
              <th
                key={day.day}
                className={`p-1 border-b-2 border-gray-300 text-center min-w-[32px] max-w-[36px] ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}`}
              >
                <div className="text-xs font-bold">{day.day.toString().padStart(2, '0')}</div>
                <div className="text-[10px]">{day.dayName}</div>
              </th>
            ))}
            {/* Totales más pequeños */}
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">A</th>
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">R</th>
            <th className="px-1 py-2 border-b-2 border-gray-300 text-center bg-white min-w-[28px] max-w-[32px] text-xs">F</th>
          </tr>
        </thead>
        <tbody>
          {[...locationMap.entries()].map(([locationName, shifts], locationIndex) => {
            return shifts.map((shift, shiftIndex) => (
              <tr key={`${locationName}-${shift.turno_id}-${shiftIndex}`} className={locationIndex % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                {/* Ubicación solo en la primera fila del grupo */}
                {shiftIndex === 0 && (
                  <td
                    rowSpan={shifts.length}
                    className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10 font-semibold"
                  >
                    {locationName}
                  </td>
                )}
                {/* Turno */}
                <td className="p-2 border-b border-gray-200 bg-white sticky left-[120px] z-10">
                  {shift.turno_name}
                </td>
                {/* Celdas de asistencia */}
                {days.map(day => {
                  const attendanceDay = shift.attendance?.find(a => a.day === day.day);
                  return (
                    <td
                      key={`${shift.turno_id}-${day.day}`}
                      className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                    >
                      {attendanceDay ? (
                        <ShiftAttendanceCell
                          status={attendanceDay.status}
                          userNames={attendanceDay.user_names || []}
                        />
                      ) : (
                        <div className="h-8 w-8" />
                      )}
                    </td>
                  );
                })}
                {/* Nuevas columnas de resumen */}
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {shift.summary?.present ?? 0}
                </td>
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {shift.summary?.halfDay ?? 0}
                </td>
                <td className="px-1 py-2 border-b border-gray-200 text-center font-semibold text-xs">
                  {shift.summary?.absent ?? 0}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LocationShiftAttendanceTable;