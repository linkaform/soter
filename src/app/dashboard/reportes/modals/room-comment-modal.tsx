import React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface RoomCommentImageModalProps {
    open: boolean;
    onClose: () => void;
    image: { name: string; url: string };
    falla: string;
    hotel: string;
    comment: string;
    room: string;
}

const RoomCommentImageModal: React.FC<RoomCommentImageModalProps> = ({
    open,
    onClose,
    image,
    falla,
    hotel,
    comment,
    room,
}) => (
    <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <div className="font-bold">Hotel: <span className="font-light">{hotel}</span></div>
                <DialogTitle className="text-xl font-bold text-red-500">{falla}</DialogTitle>
                <div className="text-gray-500 text-sm">{room}</div>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4">
                <Image
                    src={image.url}
                    alt={image.name}
                    width={400}
                    height={400}
                    className="object-contain bg-gray-200 rounded-lg"
                />
                <div className="text-gray-700">Comentario: {comment}</div>
            </div>
        </DialogContent>
    </Dialog>
);

export default RoomCommentImageModal;