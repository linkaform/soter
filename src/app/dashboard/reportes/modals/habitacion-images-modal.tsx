import React, { useEffect, useState, useMemo } from "react";
import HabitacionImageCarousel from "../components/HabitacionImageCarousel";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface HabitacionImagesModalProps {
    title: string;
    children?: React.ReactNode;
    roomData: any;
    initialImageUrl?: string | null;
    open: boolean;
    setOpen: (open: boolean) => void;
}

type ImageWithFalla = {
    url: string;
    name: string;
    falla?: string;
};

export const HabitacionImagesModal: React.FC<HabitacionImagesModalProps> = ({
    title,
    roomData,
    initialImageUrl,
    open,
    setOpen,
}) => {
    const [frozenImages, setFrozenImages] = useState<ImageWithFalla[]>([]);
    const [frozenInitialUrl, setFrozenInitialUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (open && roomData?.inspeccion?.media) {
            const fieldLabel = roomData.inspeccion.field_label || {};
            // media: { key: [ { file_url, ... }, ... ] }
            // fieldLabel: { key: "Nombre de la falla" }
            const imgs: ImageWithFalla[] = [];
            Object.entries(roomData.inspeccion.media).forEach(([key, arr]) => {
                if (Array.isArray(arr)) {
                    arr.forEach(img => {
                        if (img?.file_url) {
                            imgs.push({
                                url: img.file_url,
                                name: img.file_name || img.name || "",
                                falla: fieldLabel[key] || undefined,
                            });
                        }
                    });
                }
            });
            setFrozenImages(imgs);
            setFrozenInitialUrl(initialImageUrl || undefined);
        }
    }, [open, roomData, initialImageUrl]);

    const orderedImages = useMemo(() => {
        if (!frozenInitialUrl) return frozenImages;
        const idx = frozenImages.findIndex(img => img.url === frozenInitialUrl);
        if (idx === -1) return frozenImages;
        const rest = frozenImages.filter((img, i) => i !== idx);
        return [frozenImages[idx], ...rest];
    }, [frozenImages, frozenInitialUrl]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-[95vw] md:max-w-3xl">
                <DialogHeader>
                    <DialogTitle className='text-2xl text-center font-bold my-5'>
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <HabitacionImageCarousel images={orderedImages} />
                </div>
            </DialogContent>
        </Dialog>
    );
};
