import * as XLSX from 'xlsx';
import { HabitacionInspeccionada } from '../tables/habitacionesInspeccionadasColumns';

// ✅ Función para formatear fecha de manera segura
const formatSafeDate = (dateString: string): string => {
    if (!dateString) return 'N/A';

    try {
        // ✅ Diferentes formatos de fecha que pueden llegar del backend
        let date: Date;

        // Si ya incluye 'T' es ISO string
        if (dateString.includes('T')) {
            date = new Date(dateString);
        }
        // Si es formato YYYY-MM-DD
        else if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
            date = new Date(dateString + 'T00:00:00');
        }
        // Si es formato DD/MM/YYYY
        else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            const [day, month, year] = dateString.split('/');
            date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
        // Si es formato MM/DD/YYYY
        else if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
            date = new Date(dateString);
        }
        // Formato timestamp o número
        else if (!isNaN(Number(dateString))) {
            date = new Date(Number(dateString));
        }
        // Intentar parsearlo directamente
        else {
            date = new Date(dateString);
        }

        // ✅ Verificar si la fecha es válida
        if (isNaN(date.getTime())) {
            console.warn('Fecha inválida detectada:', dateString);
            return 'Fecha inválida';
        }

        // ✅ Formatear en español
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });

    } catch (error) {
        console.error('Error al formatear fecha:', dateString, error);
        return 'Error en fecha';
    }
};

export const exportToExcel = (
    data: HabitacionInspeccionada[],
    filename: string = 'habitaciones_inspeccionadas'
) => {
    try {
        // ✅ Formatear datos para Excel sin ID y con fechas seguras
        const excelData = data.map((habitacion) => ({
            'Hotel': habitacion.hotel || '',
            'Habitación': habitacion.habitacion || '',
            'Total Fallas': habitacion.total_fallas || 0,
            'Nombre Camarista': habitacion.nombre_camarista || '',
            'Calificación': habitacion.grade || 0,
            'Calificación (%)': habitacion.grade ? `${(habitacion.grade * 100).toFixed(1)}%` : '0.0%',
            'Estado': habitacion.total_fallas > 0 ? 'Con Fallas' : 'Sin Fallas',
            'Fecha Creación': formatSafeDate(habitacion.created_at),
        }));

        // ✅ Crear workbook y worksheet
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // ✅ Configurar ancho de columnas (sin ID)
        const columnWidths = [
            { width: 25 }, // Hotel
            { width: 15 }, // Habitación
            { width: 15 }, // Total Fallas
            { width: 20 }, // Nombre Camarista
            { width: 15 }, // Calificación
            { width: 18 }, // Calificación (%)
            { width: 15 }, // Estado
            { width: 18 }, // Fecha Creación
        ];
        worksheet['!cols'] = columnWidths;

        // ✅ Agregar worksheet al workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Habitaciones Inspeccionadas');

        // ✅ Generar y descargar archivo
        const now = new Date();
        const timestamp = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const fullFilename = `${filename}_${timestamp}.xlsx`;

        XLSX.writeFile(workbook, fullFilename);

        return true;
    } catch (error) {
        console.error('Error al exportar a Excel:', error);
        return false;
    }
};

// ✅ Función para exportar datos filtrados
export const exportFilteredData = (
    table: any, // React Table instance
    filename: string = 'habitaciones_filtradas'
) => {
    try {
        // Obtener solo las filas visibles (filtradas)
        const filteredRows = table.getFilteredRowModel().rows;
        const data = filteredRows.map((row: any) => row.original);

        return exportToExcel(data, filename);
    } catch (error) {
        console.error('Error al exportar datos filtrados:', error);
        return false;
    }
};