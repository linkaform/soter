"use client";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useUpdateSuplenteTurnos } from "@/hooks/Rondines/useUpdateSuplente";

interface NombreSuplenteModalProps {
    title: string;
    nombreSuplente: string;
    setNombreSuplente: Dispatch<SetStateAction<string>>;
    onSuplenteConfirmado: () => void;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    mode: string;
}

export const NombreSuplenteModal: React.FC<NombreSuplenteModalProps> = ({
    title,
    nombreSuplente,
    setNombreSuplente,
    onSuplenteConfirmado,
    open,
    setOpen,
    mode
}) => {
    const { updateSuplenteMutation, isLoading } = useUpdateSuplenteTurnos();
    const [localName, setLocalName] = useState(nombreSuplente || "");

    useEffect(() => {
        if (open) {
            setLocalName(nombreSuplente || "");
        }
    }, [open, nombreSuplente]);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center  font-bold ">
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="p-4">
                    <Input
                        placeholder="Nombre del suplente"
                        className="resize-none"
                        value={localName}
                        onChange={(e) => setLocalName(e.target.value)}
                    />

                    <div className="flex gap-5 mt-5">
                        <DialogClose asChild>
                            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button
                            className="w-full  bg-blue-500 hover:bg-blue-600 text-white"
                            onClick={() => {
                                if (mode == "Edit") {
                                    updateSuplenteMutation.mutate({ nombre_suplente: nombreSuplente }, {
                                        onSuccess: () => {
                                            setOpen(false);
                                            setNombreSuplente(localName)
                                        }
                                    })
                                } else {
                                    setOpen(false);
                                    setNombreSuplente(localName)
                                    onSuplenteConfirmado();
                                }
                            }}
                            disabled={localName.trim() === "" || isLoading}
                        >
                            {isLoading ? "Cargando..." : "Confirmar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};