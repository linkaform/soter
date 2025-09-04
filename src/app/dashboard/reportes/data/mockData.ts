import {
    EmployeeAttendance,
    LocationAttendance,
    AttendanceRow,
    GroupingMode
} from '../types/attendance';

// Helper function to generate mock attendance data for employees
const generateMockEmployeeAttendance = (
    employeeId: string,
    name: string,
    month: number,
    year: number
): EmployeeAttendance => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const attendance: { [key: number]: any } = {};

    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    // Generate random attendance for each day
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (isWeekend) {
            // No work on weekends
            attendance[day] = {
                status: 'noRecord',
                date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            };
            continue;
        }

        // Generate random status for weekdays
        const rand = Math.random();
        let status: 'present' | 'late' | 'absent' | 'noRecord';

        if (rand < 0.8) {
            status = 'present';
            totalPresent++;
        } else if (rand < 0.95) {
            status = 'late';
            totalLate++;
        } else {
            status = 'absent';
            totalAbsent++;
        }

        attendance[day] = {
            status,
            date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        };
    }

    return {
        id: employeeId,
        name,
        type: 'employee',
        attendance,
        summary: {
            totalPresent,
            totalLate,
            totalAbsent
        }
    };
};

// Helper function to generate mock attendance data for locations with shifts
const generateMockLocationAttendance = (
    locationId: string,
    locationName: string,
    shiftId: string,
    shiftName: string,
    timeRange: string,
    month: number,
    year: number
): LocationAttendance => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const attendance: { [key: number]: any } = {};

    let totalPresent = 0;
    let totalLate = 0;
    let totalAbsent = 0;

    // Generate random attendance for each day
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        if (isWeekend) {
            // No work on weekends
            attendance[day] = {
                status: 'noRecord',
                date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
            };
            continue;
        }

        // Generate random status for weekdays with different distribution for shifts
        // T1 and T2 have better attendance rates than T3 (night shift)
        let presentProbability;
        if (shiftId === 'T1') presentProbability = 0.85;
        else if (shiftId === 'T2') presentProbability = 0.80;
        else presentProbability = 0.75; // T3 (night shift)

        const rand = Math.random();
        let status: 'present' | 'late' | 'absent' | 'noRecord';

        if (rand < presentProbability) {
            status = 'present';
            totalPresent++;
        } else if (rand < presentProbability + 0.15) {
            status = 'late';
            totalLate++;
        } else {
            status = 'absent';
            totalAbsent++;
        }

        attendance[day] = {
            status,
            date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        };
    }

    return {
        id: `${locationId}-${shiftId}`,
        type: 'location',
        locationName,
        shiftInfo: {
            id: shiftId,
            name: shiftName,
            timeRange
        },
        attendance,
        summary: {
            totalPresent,
            totalLate,
            totalAbsent
        }
    };
};

// Generate mock data for employees
export const generateMockEmployees = (
    month: number = new Date().getMonth() + 1,
    year: number = new Date().getFullYear()
): EmployeeAttendance[] => {
    const employees = [
        { id: 'emp1', name: 'Oscar Sánchez' },
        { id: 'emp2', name: 'Fernando López' },
        { id: 'emp3', name: 'Tómas Lorenzo' },
        { id: 'emp4', name: 'Alejandro Flores' },
        { id: 'emp5', name: 'Bernardo Hérnandez' },
        { id: 'emp6', name: 'Humberto Morales' }
    ];

    return employees.map(emp =>
        generateMockEmployeeAttendance(emp.id, emp.name, month, year)
    );
};

// Generate mock data for locations with shifts
export const generateMockLocations = (
    month: number = new Date().getMonth() + 1,
    year: number = new Date().getFullYear()
): LocationAttendance[] => {
    const locations = [
        { id: 'loc1', name: 'Plaza Las Brisas' },
        { id: 'loc2', name: 'Arboledas' },
        { id: 'loc3', name: 'Plaza Cuauhtémoc' },
        { id: 'loc4', name: 'Plaza Vasconcelos' }
    ];

    const shifts = [
        { id: 'T1', name: 'T1: 06:00 - 14:00 hrs', timeRange: '06:00 - 14:00 hrs' },
        { id: 'T2', name: 'T2: 14:00 - 22:00 hrs', timeRange: '14:00 - 22:00 hrs' },
        { id: 'T3', name: 'T3: 22:00 - 06:00 hrs', timeRange: '22:00 - 06:00 hrs' }
    ];

    const result: LocationAttendance[] = [];

    // Ordenar por ubicación para que estén agrupadas
    locations.forEach(location => {
        shifts.forEach(shift => {
            result.push(generateMockLocationAttendance(
                location.id,
                location.name,
                shift.id,
                shift.name,
                shift.timeRange,
                month,
                year
            ));
        });
    });

    return result;
};

// Get data based on grouping mode
export const getMockData = (
    groupingMode: GroupingMode,
    month: number = new Date().getMonth() + 1,
    year: number = new Date().getFullYear()
): AttendanceRow[] => {
    if (groupingMode === 'employees') {
        return generateMockEmployees(month, year);
    } else {
        return generateMockLocations(month, year);
    }
};