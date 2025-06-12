import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog'
import { ScanPassWithCameraModal } from './scan-pass-with-camera'
import { Button } from '../ui/button'
import { ScanLine, Webcam } from 'lucide-react'

interface ScanPassOptionsModalProps {
    title: string
    children: React.ReactNode
    inputRef: React.RefObject<HTMLInputElement>
}

export const ScanPassOptionsModal: React.FC<ScanPassOptionsModalProps> = ({
    title,
    children,
    inputRef
}) => {
    const [open, setOpen] = useState(false);

    const handleScannerClick = () => {
        setOpen(false);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 200); // Espera a que el modal termine de cerrarse
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='max-w-xl' aria-describedby='add-note-description'>
                <DialogHeader>
                    <DialogTitle className='text-2xl text-center font-bold my-5'>
                        {title}
                    </DialogTitle>
                    <DialogDescription id='add-note-description' className='text-center'>
                        Escoge el dispositivo para empezar escanear tu pase.
                    </DialogDescription>
                </DialogHeader>
                <div className='flex items-center justify-center gap-4 mb-8 mt-2'>
                    <div>
                        <ScanPassWithCameraModal title="Escanea un pase con la camara" >
                            <Button className="bg-green-600 hover:bg-green-700 text-white">
                                <Webcam />
                                Utilizar cámara
                            </Button>
                        </ScanPassWithCameraModal>
                    </div>
                    <div>
                        <Button
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                            onClick={handleScannerClick}
                        >
                            <ScanLine />
                            Utilizar scanner
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
