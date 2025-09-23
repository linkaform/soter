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
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const [cameras, setCameras] = useState<{ id: string; label: string }[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

    // Obtener cámaras al abrir el modal
    useEffect(() => {
        if (!open) return;

        Html5Qrcode.getCameras().then((devices) => {
            setCameras(devices);
            const backCam = devices.find(
                (d) =>
                    d?.label?.toLowerCase().includes("back") ||
                    d?.label?.toLowerCase().includes("rear")
            );
            setSelectedCamera(backCam ? backCam.id : devices[0]?.id || null);
        });

        return () => {
            setCameras([]);
            setSelectedCamera(null);
        };
    }, [open]);

    // Iniciar scanner cuando cambia la cámara seleccionada
    useEffect(() => {
        if (!open || !selectedCamera) return;

        const html5QrCode = new Html5Qrcode(CAMERA_CONTAINER_ID, {
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

        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        const cameraConfig: any = {
            fps: 10,
            videoConstraints: {},
        };

        if (selectedCamera) {
            cameraConfig.videoConstraints = { deviceId: { exact: selectedCamera } };
        } else if (isMobile) {
            cameraConfig.videoConstraints = { facingMode: { exact: "environment" } };
        }

        html5QrCode
            .start(
                selectedCamera || { facingMode: "environment" },
                cameraConfig,
                (decodedText: string) => {
                    onScan(decodedText);
                    setOpen(false);
                },
                () => {}
            )
            .catch((err) => {
                console.error("Error starting scanner:", err);
            });

        return () => {
            html5QrCode
                .stop()
                .then(() => html5QrCode.clear())
                .catch((err) => {
                    if (!String(err).includes("scanner is not running")) {
                        console.error("Error stopping scanner:", err);
                    }
                });
        };
    }, [selectedCamera, open, onScan, setOpen]);

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
                            onChange={(e) => setSelectedCamera(e.target.value)}
                        >
                            {cameras.map((cam) => (
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
                    <div
                        id={CAMERA_CONTAINER_ID}
                        className="absolute inset-0 w-full h-full"
                        style={{ zIndex: 1 }}
                    />
                    {/* Overlay de guía visual */}
                    <div
                        className="absolute left-1/2 top-1/2 pointer-events-none"
                        style={{
                            width: `calc(100% - 16px)`,
                            height: `calc(100% - 16px)`,
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                        }}
                    >
                        {["topLeft", "topRight", "bottomLeft", "bottomRight"].map((corner) => {
                            const styles: any = {
                                position: "absolute",
                                width: 28,
                                height: 28,
                                border: "4px solid #3b82f6",
                                borderRadius: 8,
                            };
                            if (corner === "topLeft") {
                                styles.top = 0;
                                styles.left = 0;
                                styles.borderRight = "none";
                                styles.borderBottom = "none";
                            } else if (corner === "topRight") {
                                styles.top = 0;
                                styles.right = 0;
                                styles.borderLeft = "none";
                                styles.borderBottom = "none";
                            } else if (corner === "bottomLeft") {
                                styles.bottom = 0;
                                styles.left = 0;
                                styles.borderRight = "none";
                                styles.borderTop = "none";
                            } else if (corner === "bottomRight") {
                                styles.bottom = 0;
                                styles.right = 0;
                                styles.borderLeft = "none";
                                styles.borderTop = "none";
                            }
                            return <div key={corner} style={styles} />;
                        })}
                    </div>
                </div>

                <div className="h-4" />
            </DialogContent>
        </Dialog>
    );
}