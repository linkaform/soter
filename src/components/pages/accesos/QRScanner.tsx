import React, { useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";

const QRScanner: React.FC<{ onScan: (result: string) => void }> = ({ onScan }) => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const startScanner = () => {

   console.log(scanResult)

    if (isScanning) return; // Si ya está escaneando, no hace nada

    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    qrScanner.render(
      (decodedText) => {
        console.log("Código QR escaneado:", decodedText);
        setScanResult(decodedText);
        onScan(decodedText);
        qrScanner.clear(); // ❌ Detiene el escaneo tras éxito
        setScanner(null); // Evita reiniciar automáticamente
        setIsScanning(false); // Marca como detenido
      },
      (errorMessage) => {
        console.warn("Error al escanear QR:", errorMessage);
      }
    );

    setScanner(qrScanner);
    setIsScanning(true); // ✅ Marca que el escáner está en funcionamiento
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
      setScanner(null);
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">


        <div className="flex-row space-x-5 my-10">
    <Button variant="secondary" onClick={startScanner}>Iniciar Escáner</Button>

    <Button variant="secondary" onClick={stopScanner}>Detener Escáner</Button>
    </div>


    <div id="qr-reader" className="w-[300px] h-[300px]" />
</div>
  );
};

export default QRScanner;