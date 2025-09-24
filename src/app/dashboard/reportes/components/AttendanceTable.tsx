import React, { useMemo } from 'react';
import {
    AttendanceRow,
    EmployeeAttendance,
    LocationAttendance,
    GroupingMode,
    DailyAttendance
} from '../types/attendance';
import AttendanceCell from './AttendanceCell';
import UserCell from './UserCell';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Asegúrate de tener estos íconos instalados

interface AttendanceTableProps {
    data: any; // Cambiado para aceptar cualquier formato de datos
    month?: number;
    year?: number;
    groupingMode: GroupingMode;
    groupByLocation?: boolean;
    timeframe?: 'mes' | 'semana';
    selectedStatus?: string[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({
    data,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
    groupingMode = 'employees',
    groupByLocation = true,
    timeframe = 'mes',
    selectedStatus
}) => {
    const today = new Date();
    const isCurrentMonth = month === today.getMonth() + 1 && year === today.getFullYear();
    const currentDay = isCurrentMonth ? today.getDate() : null;

    // Calcula el índice de la semana actual
    const getCurrentWeekIndex = () => {
        if (!isCurrentMonth || !currentDay) return 0;
        const firstDay = new Date(year, month - 1, 1).getDay() || 7; // Lunes=1, Domingo=7
        return Math.floor((currentDay + firstDay - 2) / 7);
    };

    const [selectedWeek, setSelectedWeek] = React.useState(
        timeframe === "semana" ? getCurrentWeekIndex() : 0
    );
    const [search, setSearch] = React.useState("");

    // Get days in month and start day of week
    const daysInMonth = React.useMemo(() => {
        return new Date(year, month, 0).getDate();
    }, [month, year]);

    // Calcula el número de semanas en el mes
    const weeksInMonth = React.useMemo(() => {
        const firstDay = new Date(year, month - 1, 1).getDay() || 7; // Lunes=1, Domingo=7
        return Math.ceil((daysInMonth + firstDay - 1) / 7);
    }, [daysInMonth, month, year]);

    // Utilidad para obtener los días de la semana seleccionada
    const getWeekDays = React.useCallback((year: number, month: number, weekIndex: number) => {
        const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const firstDayOfWeek = firstDayOfMonth.getDay() || 7; // Lunes=1, Domingo=7
        const startDay = 1 + weekIndex * 7 - (firstDayOfWeek - 1);
        const weekDays = [];
        for (let i = 0; i < 7; i++) {
            const day = startDay + i;
            if (day > 0 && day <= daysInMonth) {
                const date = new Date(year, month - 1, day);
                const dayOfWeek = date.getDay();
                weekDays.push({
                    day,
                    dayName: dayNames[dayOfWeek],
                    isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                });
            }
        }
        return weekDays;
    }, [daysInMonth]);

    // Transformar los datos al formato esperado por el componente
    const transformedData = useMemo(() => {
        return transformNewDataFormat(data, month, year, groupingMode);
    }, [data, month, year, groupingMode]);

    // Organizar los datos según el modo y si hay información de ubicación
    const organizedData = useMemo(() => {
        if (groupingMode === 'locations') {
            // Código existente para modo 'locations'
            const locationMap = new Map<string, LocationAttendance[]>();

            (transformedData as LocationAttendance[]).forEach(item => {
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
                groupEmployeesByLocation: false,
                data: transformedData
            };
        } else {
            // Modo 'employees'
            // CAMBIO: Simplificar la lógica para respetar siempre la opción groupByLocation
            if (!groupByLocation) {
                // Si la agrupación está desactivada, mostrar sin agrupar
                return {
                    groupedByLocation: false,
                    data: transformedData,
                    employeesByLocation: null,
                    groupEmployeesByLocation: false
                };
            }

            // Si llegamos aquí, el usuario quiere agrupar por ubicación
            // Agrupar empleados por ubicación
            const locationMap = new Map<string, EmployeeAttendance[]>();

            // Grupo para empleados sin ubicación asignada
            locationMap.set('Sin asistencia registrada', []);

            (transformedData as EmployeeAttendance[]).forEach(item => {
                // Si el empleado tiene ubicaciones, agregarlo a cada una
                const locations = (item as any).locations || [];

                if (locations.length === 0) {
                    // Si no tiene ubicaciones, agregarlo al grupo "Sin asistencia registrada"
                    locationMap.get('Sin asistencia registrada')?.push(item);
                } else {
                    // Agregar el empleado a cada una de sus ubicaciones
                    locations.forEach((location: string) => {
                        if (!locationMap.has(location)) {
                            locationMap.set(location, []);
                        }
                        locationMap.get(location)?.push(item);
                    });
                }
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
                // Poner "Sin asistencia registrada" al final
                if (a.locationName === 'Sin asistencia registrada') return 1;
                if (b.locationName === 'Sin asistencia registrada') return -1;

                return a.locationName.localeCompare(b.locationName);
            });

            return {
                groupedByLocation: false,
                data: transformedData,
                employeesByLocation,
                groupEmployeesByLocation: true  // CAMBIO: Siempre true cuando groupByLocation es true
            };
        }
    }, [transformedData, groupingMode, groupByLocation]);

    // Obtener los días de la semana seleccionada
    const days = useMemo(() => {
        if (timeframe === 'semana') {
            return getWeekDays(year, month, selectedWeek);
        }

        // Por defecto, mostrar todos los días del mes
        const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay();
            return {
                day,
                dayName: dayNames[dayOfWeek],
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            };
        });
    }, [month, year, selectedWeek, timeframe, daysInMonth, getWeekDays]);

    // Siempre incluye "noRecord" en el arreglo de status seleccionados para el filtrado
    const effectiveSelectedStatus = selectedStatus && selectedStatus.length > 0
        ? Array.from(new Set([...selectedStatus, "noRecord"]))
        : selectedStatus;

    // Filtrado para empleados agrupados por ubicación
    const filteredEmployeesByLocation = useMemo(() => {
        if (!organizedData.groupEmployeesByLocation || !organizedData.employeesByLocation) return [];
        let filtered = organizedData.employeesByLocation;
        if (search) {
            filtered = filtered
                .map(group => ({
                    ...group,
                    employees: group.employees.filter(emp =>
                        emp.name.toLowerCase().includes(search.toLowerCase())
                    )
                }))
                .filter(group => group.employees.length > 0);
        }
        if (effectiveSelectedStatus && effectiveSelectedStatus.length > 0 && currentDay) {
            filtered = filtered.map(group => ({
                ...group,
                employees: group.employees.filter(emp => {
                    const att = emp.attendance[currentDay];
                    // Si no hay registro, considerarlo como "noRecord"
                    const status = att ? att.status : "noRecord";
                    return effectiveSelectedStatus.includes(status);
                })
            })).filter(group => group.employees.length > 0);
        }
        return filtered;
    }, [organizedData, search, effectiveSelectedStatus, currentDay]);

    // Filtrado para empleados sin agrupación
    const filteredData = useMemo(() => {
        if (organizedData.groupedByLocation || organizedData.groupEmployeesByLocation) return [];
        let filtered = organizedData.data
            .filter((row): row is EmployeeAttendance => row.type === 'employee');

        if (search) {
            filtered = filtered.filter(emp =>
                emp.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        // AJUSTE: Considera "noRecord" si no hay registro
        if (effectiveSelectedStatus && effectiveSelectedStatus.length > 0 && currentDay) {
            filtered = filtered.filter(emp => {
                const att = emp.attendance[currentDay];
                const status = att ? att.status : "noRecord";
                return effectiveSelectedStatus.includes(status);
            });
        }

        return filtered;
    }, [organizedData, search, effectiveSelectedStatus, currentDay]);

    return (
        <div className="w-full overflow-x-auto">
            {/* Navegación por semanas (solo para el modo de semana) */}
            {timeframe === 'semana' && (
                <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={selectedWeek === 0}
                        onClick={() => setSelectedWeek(w => w - 1)}
                        aria-label="Semana anterior"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <span className="text-base font-medium text-gray-700">
                        Semana <span className="font-bold">{selectedWeek + 1}</span> de <span className="font-bold">{weeksInMonth}</span>
                    </span>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={selectedWeek === weeksInMonth - 1}
                        onClick={() => setSelectedWeek(w => w + 1)}
                        aria-label="Semana siguiente"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            )}

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
                                    <div className="min-w-[180px] flex flex-col gap-1">
                                        <span>Empleado</span>
                                        <input
                                            type="text"
                                            className="border rounded px-2 py-1 w-full text-sm font-light"
                                            placeholder="Buscar empleado..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                        />
                                    </div>
                                </th>
                            </>
                        ) : (
                            <th className="p-2 border-b-2 border-gray-300 text-left bg-white sticky left-0 z-10">
                                <div className="min-w-[180px] flex flex-col gap-1">
                                    <span>Empleado</span>
                                    <input
                                        type="text"
                                        className="border rounded px-2 py-1 w-full text-sm font-light"
                                        placeholder="Buscar empleado..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </th>
                        )}

                        {/* Days of month */}
                        {days.map((day) => {
                            const isToday = currentDay === day.day;
                            return (
                                <th
                                    key={day.day}
                                    className={`p-1 border-b-2 border-gray-300 text-center min-w-[30px] 
                                        ${day.isWeekend ? 'bg-blue-50' : 'bg-white'}
                                        ${selectedStatus && selectedStatus.length > 0 && isToday ? 'bg-yellow-300' : ''}
                                    `}
                                >
                                    <div className="text-sm font-bold">{day.day.toString().padStart(2, '0')}</div>
                                    <div className="text-xs">{day.dayName}</div>
                                </th>
                            );
                        })}

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
                    {/* Renderizado para empleados (modo employees) con agrupación por ubicación */}
                    {!organizedData.groupedByLocation && organizedData.groupEmployeesByLocation &&
                        filteredEmployeesByLocation.map((locationGroup, locationIndex) => {
                            const isEvenLocation = locationIndex % 2 === 0;
                            const baseRowClass = isEvenLocation ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100';

                            return locationGroup.employees.map((employee, employeeIndex) => (
                                <tr key={`${locationGroup.locationName}-${employee.id}`} className={baseRowClass}>
                                    {/* Primera columna: Nombre de ubicación (con rowSpan) */}
                                    {employeeIndex === 0 && (
                                        <td
                                            rowSpan={locationGroup.employees.length}
                                            className="py-1 border-b border-gray-200 bg-white sticky left-0 z-10 w-56"
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
                                        // Determinar si este día es un día libre para el empleado
                                        const employeeDiasLibres = (employee as any).dias_libres || [];
                                        const dayNamesMap: Record<number, string> = {
                                            0: "domingo",
                                            1: "lunes",
                                            2: "martes",
                                            3: "miercoles",
                                            4: "jueves",
                                            5: "viernes",
                                            6: "sabado"
                                        };
                                        const dateObj = new Date(year, month - 1, day.day);
                                        const dayName = dayNamesMap[dateObj.getDay()];
                                        const isDayOff = employeeDiasLibres.map((d: string) => d.toLowerCase()).includes(dayName);

                                        // Si es día libre, mostrar el icono de dayOff
                                        if (isDayOff) {
                                            return (
                                                <td
                                                    key={`${employee.id}-${day.day}`}
                                                    className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                                                >
                                                    <AttendanceCell
                                                        status="dayOff"
                                                        isWeekend={day.isWeekend}
                                                    />
                                                </td>
                                            );
                                        }

                                        // Si no, mostrar el status normal
                                        const attendance = employee.attendance[day.day] || { status: 'noRecord', date: '' };
                                        const isToday = currentDay === day.day;
                                        return (
                                            <td
                                                key={`${employee.id}-${day.day}`}
                                                className={`border-b border-gray-200 text-center
                                                    ${day.isWeekend ? 'bg-blue-50' : ''}
                                                    ${selectedStatus && selectedStatus.length > 0 && isToday ? 'bg-yellow-300' : ''}
                                                `}
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
                        filteredData
                            .filter((row): row is EmployeeAttendance => row.type === 'employee')
                            .map((row, rowIndex) => (
                                <tr key={row.id} className={rowIndex % 2 === 0 ? 'hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                    {/* Nombre del empleado */}
                                    <td className="p-2 border-b border-gray-200 bg-white sticky left-0 z-10 font-medium">
                                        {row.name}
                                    </td>

                                    {/* Attendance cells */}
                                    {days.map((day) => {
                                        // Lógica para días libres
                                        const employeeDiasLibres = (row as any).dias_libres || [];
                                        const dayNamesMap: Record<number, string> = {
                                            0: "domingo",
                                            1: "lunes",
                                            2: "martes",
                                            3: "miercoles",
                                            4: "jueves",
                                            5: "viernes",
                                            6: "sabado"
                                        };
                                        const dateObj = new Date(year, month - 1, day.day);
                                        const dayName = dayNamesMap[dateObj.getDay()];
                                        const isDayOff = employeeDiasLibres.map((d: string) => d.toLowerCase()).includes(dayName);

                                        if (isDayOff) {
                                            return (
                                                <td
                                                    key={`${row.id}-${day.day}`}
                                                    className={`border-b border-gray-200 text-center ${day.isWeekend ? 'bg-blue-50' : ''}`}
                                                >
                                                    <AttendanceCell
                                                        status="dayOff"
                                                        isWeekend={day.isWeekend}
                                                    />
                                                </td>
                                            );
                                        }

                                        const attendance = row.attendance[day.day] || { status: 'noRecord', date: '' };
                                        const isToday = currentDay === day.day;

                                        return (
                                            <td
                                                key={`${row.id}-${day.day}`}
                                                className={`border-b border-gray-200 text-center 
                                                    ${day.isWeekend ? 'bg-blue-50' : ''} 
                                                    ${selectedStatus && selectedStatus.length > 0 && isToday ? 'bg-yellow-300' : ''}
                                                `}
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

// Actualiza la función transformNewDataFormat para manejar ambos modos

const transformNewDataFormat = (data: any, month: number, year: number, groupingMode: GroupingMode): AttendanceRow[] => {
    console.log("Transforming data for mode:", groupingMode);

    if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return [];
    }

    // Modo empleados: array de objetos con estructura { name, attendance: [...], summary: {...} }
    if (groupingMode === 'employees') {
        console.log("Processing employee data");

        return data.map((employee: any) => {
            // Convertir el array de attendance a un objeto indexado por día
            const attendanceMap: { [key: number]: DailyAttendance } = {};

            if (Array.isArray(employee.attendance)) {
                employee.attendance.forEach((record: any) => {
                    const dayNumber = typeof record.day === 'string' ? parseInt(record.day, 10) : record.day;

                    attendanceMap[dayNumber] = {
                        status: record.status,
                        date: `${year}-${month.toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`,
                        location: record.location || employee.locations || []
                    };
                });
            }

            return {
                id: employee.id,
                name: employee.name,
                type: 'employee',
                locations: employee.locations || [],
                attendance: attendanceMap,
                summary: {
                    totalPresent: employee.summary.present || 0,
                    totalLate: employee.summary.late || 0,
                    totalAbsent: employee.summary.absent || 0
                },
                dias_libres: employee.dias_libres || []
            } as EmployeeAttendance & { dias_libres?: string[] };
        });
    }

    // Modo ubicaciones: array de objetos con estructura { locationName, shiftInfo, attendance: [...], summary: {...} }
    if (groupingMode === 'locations') {
        console.log("Processing location data");

        return data.map((location: any) => {
            // Convertir el array de attendance a un objeto indexado por día
            const attendanceMap: { [key: number]: DailyAttendance } = {};

            if (Array.isArray(location.attendance)) {
                location.attendance.forEach((record: any) => {
                    const dayNumber = typeof record.day === 'string' ? parseInt(record.day, 10) : record.day;

                    attendanceMap[dayNumber] = {
                        status: record.status,
                        userName: record.userName || null,
                        date: `${year}-${month.toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`,
                        location: record.location || location.locationName ? [location.locationName] : []
                    };
                });
            }

            return {
                id: location.id,
                locationName: location.locationName,
                type: 'location',
                shiftInfo: {
                    id: location.shiftId || 'T1',
                    name: location.shiftName || 'Turno 1'
                },
                attendance: attendanceMap,
                summary: {
                    totalPresent: location.summary.present || 0,
                    totalLate: location.summary.late || 0,
                    totalAbsent: location.summary.absent || 0
                }
            } as LocationAttendance;
        });
    }

    console.warn("Unknown grouping mode:", groupingMode);
    return [];
};

export default AttendanceTable;