import React from 'react'
import AttendanceIcon from './AttendanceIcon'
import { AttendanceStatus } from '../types/attendance';
import { Button } from "@/components/ui/button";

const STATUS_OPTIONS = [
  { key: "present", label: "Asistencia" },
  { key: "halfDay", label: "Retardo" },
  { key: "absentTimeOff", label: "Retardo máximo excedido" },
  { key: "absent", label: "Falta" },
  { key: "noRecord", label: "Sin registro" },
];

interface AttendanceSymbologicProps {
  selectedStatus: string[];
  onChange: (status: string[]) => void;
}

const AttendanceSymbologic: React.FC<AttendanceSymbologicProps> = ({
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
        <Button
          key={opt.key}
          variant={selectedStatus.includes(opt.key) ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-2 rounded-full px-3 py-1"
          onClick={() => handleToggle(opt.key)}
        >
          <AttendanceIcon status={opt.key as AttendanceStatus} />
          <span className="text-xs">{opt.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default AttendanceSymbologic;