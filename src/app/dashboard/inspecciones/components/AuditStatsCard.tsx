import React from 'react';
import ProgressBar from './ProgressBar';
import { Trophy, Flag, Star, TrendingUp, TrendingDown } from 'lucide-react';

interface AuditStatsCardProps {
    title: string;
    data: {
        label?: string;
        aciertos?: number;
        fallas?: number;
        cantidad_auditorias?: number;
        obtained_points?: number;
        max_points?: number;
        [key: string]: any;
    };
    type?: 'best' | 'worst' | 'average' | 'custom';
    customIcon?: React.ReactNode;
    customColor?: string;
    className?: string;
    showProgressBar?: boolean;
    additionalStats?: Array<{
        label: string;
        value: string | number;
        icon?: React.ReactNode;
    }>;
}

const AuditStatsCard: React.FC<AuditStatsCardProps> = ({
    title,
    data,
    type = 'custom',
    customIcon,
    customColor,
    className = '',
    showProgressBar = true,
    additionalStats = []
}) => {
    // Configuración por tipo
    const getTypeConfig = () => {
        switch (type) {
            case 'best':
                return {
                    icon: <Trophy className="w-5 h-5 text-green-600" />,
                    progressColor: 'bg-green-500',
                    badgeColor: 'bg-green-100 text-green-800 border-green-300',
                    headerColor: 'text-green-700'
                };
            case 'worst':
                return {
                    icon: <Flag className="w-5 h-5 text-red-600" />,
                    progressColor: 'bg-red-500',
                    badgeColor: 'bg-red-100 text-red-800 border-red-300',
                    headerColor: 'text-red-700'
                };
            case 'average':
                return {
                    icon: <Star className="w-5 h-5 text-blue-600" />,
                    progressColor: 'bg-blue-500',
                    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
                    headerColor: 'text-blue-700'
                };
            default:
                return {
                    icon: customIcon || <TrendingUp className="w-5 h-5 text-gray-600" />,
                    progressColor: customColor || 'bg-gray-500',
                    badgeColor: 'bg-gray-100 text-gray-800 border-gray-300',
                    headerColor: 'text-gray-700'
                };
        }
    };

    const config = getTypeConfig();

    // Calcular porcentaje basado en obtained_points
    // Asumiendo que el máximo es 100 si no se proporciona max_points
    const maxPoints = data?.max_points || 100;
    const obtainedPoints = data?.obtained_points || 0;
    const percentage = Math.round((obtainedPoints / maxPoints) * 100);

    // Determinar el estado basado en el porcentaje
    const getStatusIcon = () => {
        if (percentage >= 80) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (percentage >= 60) return <Star className="w-4 h-4 text-yellow-600" />;
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    };

    return (
        <div className={`border p-4 rounded-lg w-full flex flex-col gap-4 hover:shadow-lg transition-shadow ${className}`}>
            {/* Header con icono y título */}
            <div className="flex items-center gap-2">
                {config.icon}
                <div className={`font-semibold ${config.headerColor}`}>{title}</div>
            </div>

            {/* Información principal */}
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    {/* Label/ID de la auditoría */}
                    {data?.label && (
                        <div className="font-semibold text-lg">Area: {data.label}</div>
                    )}

                    {/* Estadísticas principales */}
                    <div className="text-gray-500 text-sm mt-1">
                        {[
                            data?.cantidad_auditorias && `${data.cantidad_auditorias} auditorías`,
                            data?.fallas !== undefined && `${data.fallas} fallas`,
                            data?.aciertos !== undefined && `${data.aciertos} aciertos`
                        ].filter(Boolean).join(', ')}
                    </div>

                    {/* Puntuación obtenida */}
                    {data?.obtained_points !== undefined && (
                        <div className="text-sm text-gray-600 mt-1">
                            Puntuación: <span className="font-medium">{data.obtained_points.toFixed(2)} pts</span>
                        </div>
                    )}

                    {/* Estadísticas adicionales */}
                    {additionalStats.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {additionalStats.map((stat, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs text-gray-600">
                                    {stat.icon}
                                    <span>{stat.label}: </span>
                                    <span className="font-medium">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Badge de porcentaje */}
                <div className="flex flex-col items-center gap-2">
                    <div className={`px-3 py-2 rounded-full border font-medium ${config.badgeColor}`}>
                        <div className="flex items-center gap-1">
                            {getStatusIcon()}
                            {percentage}%
                        </div>
                    </div>

                    {/* Ratio de fallas/aciertos */}
                    {(data?.fallas !== undefined && data.aciertos !== undefined) && (
                        <div className="text-xs text-gray-500 text-center">
                            Ratio: {data.aciertos}:{data.fallas}
                        </div>
                    )}
                </div>
            </div>

            {/* Barra de progreso */}
            {showProgressBar && (
                <div>
                    <ProgressBar value={percentage} color={config.progressColor} />
                </div>
            )}

            {/* Información de detalle */}
            <div className="grid grid-cols-3 gap-2 text-xs bg-gray-50 p-2 rounded">
                <div className="text-center">
                    <div className="font-medium text-green-600">{data?.aciertos || 0}</div>
                    <div className="text-gray-500">Aciertos</div>
                </div>
                <div className="text-center">
                    <div className="font-medium text-red-600">{data?.fallas || 0}</div>
                    <div className="text-gray-500">Fallas</div>
                </div>
                <div className="text-center">
                    <div className="font-medium text-blue-600">{data?.cantidad_auditorias || 0}</div>
                    <div className="text-gray-500">Auditorías</div>
                </div>
            </div>
        </div>
    );
};

export default AuditStatsCard;