import React, { useMemo } from 'react';
import {
    AttendanceRow,
    EmployeeAttendance,
    LocationAttendance,
    GroupingMode
} from '../types/attendance';
import AttendanceCell from './AttendanceCell';
import UserCell from './UserCell';

interface AttendanceTableProps {
    data: AttendanceRow[];
    month?: number;
    year?: number;
    groupingMode: GroupingMode;
    groupByLocation?: boolean; // NUEVO: Prop para controlar la agrupación
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
    data,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
    groupingMode = 'employees',
    groupByLocation = true // Por defecto, agrupar por ubicación
}) => {
    // Get days in month and start day of week
    const daysInMonth = useMemo(() => {
        return new Date(year, month, 0).getDate();
    }, [month, year]);

    // Generate array of days for the month
    const days = useMemo(() => {
        const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday

            return {
                day,
                dayName: dayNames[dayOfWeek],
                isWeekend,
            };
        });
    }, [daysInMonth, month, year]);

    // Organizar los datos según el modo y si hay información de ubicación
    const organizedData = useMemo(() => {
        if (groupingMode === 'locations') {
            // Código existente para modo 'locations'
            const locationMap = new Map<string, LocationAttendance[]>();

            (data as LocationAttendance[]).forEach(item => {
                if (!item.locationName) return; // Ignorar datos malformados

                if (!locationMap.has(item.locationName)) {
                    locationMap.set(item.locationName, []);
                }
                locationMap.get(item.locationName)?.push(item);
            });

            // Convertir el mapa a un array de grupos de ubicación
            const locationGroups: { locationName: string, shifts: LocationAttendance[] }[] = [];

            locationMap.forEach((shifts, locationName) => {
                // Ordenar los turnos: T1, T2, T3
                shifts.sort((a, b) => {
                    // Extraer el número del turno (T1, T2, T3)
                    const getShiftNumber = (s: LocationAttendance) => {
                        const match = s.shiftInfo?.id?.match(/T(\d+)/);
                        return match ? parseInt(match[1], 10) : 99; // Valor alto por defecto para los que no coincidan
                    };

                    return getShiftNumber(a) - getShiftNumber(b);
                });

                locationGroups.push({
                    locationName,
                    shifts
                });
            });

            return {
                groupedByLocation: true,
                locationGroups,
                employeesByLocation: null,
                groupEmployeesByLocation: false
            };
        } else {
            // Modo 'employees'
            // Verificar si hay datos de ubicación y si está activada la agrupación
            const hasLocationData = data.some(item => 'location' in item && (item as any).location);

            // MODIFICADO: Solo agrupar si hay datos y groupByLocation está activo
            if (!hasLocationData || !groupByLocation) {
                // Sin datos de ubicación o agrupación desactivada, mostrar sin agrupar
                return {
                    groupedByLocation: false,
                    data,
                    employeesByLocation: null,
                    groupEmployeesByLocation: false
                };
            }

            // Agrupar empleados por ubicación
            const locationMap = new Map<string, EmployeeAttendance[]>();

            // Grupo para empleados sin ubicación asignada - TEXTO ACTUALIZADO
            locationMap.set('Sin asistencia registrada', []);

            (data as EmployeeAttendance[]).forEach(item => {
                // TEXTO ACTUALIZADO
                const location = (item as any).location || 'Sin asistencia registrada';

                if (!locationMap.has(location)) {
                    locationMap.set(location, []);
                }
                locationMap.get(location)?.push(item);
            });

            // Convertir el mapa a un array de grupos de ubicación
            const employeesByLocation: { locationName: string, employees: EmployeeAttendance[] }[] = [];

            locationMap.forEach((employees, locationName) => {
                // Solo agregar el grupo si tiene empleados
                if (employees.length > 0) {
                    // Ordenar empleados por nombre
                    employees.sort((a, b) => a.name.localeCompare(b.name));

                    employeesByLocation.push({
                        locationName,
                        employees
                    });
                }
            });

            // Ordenar por nombre de ubicación
            employeesByLocation.sort((a, b) => {
                // TEXTO ACTUALIZADO: Poner "Sin asistencia registrada" al final
                if (a.locationName === 'Sin asistencia registrada') return 1;
                if (b.locationName === 'Sin asistencia registrada') return -1;

                return a.locationName.localeCompare(b.locationName);
            });

            // Determinar si se debe agrupar
            // Solo agrupar si hay más de una ubicación significativa
            const hasMultipleLocations = employeesByLocation.length > 1 ||
                (employeesByLocation.length === 1 && employeesByLocation[0].locationName !== 'Sin asistencia registrada');

            return {
                groupedByLocation: false,
                data,
                employeesByLocation,
                groupEmployeesByLocation: hasMultipleLocations && groupByLocation // MODIFICADO
            };
        }
    }, [data, groupingMode, groupByLocation]); // MODIFICADO: Añadir groupByLocation como dependencia

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {/* Name column(s) */}
                        {groupingMode === 'locations' ? (
                            <>
                                <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10">
                                    <div className="min-w-[120px]">Ubicación</div>
                                </th>
                                <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-[120px] z-10">
                                    <div className="min-w-[120px]">Turno</div>
                                </th>
                            </>
                        ) : organizedData.groupEmployeesByLocation ? (
                            <>
                                <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10">
                                    <div className="min-w-[120px]">Ubicación</div>
                                </th>
                                <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-[120px] z-10">
                                    <div className="min-w-[180px]">Empleado</div>
                                </th>
                            </>
                        ) : (
                            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10">
                                <div className="min-w-[180px]">Empleado</div>
                            </th>
                        )}

                        {/* Days of month */}
                        {days.map((day) => (
                            <th
                                key={day.day}
                                className={`p-1 border-b-2 border-gray-300 text-center min-w-[30px] ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}`}
                            >
                                <div className="text-sm font-bold">{day.day.toString().padStart(2, '0')}</div>
                                <div className="text-xs">{day.dayName}</div>
                            </th>
                        ))}

                        {/* Summary columns */}
                        <th className="p-2 border-b-2 border-gray-300 text-center bg-white">
                            <div className="min-w-[60px]">Asistencias</div>
                        </th>
                        <th className="p-2 border-b-2 border-gray-300 text-center bg-white">
                            <div className="min-w-[60px]">Retardos</div>
                        </th>
                        <th className="p-2 border-b-2 border-gray-300 text-center bg-white">
                            <div className="min-w-[60px]">Faltas</div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {/* NUEVO: Renderizado para empleados (modo employees) con agrupación por ubicación */}
                    {!organizedData.groupedByLocation && organizedData.groupEmployeesByLocation &&
                        organizedData.employeesByLocation?.map((locationGroup, locationIndex) => {
                            const isEvenLocation = locationIndex % 2 === 0;
                            const baseRowClass = isEvenLocation ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100';

                            return locationGroup.employees.map((employee, employeeIndex) => (
                                <tr key={`${locationGroup.locationName}-${employee.id}`} className={baseRowClass}>
                                    {/* Primera columna: Nombre de ubicación (con rowSpan) */}
                                    {employeeIndex === 0 && (
                                        <td
                                            rowSpan={locationGroup.employees.length}
                                            className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10"
                                        >
                                            <div className="font-semibold">
                                                {locationGroup.locationName}
                                            </div>
                                        </td>
                                    )}

                                    {/* Segunda columna: Nombre del empleado */}
                                    <td className="p-2 border-b border-gray-200 bg-white sticky left-[120px] z-10">
                                        <div className="text-sm text-gray-700">
                                            {employee.name}
                                        </div>
                                    </td>

                                    {/* Celdas de asistencia */}
                                    {days.map((day) => {
                                        const attendance = employee.attendance[day.day] || { status: 'noRecord', date: '' };
                                        return (
                                            <td
                                                key={`${employee.id}-${day.day}`}
                                                className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                                            >
                                                <AttendanceCell
                                                    status={attendance.status}
                                                    isWeekend={day.isWeekend}
                                                />
                                            </td>
                                        );
                                    })}

                                    {/* Summary cells */}
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {employee.summary.totalPresent}
                                    </td>
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {employee.summary.totalLate}
                                    </td>
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {employee.summary.totalAbsent}
                                    </td>
                                </tr>
                            ));
                        })}

                    {/* Renderizado para empleados (modo employees) sin agrupación */}
                    {!organizedData.groupedByLocation && !organizedData.groupEmployeesByLocation &&
                        data.map((row, rowIndex) => (
                            <tr key={row.id} className={rowIndex % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                {/* Nombre del empleado */}
                                <td className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10 font-medium">
                                    {(row as EmployeeAttendance).name}
                                </td>

                                {/* Attendance cells */}
                                {days.map((day) => {
                                    const attendance = row.attendance[day.day] || { status: 'noRecord', date: '' };
                                    return (
                                        <td
                                            key={`${row.id}-${day.day}`}
                                            className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                                        >
                                            <AttendanceCell
                                                status={attendance.status}
                                                isWeekend={day.isWeekend}
                                            />
                                        </td>
                                    );
                                })}

                                {/* Summary cells */}
                                <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                    {row.summary.totalPresent}
                                </td>
                                <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                    {row.summary.totalLate}
                                </td>
                                <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                    {row.summary.totalAbsent}
                                </td>
                            </tr>
                        ))}

                    {/* Renderizado para ubicaciones agrupadas (modo locations) */}
                    {organizedData.groupedByLocation &&
                        organizedData.locationGroups?.map((locationGroup, locationIndex) => {
                            const isEvenLocation = locationIndex % 2 === 0;
                            const baseRowClass = isEvenLocation ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100';

                            return locationGroup.shifts.map((shift, shiftIndex) => (
                                <tr key={`${locationGroup.locationName}-${shift.id}`} className={baseRowClass}>
                                    {/* Primera columna: Nombre de ubicación */}
                                    {shiftIndex === 0 && (
                                        <td
                                            rowSpan={locationGroup.shifts.length}
                                            className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10"
                                        >
                                            <div className="font-semibold">
                                                {locationGroup.locationName}
                                            </div>
                                        </td>
                                    )}

                                    {/* Segunda columna: Información del turno */}
                                    <td className="p-2 border-b border-gray-200 bg-white sticky left-[120px] z-10">
                                        <div className="text-sm text-gray-700">
                                            {shift.shiftInfo.name}
                                        </div>
                                    </td>

                                    {/* Celdas de asistencia */}
                                    {days.map((day) => {
                                        const attendance = shift.attendance[day.day] || { status: 'noRecord', date: '' };
                                        return (
                                            <td
                                                key={`${shift.id}-${day.day}`}
                                                className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                                            >
                                                <UserCell
                                                    status={attendance.status}
                                                    userName={attendance.userName}
                                                    isWeekend={day.isWeekend}
                                                />
                                            </td>
                                        );
                                    })}

                                    {/* Resumen */}
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {shift.summary.totalPresent}
                                    </td>
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {shift.summary.totalLate}
                                    </td>
                                    <td className="p-2 border-b border-gray-200 text-center font-semibold">
                                        {shift.summary.totalAbsent}
                                    </td>
                                </tr>
                            ));
                        })}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;