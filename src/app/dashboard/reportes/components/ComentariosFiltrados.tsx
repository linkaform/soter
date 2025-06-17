import React, { useState, useMemo } from "react";
import HotelComments from "./HotelComments";
import { ScrollArea } from "@/components/ui/scroll-area";
import Multiselect from "multiselect-react-dropdown";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

interface ComentarioRaw {
    hotel: string | null;
    habitacion: string;
    comments: Record<string, string>;
    media: Record<string, any[]>;
    field_label: Record<string, string>;
}

interface ComentariosFiltradosProps {
    hotelesComentarios: ComentarioRaw[];
}

const ALL = "__all__";

const getPiso = (habitacion: string) => {
    const match = habitacion?.match(/(\d{2,4})/);
    if (!match) return null;
    const numero = match[1];
    return numero.length === 3
        ? numero[0]
        : numero.length === 4
            ? numero.slice(0, 2)
            : null;
};

const getNumeroHabitacion = (habitacion: string) => {
    const match = habitacion?.match(/(\d{2,4})/);
    return match ? match[1] : null;
};

const ComentariosFiltrados: React.FC<ComentariosFiltradosProps> = ({ hotelesComentarios }) => {
    const [filtroPiso, setFiltroPiso] = useState<string>(ALL);
    const [filtroHabitacion, setFiltroHabitacion] = useState<string>(ALL);
    const [selectedFallas, setSelectedFallas] = useState<string[]>([]);

    // Pisos ordenados ascendente
    const pisos = useMemo(() => {
        return Array.from(
            new Set(
                hotelesComentarios
                    .map(item => getPiso(item.habitacion))
                    .filter(Boolean)
            )
        ).sort((a, b) => Number(a) - Number(b));
    }, [hotelesComentarios]);

    // Habitaciones filtradas por piso seleccionado
    const habitaciones = useMemo(() => {
        let habitacionesFiltradas = hotelesComentarios
            .map(item => getNumeroHabitacion(item.habitacion))
            .filter(Boolean) as string[];
        if (filtroPiso !== ALL) {
            habitacionesFiltradas = habitacionesFiltradas.filter(num => num.startsWith(filtroPiso));
        }
        // Ordena habitaciones numéricamente
        return Array.from(new Set(habitacionesFiltradas)).sort((a, b) => Number(a) - Number(b));
    }, [hotelesComentarios, filtroPiso]);

    const fallas = useMemo(
        () =>
            Array.from(
                new Set(
                    hotelesComentarios.flatMap(item =>
                        Object.values(item.field_label || {})
                    ).filter(Boolean)
                )
            ),
        [hotelesComentarios]
    );

    // Filtrado
    const comentariosFiltrados = useMemo(() => {
        return hotelesComentarios.filter(item => {
            const numHabitacion = getNumeroHabitacion(item.habitacion);
            if (filtroHabitacion !== ALL && numHabitacion !== filtroHabitacion) return false;
            if (filtroPiso !== ALL) {
                const piso = getPiso(item.habitacion);
                if (piso !== filtroPiso) return false;
            }
            if (selectedFallas.length > 0) {
                const fieldLabels = Object.values(item.field_label || {});
                if (!selectedFallas.some(falla => fieldLabels.includes(falla))) return false;
            }
            return true;
        });
    }, [hotelesComentarios, filtroPiso, filtroHabitacion, selectedFallas]);

    // Agrupa los comentarios filtrados por hotel
    const hotelesComentariosFiltradosArr = useMemo(() => {
        const agrupados: Record<string, any[]> = {};
        comentariosFiltrados.forEach((item: any) => {
            const hotel = item.hotel;
            if (!hotel) return;
            if (!agrupados[hotel]) agrupados[hotel] = [];
            const commentsObj = item.comments || {};
            const mediaObj = item.media || {};
            const fieldLabelObj = item.field_label || {};
            const habitacion = item.habitacion || "";
            Object.entries(commentsObj).forEach(([commentId, commentText]) => {
                const fallaNombre = fieldLabelObj[commentId] || "";
                // Si hay fallas seleccionadas, solo muestra los comentarios que tengan esa falla
                if (selectedFallas.length > 0 && !selectedFallas.includes(fallaNombre)) return;
                const imagesArr = Array.isArray(mediaObj[commentId])
                    ? mediaObj[commentId].map((img: any) => ({
                        name: img.file_name || img.name || "",
                        url: img.file_url,
                    }))
                    : [];
                agrupados[hotel].push({
                    falla: fallaNombre,
                    comment: commentText as string,
                    room: habitacion,
                    images: imagesArr,
                });
            });
        });
        return Object.entries(agrupados).map(([hotel, comments]) => ({
            hotel,
            comments,
        }));
    }, [comentariosFiltrados, selectedFallas]);

    return (
        <div>
            <div className="flex gap-2 mb-4 flex-wrap">
                <Select value={filtroPiso} onValueChange={setFiltroPiso}>
                    <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Todos los pisos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Todos los pisos</SelectItem>
                        {pisos
                            .filter((piso): piso is string => piso !== null)
                            .map(piso => (
                                <SelectItem key={piso} value={piso}>{piso}</SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <Select value={filtroHabitacion} onValueChange={setFiltroHabitacion}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Todas las habitaciones" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={ALL}>Todas las habitaciones</SelectItem>
                        {habitaciones.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div className="min-w-[220px]">
                    <Multiselect
                        options={fallas}
                        isObject={false}
                        placeholder="Fallas"
                        selectedValues={selectedFallas}
                        onSelect={setSelectedFallas}
                        onRemove={setSelectedFallas}
                        showCheckbox
                        style={{
                            chips: { background: "#2563eb" },
                            multiselectContainer: { color: "#000" },
                        }}
                    />
                </div>
            </div>
            <div className="h-[56rem]">
                <ScrollArea className="w-full h-full">
                    {hotelesComentariosFiltradosArr.length === 0 ? (
                        <div className="text-center text-gray-400 my-8">No hay comentarios con estos filtros.</div>
                    ) : (
                        hotelesComentariosFiltradosArr.map(({ hotel, comments }) => (
                            <HotelComments key={hotel} hotel={hotel} comments={comments} />
                        ))
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

export default ComentariosFiltrados;