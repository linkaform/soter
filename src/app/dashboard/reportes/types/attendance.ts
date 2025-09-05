export type AttendanceStatus =
    | 'present'      // Asistencia normal (✓ verde)
    | 'late'         // Retardo (⚠️ naranja)
    | 'absent'       // Falta (✗ rojo)
    | 'noRecord'     // Sin registro (⚪ gris)
    | 'halfDay'      // Medio día (otro ícono)
    | 'notApplicable'      // No aplicable (otro ícono)
    | 'weekend';     // Fin de semana (para colorear el fondo)

export interface DailyAttendance {
    status: AttendanceStatus;
    date: string;
    userName?: string;
    location: string[]; // Nombres de las ubicaciones asociadas
}

export interface AttendanceSummary {
    totalPresent: number;
    totalLate: number;
    totalAbsent: number;
}

// Interfaz base para ambos tipos de filas
export interface BaseAttendanceRow {
    id: string;
    attendance: {
        [day: number]: DailyAttendance;
    };
    summary: AttendanceSummary;
}

// Para empleados individuales
export interface EmployeeAttendance extends BaseAttendanceRow {
    name: string;
    type: 'employee';
    locations?: string[]; // Nombres de las ubicaciones asociadas
}

// Para turnos en ubicaciones
export interface ShiftInfo {
    id: string;
    name: string;  // Ej: "T1: 06:00 - 14:00 hrs"
    timeRange: string; // Ej: "06:00 - 14:00 hrs"
}

// Para ubicaciones con turnos
export interface LocationAttendance extends BaseAttendanceRow {
    locationName: string;
    shiftInfo: ShiftInfo;
    type: 'location';
}

// Tipo unión para manejar ambos casos
export type AttendanceRow = EmployeeAttendance | LocationAttendance;

// Tipo de agrupación para el componente
export type GroupingMode = 'employees' | 'locations';