import React from "react";

interface CalendarDaysProps {
  diasDisponibles: string | string[]; // Un array de cadenas (días de la semana)
}

const CalendarDays: React.FC<CalendarDaysProps> = ({ diasDisponibles })=> {
  const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  return (
    <>
      <p className="font-bold">Días disponibles:</p>

      <div className="grid grid-cols-7 gap-x-2 text-center">
        {dias.map((day, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              diasDisponibles.includes(day) // Si el día está seleccionado, se marca
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {day.charAt(0).toUpperCase()} {/* Capitaliza el primer caracter */}
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarDays;
