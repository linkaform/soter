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
                    } as any);

                    scannerRef.current = html5QrCode;

                    Html5Qrcode.getCameras()
                        .then((devices) => {
                            if (devices && devices.length > 0) {
                                let camera = devices.find(
                                    (d) =>
                                        d.label.toLowerCase().includes("back") ||
                                        d.label.toLowerCase().includes("rear")
                                );
                                if (!camera) {
                                    camera = devices[0];
                                }
                                const cameraId = camera.id;
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
            <DialogContent
                className="max-w-full w-[95vw] sm:max-w-md p-0"
                style={{ maxHeight: "95vh", overflow: "auto" }}
            >
                <DialogTitle className="px-6 pt-6">Escanear número de serie</DialogTitle>
                <div
                    id={CAMERA_CONTAINER_ID}
                    className="flex items-center justify-center w-full bg-black rounded mt-2 mx-auto"
                    style={{
                        height: "min(60vw, 320px)",
                        maxHeight: "320px",
                        minHeight: "180px",
                    }}
                />
                <div className="h-4" />
            </DialogContent>
        </Dialog>
    );
}
