import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

const CAMERA_CONTAINER_ID = "barcode-scanner-container";

export function ScanBarcodeModal({
    open,
    setOpen,
    onScan,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    onScan: (value: string) => void;
}) {
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        let html5QrCode: Html5Qrcode | null = null;
        let timeout: NodeJS.Timeout | null = null;

        if (open) {
            timeout = setTimeout(() => {
                const element = document.getElementById(CAMERA_CONTAINER_ID);
                if (element) {
                    // 👇 Aquí forzamos que solo escanee códigos de barras
                    html5QrCode = new Html5Qrcode(CAMERA_CONTAINER_ID, {
                        formatsToSupport: [
                            Html5QrcodeSupportedFormats.CODE_128,
                            Html5QrcodeSupportedFormats.CODE_39,
                            Html5QrcodeSupportedFormats.EAN_13,
                            Html5QrcodeSupportedFormats.EAN_8,
                            Html5QrcodeSupportedFormats.UPC_A,
                            Html5QrcodeSupportedFormats.UPC_E,
                            Html5QrcodeSupportedFormats.ITF,
                            Html5QrcodeSupportedFormats.CODABAR,
                        ],
                    } as any); // 👈 TypeScript se quejará, lo forzamos con `as any`

                    scannerRef.current = html5QrCode;

                    Html5Qrcode.getCameras()
                        .then((devices) => {
                            if (devices && devices.length > 0) {
                                const cameraId = devices[0].id;
                                html5QrCode!.start(
                                    cameraId,
                                    {
                                        fps: 10,
                                        qrbox: { width: 500, height: 200 },
                                    },
                                    (decodedText) => {
                                        onScan(decodedText);
                                        setOpen(false);
                                    },
                                    (errorMessage) => {
                                        if (
                                            errorMessage &&
                                            !errorMessage.includes("NotFoundException") &&
                                            !errorMessage.includes("No MultiFormat Readers were able to detect the code")
                                        ) {
                                            console.error("QR scanner error:", errorMessage);
                                        }
                                    }
                                );
                            }
                        })
                        .catch((err) => {
                            console.error("Error getting cameras:", err);
                        });
                }
            }, 300);

            return () => {
                if (timeout) clearTimeout(timeout);
                if (scannerRef.current) {
                    scannerRef.current
                        .stop()
                        .then(() => scannerRef.current?.clear())
                        .catch((err) => {
                            if (!String(err).includes("scanner is not running")) {
                                console.error("Error stopping scanner:", err);
                            }
                        });
                }
            };
        }
    }, [open, onScan, setOpen]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogTitle>Escanear número de serie</DialogTitle>
                <div
                    id={CAMERA_CONTAINER_ID}
                    className="flex items-center justify-center w-full h-80 bg-black rounded mt-2"
                />
            </DialogContent>
        </Dialog>
    );
}
