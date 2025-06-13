import {
    BedDouble,
    FileDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getHabitacionPDF } from "../requests/peticiones";

interface RoomCardProps {
    roomData: any;
}

const RoomCard = ({ roomData }: RoomCardProps) => {
    const [downloading, setDownloading] = useState(false);
    const recordId = roomData?._id || '';

    // Extrae todas las urls de media
    const media = roomData?.inspeccion?.media || {};
    const allMediaUrls: string[] = Object.values(media)
        .flatMap((arr: any) =>
            Array.isArray(arr)
                ? arr.map((item: any) => item.file_url).filter(Boolean)
                : []
        );

    // Estado para los índices de las 4 imágenes de la grilla
    const [imgIndexes, setImgIndexes] = useState([0, 1, 2, 3]);

    // Actualiza las 4 imágenes al mismo tiempo, todas diferentes si es posible
    const allMediaUrlsLength = allMediaUrls.length;
    const allMediaUrlsJoined = allMediaUrls.join(",");

    useEffect(() => {
        if (allMediaUrlsLength <= 4) {
            // Si hay 4 o menos, solo muestra las que hay
            setImgIndexes([0, 1, 2, 3]);
            return;
        }
        const interval = setInterval(() => {
            const newIndexes: number[] = [];
            while (newIndexes.length < 4) {
                const idx = Math.floor(Math.random() * allMediaUrlsLength);
                if (!newIndexes.includes(idx)) {
                    newIndexes.push(idx);
                }
            }
            setImgIndexes(newIndexes);
        }, 4000);
        return () => clearInterval(interval);
    }, [allMediaUrlsLength, allMediaUrlsJoined]); // join para detectar cambios en urls

    if (!roomData) return null;

    const nombreHabitacion = roomData.habitacion || '';
    const nombreCamarista = roomData.nombre_camarista || '';
    const ultimaActualizacion = roomData.updated_at || '';
    const habitacionRemodelada = roomData.habitacion_remodelada
        ? roomData.habitacion_remodelada.charAt(0).toUpperCase() + roomData.habitacion_remodelada.slice(1)
        : '';
    const inspector = roomData.created_by_name || '';
    const fieldLabel = roomData?.inspeccion?.field_label || {};
    const fallas = Object.entries(fieldLabel).map(([key, value]) => ({
        id: key,
        nombre: value,
    }));

    const handleHabitacionPDFClick = (recordId: string) => {
        if (downloading) return;
        setDownloading(true);
        const fetchHabitacionPDF = async () => {
            try {
                const data = await getHabitacionPDF({
                    recordId: recordId,
                });
                const downloadURL = data?.response?.data?.json?.download_url;
                if (downloadURL) {
                    try {
                        const response = await fetch(downloadURL);
                        const blob = await response.blob();
                        const blobURL = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = blobURL;
                        link.download = `Inspeccion de ${nombreHabitacion || 'habitacion_inspeccion'}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(blobURL);
                    } catch (err) {
                        console.error("Error downloading PDF blob:", err);
                    }
                }
            } catch (err) {
                console.error("Error fetching habitacion PDF:", err);
            } finally {
                setDownloading(false);
            }
        };
        fetchHabitacionPDF();
    };

    return (
        <div className="flex w-full h-80 gap-4">
            <div className="w-2/5 flex items-center justify-center">
                <div className="grid grid-cols-2 grid-rows-2 gap-2 w-full h-full">
                    {[0, 1, 2, 3].map(idx => (
                        <Image
                            key={idx}
                            width={100}
                            height={100}
                            src={
                                allMediaUrls.length === 0
                                    ? "/nouser.svg"
                                    : allMediaUrls[imgIndexes[idx]] || "/nouser.svg"
                            }
                            alt="Imagen"
                            className="w-full h-full bg-gray-200 rounded-lg object-cover"
                        />
                    ))}
                </div>
            </div>
            <div className="w-3/5">
                <ScrollArea className="w-full h-full">
                    <div className="p-4 flex flex-col gap-6">
                        <div className="flex justify-between">
                            <div className="text-2xl font-semibold">{nombreHabitacion}</div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => handleHabitacionPDFClick(recordId)}
                                    disabled={downloading}
                                    className={`p-2 rounded ${downloading ? "opacity-50 cursor-not-allowed" : "bg-slate-950 hover:bg-slate-700"}`}
                                    title="Descargar PDF"
                                >
                                    <FileDown />
                                </Button>
                                <Badge variant={fallas.length > 0 ? 'destructive' : 'outline'}>
                                    {fallas.length > 0 ? 'Fallas' : 'Sin fallas'}
                                </Badge>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            <div className="flex gap-2"><BedDouble />Remodelada: {habitacionRemodelada}</div>
                            <div className="flex gap-2"><BedDouble />Ultima inspeccion: {ultimaActualizacion}</div>
                            <div className="flex gap-2"><BedDouble />Camarista: {nombreCamarista}</div>
                            <div className="flex gap-2"><BedDouble />Inspector: {inspector}</div>
                        </div>
                        {fallas.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                <div>Fallas de la habitacion: {fallas.length}</div>
                                <div className="grid grid-cols-2 gap-2">
                                    {fallas.map((falla) => (
                                        <div key={falla.id}>
                                            <Badge variant="outline" className="bg-blue-100 w-full text-left">
                                                {String(falla.nombre)}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default RoomCard;