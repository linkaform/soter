import { Auditoria } from "@/app/dashboard/reportes/tables/auditoriasColumns";

export const processAuditoriasData = (tableSection: any[]): Auditoria[] => {
    const auditorias: Auditoria[] = [];

    tableSection?.forEach(section => {
        section.audits?.forEach((audit: any) => {
            auditorias.push({
                created_at: section.created_at,
                state: section.state,
                label: section.label,
                aciertos: audit.aciertos || 0,
                fallas: audit.fallas || 0,
                obtained_points: audit.obtained_points || 0,
                folio: audit.folio,
                grade: audit.grade,
                max_points: audit.max_points,
                _id: section._id
            });
        });
    });

    return auditorias;
};

export interface FallaDetalle {
    id: string;
    nes?: any;
    falla: string;
    comentario?: string | undefined;
    fecha?: string | undefined;
    imagenes: string[];
    folio?: string | undefined;
    estado?: string | undefined;
}

export const processFallasDetalle = (tableSection: any[]): FallaDetalle[] => {
    const fallasDetalle: FallaDetalle[] = [];

    if (!tableSection || !Array.isArray(tableSection)) {
        return fallasDetalle;
    }

    tableSection.forEach((section) => {
        const sectionData = {
            fecha: section.created_at,
            estado: section.state,
            nes: section.label
        };

        if (section.audits && Array.isArray(section.audits)) {
            section.audits.forEach((audit: any) => {
                const fieldLabel = audit.field_label || {};
                const comments = audit.comments || {};
                const media = audit.media || {};

                Object.keys(fieldLabel).forEach(fallaId => {
                    const falla = fieldLabel[fallaId];
                    const comentario = comments[fallaId] || '';
                    const mediaArray = media[fallaId] || [];

                    const imagenes: string[] = [];
                    if (Array.isArray(mediaArray)) {
                        mediaArray.forEach(mediaItem => {
                            if (mediaItem.file_url) {
                                imagenes.push(mediaItem.file_url);
                            }
                        });
                    }

                    if (falla) {
                        const fallaDetalle: FallaDetalle = {
                            id: fallaId,
                            falla: falla,
                            comentario: comentario,
                            imagenes: imagenes,
                            folio: audit.folio,
                            fecha: sectionData.fecha,
                            estado: sectionData.estado,
                            nes: sectionData.nes
                        };

                        fallasDetalle.push(fallaDetalle);
                    }
                });
            });
        }
    });

    return fallasDetalle;
};