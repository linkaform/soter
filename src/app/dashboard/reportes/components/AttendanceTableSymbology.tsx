import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_OPTIONS = [
  { key: "asistencia", label: "Asistencia", icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
  { key: "retardo", label: "Retardo", icon: <Clock className="w-4 h-4 text-blue-500" /> },
  { key: "falta", label: "Falta", icon: <XCircle className="w-4 h-4 text-red-500" /> },
  { key: "falta_por_retardo", label: "Falta por retardo", icon: <XCircle className="w-4 h-4 text-yellow-500" /> },
];

interface AttendanceTableSymbologyProps {
  selectedStatus: string[];
  onChange: (status: string[]) => void;
}

const AttendanceTableSymbology: React.FC<AttendanceTableSymbologyProps> = ({
  selectedStatus,
  onChange,
}) => {
  const handleToggle = (key: string) => {
    if (selectedStatus.includes(key)) {
      onChange(selectedStatus.filter(s => s !== key));
    } else {
      onChange([...selectedStatus, key]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      {STATUS_OPTIONS.map(opt => (
        <button
          key={opt.key}
          type="button"
          className={`flex items-center gap-2 rounded-full px-3 py-1 border transition
            ${selectedStatus.includes(opt.key)
              ? "bg-blue-600 text-white border-blue-600 shadow"
              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}
          `}
          onClick={() => handleToggle(opt.key)}
        >
          {opt.icon}
          <span className="text-xs">{opt.label}</span>
          <span className={`ml-1 w-3 h-3 rounded border ${selectedStatus.includes(opt.key) ? "bg-blue-400 border-blue-600" : "bg-white border-gray-300"}`}></span>
        </button>
      ))}
    </div>
  );
};

export default AttendanceTableSymbology;