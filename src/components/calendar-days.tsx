import React from "react";
import { Label } from "./ui/label";

const CalendarDays = () => {
  return (
    <>
      <Label>Dias disponible:</Label>

      <div className="grid grid-cols-7  gap-x-2 text-center">
        {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
          <div
            key={i}
            className={`p-3 rounded ${
              ["L", "M", "M", "J"].includes(day)
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </>
  );
};

export default CalendarDays;
