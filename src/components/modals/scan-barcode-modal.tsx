import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";

const CAMERA_CONTAINER_ID = "barcode-scanner-video";

export function ScanBarcodeModal({
    open,
    setOpen,
    onScan,
}: {
    open: boolean;
    setOpen: (v: boolean) => void;
    onScan: (value: string) => void;
}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const controlsRef = useRef<IScannerControls | null>(null);
    const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

    // Obtener cámaras cuando se abre el modal
    useEffect(() => {
        if (open) {
            BrowserMultiFormatReader.listVideoInputDevices().then((devices) => {
                setCameras(devices);
                const backCam = devices.find(
                    (d) =>
                        d.label.toLowerCase().includes("back") ||
                        d.label.toLowerCase().includes("rear")
                );
                setSelectedCamera(backCam ? backCam.deviceId : devices[0]?.deviceId || null);
            });
        } else {
            setCameras([]);
            setSelectedCamera(null);
        }
    }, [open]);

    // Inicializar el scanner cuando la cámara y el video están listos
    useEffect(() => {
        if (!open || !selectedCamera) return;

        const codeReader = new BrowserMultiFormatReader();
        let stopped = false;

        codeReader.decodeFromVideoDevice(
            selectedCamera,
            videoRef.current!,
            (result, err, controls) => {
                controlsRef.current = controls;
                if (result) {
                    if (!stopped) {
                        stopped = true;
                        controls.stop();
                        onScan(result.getText());
                        setOpen(false);
                    }
                }
            }
        );

        return () => {
            stopped = true;
            controlsRef.current?.stop();
        };
    }, [open, selectedCamera, onScan, setOpen]);

    // Proporción del área de escaneo (ejemplo: 2.5:1)
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
                                <option key={cam.deviceId} value={cam.deviceId}>
                                    {cam.label || `Cámara ${cam.deviceId}`}
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
                    <video
                        ref={videoRef}
                        id={CAMERA_CONTAINER_ID}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ zIndex: 1 }}
                        autoPlay
                        muted
                        playsInline
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
