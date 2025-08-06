import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Eye, Loader2 } from 'lucide-react';
import AuditCard from '../components/AuditCard';
import { getAuditoriaById, getInspeccionPDF } from '../requests/peticiones';

interface AuditDetailModalProps {
    children: React.ReactNode;
    auditId: string;
}

const AuditDetailModal: React.FC<AuditDetailModalProps> = ({
    children,
    auditId
}) => {
    const [open, setOpen] = useState(false);
    const [auditoriaData, setAuditoriaData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Función para cargar los datos de la auditoría
    const loadAuditoriaData = React.useCallback(async () => {
        if (!auditId || auditoriaData) return; // No cargar si ya tenemos los datos

        setLoading(true);
        setError(null);

        try {
            console.log('🔄 Cargando auditoría con ID:', auditId);
            const response = await getAuditoriaById(auditId);
            console.log('📄 Respuesta de la auditoría:', response);

            if (response?.auditoria) {
                setAuditoriaData(response.auditoria);
            } else {
                setError('No se pudo cargar la información de la auditoría');
            }
        } catch (err) {
            console.error('❌ Error cargando auditoría:', err);
            setError('Error al cargar los datos de la auditoría');
        } finally {
            setLoading(false);
        }
    }, [auditId, auditoriaData]);

    // Cargar datos cuando se abre el modal
    useEffect(() => {
        if (open && auditId && !auditoriaData) {
            loadAuditoriaData();
        }
    }, [open, auditId, auditoriaData, loadAuditoriaData]);

    // Limpiar datos cuando se cierra el modal
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            // Opcional: limpiar datos al cerrar para ahorrar memoria
            // setAuditoriaData(null);
        }
    };

    // Función para manejar descarga de PDF
    const handleDownloadReport = async (auditId: string) => {
        console.log('🔽 Iniciando descarga para audit ID:', auditId);

        try {
            const data = await getInspeccionPDF({ recordId: auditId });
            console.log('📄 Respuesta del PDF:', data);

            const downloadURL = data?.response?.response?.pdf?.data?.download_url ||
                data?.response?.data?.json?.download_url ||
                data?.download_url;

            if (downloadURL) {
                console.log('🔗 URL de descarga obtenida:', downloadURL);

                try {
                    const response = await fetch(downloadURL);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const blob = await response.blob();
                    const blobURL = URL.createObjectURL(blob);

                    const fileName = `Auditoria-${auditoriaData?.folio || 'sin-folio'}-${new Date().toISOString().split('T')[0]}.pdf`;

                    const link = document.createElement("a");
                    link.href = blobURL;
                    link.download = fileName;
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(blobURL);

                    console.log('✅ Descarga completada:', fileName);

                } catch (downloadError) {
                    console.error("❌ Error downloading PDF blob:", downloadError);
                    alert("Error al descargar el archivo PDF. Por favor, inténtalo de nuevo.");
                }
            } else {
                console.error("❌ No se encontró URL de descarga en la respuesta");
                alert("No se pudo generar el PDF. El servidor no devolvió una URL válida.");
            }
        } catch (apiError) {
            console.error("❌ Error fetching audit PDF:", apiError);
            alert("Error al conectar con el servidor para generar el reporte PDF.");
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin mb-4" />
                    <p>Cargando información de la auditoría...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-red-500">
                    <Eye className="w-8 h-8 mb-4" />
                    <p>{error}</p>
                    <button
                        onClick={loadAuditoriaData}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        if (!auditoriaData) {
            return (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <Eye className="w-8 h-8 mb-4" />
                    <p>No se encontró información de la auditoría</p>
                </div>
            );
        }

        return (
            <AuditCard
                auditData={auditoriaData}
                onDownloadReport={handleDownloadReport}
                onImageModal={(imageUrl, auditData) => {
                    console.log('Abrir modal con imagen:', imageUrl, auditData);
                }}
            />
        );
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-6">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
                        <Eye className="w-6 h-6 text-blue-600" />
                        Detalle de Auditoría {auditoriaData?.folio ? `- ${auditoriaData.folio}` : ''}
                    </DialogTitle>
                </DialogHeader>

                {/* Contenedor con scroll para AuditCard */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <div className="h-full overflow-y-auto pr-2">
                        {renderContent()}
                    </div>
                </div>

                {/* Footer con información adicional si hay datos */}
                {auditoriaData && (
                    <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">
                                    📋 {auditoriaData.folio || 'Sin folio'}
                                </span>
                                <span>
                                    📍 {auditoriaData.zona || 'Sin zona'}
                                </span>
                            </div>
                            <div className="text-xs">
                                🗓️ {auditoriaData.created_at || 'Sin fecha'}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AuditDetailModal;