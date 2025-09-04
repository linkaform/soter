import React from 'react';
import { AttendanceStatus } from '../types/attendance';
import AttendanceIcon from './AttendanceIcon';

interface UserCellProps {
    status: AttendanceStatus;
    userName?: string | string[]; // Puede ser string o array
    isWeekend?: boolean;
}

const UserCell: React.FC<UserCellProps> = ({ status, userName, isWeekend }) => {
    // Convertir userName a array si es string
    const userArray = userName
        ? (Array.isArray(userName) ? userName : [userName])
        : [];

    // Función para generar un color basado en el nombre de usuario
    const getUserColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 45%)`;
    };

    // Generar iniciales del usuario (máximo 2 caracteres)
    const getInitials = (name: string) => {
        if (name.includes(' ')) {
            const parts = name.split(' ');
            if (parts.length >= 2) {
                return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
            }
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Umbral para mostrar solo el contador
    const USER_THRESHOLD = 2;

    return (
        <div className={`flex items-center justify-center p-1 ${isWeekend ? 'bg-blue-50' : 'bg-white'}`}>
            {/* Si hay usuarios, mostramos los círculos con iniciales */}
            {userArray.length > 0 && status !== 'noRecord' ? (
                <div className="relative flex items-center">
                    {/* Si hay más de USER_THRESHOLD usuarios, mostrar solo un contador */}
                    {userArray.length > USER_THRESHOLD ? (
                        <div
                            className="w-6 h-6 rounded-full flex items-center justify-center bg-indigo-600 text-white"
                        >
                            <span className="text-xs font-bold">
                                +{userArray.length}
                            </span>
                        </div>
                    ) : (
                        // Si hay 1 o 2 usuarios, mostrar sus círculos
                        userArray.map((user, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: getUserColor(user),
                                    marginLeft: index > 0 ? '-8px' : '0',
                                    zIndex: userArray.length - index,
                                    border: '1px solid white'
                                }}
                                className="w-6 h-6 rounded-full flex items-center justify-center relative"
                            >
                                <span className="text-xs text-white font-bold">
                                    {getInitials(user)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                /* Si no hay usuarios, mostramos solo el ícono de estado */
                <AttendanceIcon status={status} />
            )}
        </div>
    );
};

export default UserCell;