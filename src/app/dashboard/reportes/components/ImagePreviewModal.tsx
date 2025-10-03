import React from "react";
import { Dialog, DialogContent, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImagePreviewModalProps {
    open: boolean;
    onClose: () => void;
    src: string;
    alt?: string;
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    open,
    onClose,
    src,
    alt = "Vista previa",
}) => (
    <Dialog open={open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
        <DialogContent className="max-w-2xl flex flex-col items-center">
            <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            <span className="text-3xl">🧑‍✈️</span>
                        </div>
                    </div>
                </DialogTitle>
            </DialogHeader>
            <div className="w-full flex justify-center">
                <Image
                    src={src}
                    alt={alt}
                    width={600}
                    height={400}
                    className="rounded-lg object-contain max-h-[70vh] w-auto h-auto"
                />
            </div>
            <DialogClose asChild>
                <Button variant="outline" className="mt-4 w-full" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogClose>
        </DialogContent>
    </Dialog>
);

export default ImagePreviewModal;