import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FallaImagesModalProps {
    open: boolean;
    onClose: () => void;
    fallaId: string;
    fallaNombre?: string;
    mediaAccionesCorrectivas: Record<string, any>;
    commentsAccionesCorrectivas: Record<string, any>;
}

const FallaImagesModal: React.FC<FallaImagesModalProps> = ({
    open,
    onClose,
    fallaId,
    fallaNombre,
    mediaAccionesCorrectivas,
    commentsAccionesCorrectivas,
}) => {
    // Extrae imágenes de antes y después
    const media = mediaAccionesCorrectivas?.[fallaId] || {};
    const beforeImage = Array.isArray(media.before) && media.before[0] ? media.before[0] : null;
    const afterImage = Array.isArray(media.after) && media.after[0] ? media.after[0] : null;

    // Extrae comentarios
    const comments = commentsAccionesCorrectivas?.[fallaId] || {};
    const beforeComment = comments.before || "";
    const afterComment = comments.after || "";

    return (
        <Dialog open={open} onOpenChange={(open) => (!open ? onClose() : undefined)}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>
                        Falla reportada
                        {fallaNombre ? `: ${fallaNombre}` : ""}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-8 justify-center items-start mt-4">
                    {/* Imagen antes */}
                    <div className="flex flex-col items-center w-1/2">
                        <div className="w-full flex justify-center">
                            {beforeImage ? (
                                <Image
                                    src={beforeImage.file_url}
                                    alt={beforeImage.file_name || "Antes"}
                                    width={350}
                                    height={260}
                                    className="rounded-lg object-contain max-h-[320px] w-auto h-auto bg-gray-100"
                                />
                            ) : (
                                <div className="w-[350px] h-[260px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <span className="mt-2 text-sm text-gray-500 font-semibold">Antes</span>
                        <div className="mt-2 w-full">
                            <div className="text-xs text-gray-500 mb-1">Comentario antes</div>
                            <div className="bg-white rounded-lg border p-2 text-sm text-gray-700 min-h-[40px]">
                                {beforeComment || <span className="text-gray-400">Sin comentario</span>}
                            </div>
                        </div>
                    </div>
                    {/* Imagen después */}
                    <div className="flex flex-col items-center w-1/2">
                        <div className="w-full flex justify-center">
                            {afterImage ? (
                                <Image
                                    src={afterImage.file_url}
                                    alt={afterImage.file_name || "Después"}
                                    width={350}
                                    height={260}
                                    className="rounded-lg object-contain max-h-[320px] w-auto h-auto bg-gray-100"
                                />
                            ) : (
                                <div className="w-[350px] h-[260px] flex items-center justify-center bg-gray-100 rounded-lg text-gray-400">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                        <span className="mt-2 text-sm text-gray-500 font-semibold">Después</span>
                        <div className="mt-2 w-full">
                            <div className="text-xs text-gray-500 mb-1">Comentario después</div>
                            <div className="bg-white rounded-lg border p-2 text-sm text-gray-700 min-h-[40px]">
                                {afterComment || <span className="text-gray-400">Sin comentario</span>}
                            </div>
                        </div>
                    </div>
                </div>
                <DialogClose asChild>
                    <Button variant="outline" className="mt-6 w-full" onClick={onClose}>
                        Cerrar
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
};

export default FallaImagesModal;