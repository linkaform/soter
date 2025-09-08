import React from 'react';
import { AttendanceStatus } from '../types/attendance';
import AttendanceIcon from './AttendanceIcon';

interface AttendanceCellProps {
    status: AttendanceStatus;
    isWeekend?: boolean;
}

const AttendanceCell: React.FC<AttendanceCellProps> = ({ status, isWeekend }) => {
    const getBgColor = () => {
        if (isWeekend) return 'bg-blue-50';
        return 'bg-white';
    };

    return (
        <div className={`flex items-center justify-center p-1 ${getBgColor()}`}>
            <AttendanceIcon status={status} />
        </div>
    );
};

export default AttendanceCell;