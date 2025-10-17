import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare } from 'lucide-react';
import CommentsSection from '../components/CommentsSection';
import { FallaDetalle } from '../utils/dataProcessors';

interface CommentsModalProps {
    children: React.ReactNode;
    auditData: any;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
    children,
    auditData
}) => {
    const [open, setOpen] = useState(false);

    // Función para formatear auditData al formato FallaDetalle (similar a AuditCard)
    const formatAuditDataToFallaDetalle = (auditData: any): FallaDetalle[] => {
        if (!auditData?.audit?.[0]) return [];

        const audit = auditData.audit[0];
        const fieldLabel = audit.field_label || {};
        const comments = audit.comments || {};
        const media = audit.media || {};

        const fallasDetalle: FallaDetalle[] = [];

        Object.keys(fieldLabel).forEach(fallaId => {
            const falla = fieldLabel[fallaId];
            const comentario = comments[fallaId] || '';
            const mediaArray = media[fallaId] || [];

            // Solo incluir fallas que tengan comentarios
            if (!comentario || comentario.trim().length === 0) return;

            // Extraer URLs de imágenes
            const imagenes: string[] = [];
            if (Array.isArray(mediaArray)) {
                mediaArray.forEach(mediaItem => {
                    if (mediaItem.file_url) {
                        imagenes.push(mediaItem.file_url);
                    }
                });
            }

            // Crear FallaDetalle
            const fallaDetalle: FallaDetalle = {
                id: fallaId,
                falla: falla,
                comentario: comentario,
                imagenes: imagenes,
                folio: auditData.folio || 'Sin folio',
                fecha: auditData.created_at || '',
                estado: auditData.zona || 'Sin zona',
                nes: Array.isArray(auditData.nes) ? auditData.nes[0]?.toString() || 'Sin NES' : 'Sin NES'
            };

            fallasDetalle.push(fallaDetalle);
        });

        return fallasDetalle;
    };

    const fallasConComentarios = formatAuditDataToFallaDetalle(auditData);
    const folio = auditData?.folio || 'Sin folio';

    // Si no hay comentarios, no mostrar nada
    if (fallasConComentarios.length === 0) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden p-6">
                <DialogHeader className="flex-shrink-0 pb-4">
                    <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
                        <MessageSquare className="w-6 h-6 text-yellow-600" />
                        Comentarios de la Auditoría - {folio}
                    </DialogTitle>
                </DialogHeader>

                {/* Contenedor con scroll para CommentsSection */}
                <div className="flex-1 min-h-0 overflow-hidden">
                    <div className="h-full overflow-y-auto pr-2">
                        <CommentsSection
                            fallasDetalle={fallasConComentarios}
                            isLoading={false}
                            states={[]} // No necesitamos filtros en el modal
                            fallas={[]} // No necesitamos filtros en el modal
                        />
                    </div>
                </div>

                {/* Footer con información resumida */}
                <div className="flex-shrink-0 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">
                                {fallasConComentarios.length} comentario(s)
                            </span>
                            <span>
                                {fallasConComentarios.reduce((sum, falla) => sum + falla.imagenes.length, 0)} imagen(es)
                            </span>
                        </div>
                        <div className="text-xs">
                            {auditData?.created_at || 'Sin fecha'}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CommentsModal;