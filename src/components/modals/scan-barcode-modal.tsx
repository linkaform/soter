import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
    const scannerRef = useRef<any>(null);
    const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

    useEffect(() => {
        let html5QrCode: any = null;
        let timeout: NodeJS.Timeout | null = null;

        if (open) {
            Html5Qrcode.getCameras().then((devices) => {
                setCameras(devices);
                const backCam = devices.find(
                    (d) =>
                        d.label.toLowerCase().includes("back") ||
                        d.label.toLowerCase().includes("rear")
                );
                setSelectedCamera(backCam ? backCam.id : devices[0]?.id || null);
            });

            timeout = setTimeout(() => {
                const element = document.getElementById(CAMERA_CONTAINER_ID);
                if (element && selectedCamera) {
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

                    html5QrCode.start(
                        selectedCamera,
                        {
                            fps: 10,
                            // No uses qrbox para usar toda la superficie
                            videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } },
                        },
                        (decodedText: string) => {
                            onScan(decodedText);
                            setOpen(false);
                        },
                        (errorMessage: string) => {
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
            }, 300);

            return () => {
                if (timeout) clearTimeout(timeout);
                if (scannerRef.current) {
                    scannerRef.current
                        .stop()
                        .then(() => scannerRef.current?.clear())
                        .catch((err: any) => {
                            if (!String(err).includes("scanner is not running")) {
                                console.error("Error stopping scanner:", err);
                            }
                        });
                }
            };
        }
    }, [open, onScan, setOpen, selectedCamera]);

    const aspectRatio = 2.5;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
                className="max-w-full w-[95vw] sm:max-w-md p-0"
                style={{ maxHeight: "95vh", overflow: "auto" }}
            >
                <DialogTitle className="px-6 pt-6">Escanear número de serie</DialogTitle>
                <div className="px-6 pb-2">
                    {cameras.length > 1 && (
                        <select
                            className="w-full border rounded p-2 mb-2"
                            value={selectedCamera ?? ""}
                            onChange={e => setSelectedCamera(e.target.value)}
                        >
                            {cameras.map(cam => (
                                <option key={cam.id} value={cam.id}>
                                    {cam.label || `Cámara ${cam.id}`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div
                    className="relative flex items-center justify-center w-full bg-black rounded mt-2 mx-auto overflow-hidden"
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        aspectRatio: `${aspectRatio}/1`,
                        minHeight: "120px",
                    }}
                >
                    {/* Scanner video */}
                    <div
                        id={CAMERA_CONTAINER_ID}
                        className="absolute inset-0 w-full h-full"
                        style={{ zIndex: 1 }}
                    />
                    {/* Overlay de guías */}
                    <div
                        className="absolute left-1/2 top-1/2 pointer-events-none"
                        style={{
                            width: `calc(100% - 16px)`,
                            height: `calc(100% - 16px)`,
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                        }}
                    >
                        {/* Esquinas tipo L */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                top: 0,
                                width: 28,
                                height: 28,
                                borderTop: "4px solid #3b82f6",
                                borderLeft: "4px solid #3b82f6",
                                borderTopLeftRadius: 8,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                width: 28,
                                height: 28,
                                borderTop: "4px solid #3b82f6",
                                borderRight: "4px solid #3b82f6",
                                borderTopRightRadius: 8,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                bottom: 0,
                                width: 28,
                                height: 28,
                                borderBottom: "4px solid #3b82f6",
                                borderLeft: "4px solid #3b82f6",
                                borderBottomLeftRadius: 8,
                            }}
                        />
                        <div
                            style={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                                width: 28,
                                height: 28,
                                borderBottom: "4px solid #3b82f6",
                                borderRight: "4px solid #3b82f6",
                                borderBottomRightRadius: 8,
                            }}
                        />
                    </div>
                </div>
                <div className="h-4" />
            </DialogContent>
        </Dialog>
    );
}
