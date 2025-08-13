import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import HotelProgressTable from '../tables/HotelProgressTable';
import { HotelProgress } from '../tables/hotelProgressColumns';

interface HotelProgressModalProps {
    children: React.ReactNode
    hotelData: HotelProgress[]
}

export const HotelProgressModal: React.FC<HotelProgressModalProps> = ({
    children,
    hotelData,
}) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[90vw] md:max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle className='text-2xl text-center font-bold my-4'>
                        📊 Progreso de Inspecciones por Hotel
                    </DialogTitle>
                    <div className="text-center text-gray-600 mb-4">
                        Porcentaje de avance de inspecciones por hotel
                    </div>
                </DialogHeader>
                <div className="overflow-hidden">
                    <HotelProgressTable hoteles={hotelData} />
                </div>
            </DialogContent>
        </Dialog>
    )
}