import React from 'react';
import { AttendanceStatus } from '../types/attendance';
import { Check, X, AlertTriangle, Clock, CircleMinus } from 'lucide-react';

interface AttendanceIconProps {
    status: AttendanceStatus;
}

const AttendanceIcon: React.FC<AttendanceIconProps> = ({ status }) => {
    switch (status) {
        case 'present':
            return (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                </div>
            );
        case 'late':
            return (
                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                    <AlertTriangle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
            );
        case 'absent':
            return (
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </div>
            );
        case 'absentTimeOff':
            return (
                <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                    <X className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                </div>
            );
        case 'noRecord':
            return (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300"></div>
            );
        case 'halfDay':
            return (
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
            );
        case 'notApplicable':
            return (
                <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
                    <CircleMinus className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
                </div>
            );
        default:
            return (
                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-300"></div>
            );
    }
};

export default AttendanceIcon;