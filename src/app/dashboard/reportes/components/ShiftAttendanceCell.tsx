import React, { useState, useEffect } from "react";
import EmployeeAttendanceDetailModal from "./EmployeeAttendanceDetailModal";
import { useAttendanceDetail } from "../hooks/useAsistenciasReport";

interface ShiftAttendanceCellProps {
  status: string;
  userNames: string[];
  attendanceData?: any[];
  shift?: string;
}

const statusColors: Record<string, string> = {
  present: "bg-green-500 text-white",
  halfDay: "bg-blue-500 text-white",
  absentTimeOff: "bg-yellow-400 text-black",
  absent: "bg-red-700 text-white",
  dayOff: "bg-gray-300 text-gray-700",
  noRecord: "bg-gray-100 text-gray-400",
};

function getAbbreviation(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ShiftAttendanceCell: React.FC<ShiftAttendanceCellProps> = ({ status, userNames, attendanceData, shift }) => {
  const colorClass = statusColors[status] || "bg-gray-100 text-gray-400";
  const maxVisible = 2;
  const visibleNames = userNames.slice(0, maxVisible);
  const extraCount = userNames.length - maxVisible;
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);

  const { attendanceDetail, isLoadingAttendanceDetail, refetchAttendanceDetail } = useAttendanceDetail({
    enabled: modalOpen,
    ids: attendanceData || [],
  });

  const handleOpenModal = async () => {
    setPendingOpen(true);
    await refetchAttendanceDetail(); // o los datos necesarios
  };

  useEffect(() => {
    if (pendingOpen && attendanceDetail && !isLoadingAttendanceDetail) {
      setModalOpen(true);
      setPendingOpen(false);
    }
  }, [pendingOpen, attendanceDetail, isLoadingAttendanceDetail]);

  return (
    <div className="flex items-center justify-center relative min-h-[10px] min-w-[28px]">
      {visibleNames.map((name, idx) => (
        <span
          key={idx}
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] ${colorClass} border border-white shadow absolute cursor-pointer`}
          style={
            visibleNames.length > 1
              ? { left: `${idx * 12}px`, zIndex: 10 - idx }
              : { position: "static" }
          }
          title={name}
          onClick={handleOpenModal}
        >
          {getAbbreviation(name)}
        </span>
      ))}
      {extraCount > 0 && (
        <span
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] ${colorClass} border border-white shadow absolute`}
          style={{
            left: `${maxVisible * 12}px`,
            zIndex: 10 - maxVisible,
          }}
          title={userNames.slice(maxVisible).join(", ")}
        >
          +{extraCount}
        </span>
      )}
      {userNames.length === 0 && (
        <span
          className={`flex items-center justify-center rounded-full h-7 w-7 font-bold text-[10px] ${colorClass} border border-white shadow`}
        >
          -
        </span>
      )}
      {/* Modal de detalle fuera del map */}
      <EmployeeAttendanceDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attendanceData={attendanceDetail}
        shift={shift}
      />
    </div>
  );
};

export default ShiftAttendanceCell;