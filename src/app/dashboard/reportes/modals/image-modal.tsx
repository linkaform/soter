import React, { useState, useMemo } from 'react'
import SimpleCarrousel from '../components/SimpleCarrousel';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'

interface ImageModalProps {
    title: string
    children: React.ReactNode
    imgData: any
    carrouselData?: any[]
}

export const ImageModal: React.FC<ImageModalProps> = ({
    title,
    children,
    imgData,
    carrouselData = []
}) => {
    const [open, setOpen] = useState(false);

    // Reordena el array para que imgData esté primero
    const orderedData = useMemo(() => {
        if (!imgData || !carrouselData?.length) return carrouselData;
        const idx = carrouselData.findIndex(
            (item) =>
                item.image?.url === imgData.image?.url
        );
        if (idx === -1) return carrouselData;
        return [carrouselData[idx], ...carrouselData.slice(0, idx), ...carrouselData.slice(idx + 1)];
    }, [imgData, carrouselData]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-[95vw] md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className='text-2xl text-center font-bold my-5'>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <SimpleCarrousel data={orderedData} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
