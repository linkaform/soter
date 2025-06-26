import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { getHabitacion } from "../requests/peticiones";
import RoomCard from "../components/RoomCard"; // <-- Importa RoomCard

interface HabitacionInspeccionadaModalProps {
    title: string
    children: React.ReactNode
    hotel: string
    habitacion: string
}

export const HabitacionInspeccionadaModal: React.FC<HabitacionInspeccionadaModalProps> = ({
    title,
    children,
    hotel,
    habitacion,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (open) {
            setLoading(true);
            setData(null);
            getHabitacion({ hotel, roomId: habitacion })
                .then((res) => {
                    setData(res?.response?.data ?? []);
                })
                .catch((err) => {
                    console.log("Error al obtener habitacion:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [open, hotel, habitacion]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[98vw] md:max-w-5xl">
                <DialogHeader>
                    <DialogTitle className='text-2xl text-center font-bold my-5'>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    {loading && <div className="text-center py-8">Cargando...</div>}
                    {!loading && data && !data.error && (
                        <RoomCard roomData={data} />
                    )}
                    {!loading && data && data.error && (
                        <div className="text-center text-red-500">{data.error}</div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
