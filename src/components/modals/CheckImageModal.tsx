import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { MapPin, Calendar, MessageSquare, Camera, Link as LinkIcon } from "lucide-react";

type CheckImage = {
  name: string;
  recordId: number;
  file_name: string;
  file_url: string;
  numSet: number;
  thumbnail_name: string;
  fieldId: string;
  file_path: string;
};

export type CheckData = {
  id: string;
  folio: string;
  ref_number: number;
  ubicacion: string;
  nombre_recorrido: string;
  nombre_area: string;
  fecha_y_hora_check: string;
  comentario_check: string;
  url_check: string;
  fotos_check: CheckImage[];
};

interface CheckImageModalProps {
  open: boolean;
  onClose: () => void;
  check: CheckData;
  initialIndex?: number;
}

const CheckImageModal: React.FC<CheckImageModalProps> = ({
  open,
  onClose,
  check,
  initialIndex = 0,
}) => {
  const total = check?.fotos_check?.length || 0;
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(initialIndex);

  // Posiciona el carrusel en el slide inicial al abrir
  React.useEffect(() => {
    if (!api || !open) return;
    api.scrollTo(initialIndex ?? 0, true);
    setCurrent(initialIndex ?? 0);

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, initialIndex, open]);

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] flex flex-col overflow-hidden p-6">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg font-semibold">Detalle del check</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
          {/* Imágenes */}
          <div className="flex-[3] relative bg-gray-50 rounded-lg border flex items-center justify-center p-2">
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: false, slidesToScroll: 1 }}
              className="w-full"
            >
              <CarouselContent>
                {check?.fotos_check?.map((img, i) => (
                  <CarouselItem key={i} className="basis-full">
                    <div className="w-full h-full flex items-center justify-center">
                      {img?.file_url ? (
                        <Image
                          src={img.file_url}
                          alt={img.file_name || "Imagen del check"}
                          width={1200}
                          height={900}
                          className="object-contain rounded-lg"
                          style={{ maxHeight: "75vh", width: "auto", height: "auto" }}
                          unoptimized
                        />
                      ) : (
                        <div className="text-gray-400">Sin imagen</div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {total > 1 && (
                <>
                  <CarouselPrevious className="left-3" />
                  <CarouselNext className="right-3" />
                </>
              )}
            </Carousel>

            {total > 0 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 border rounded-full px-3 py-1 text-sm shadow flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {current + 1} de {total}
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="flex-[2] bg-white rounded-lg border p-4 overflow-y-auto">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="text-gray-500">Ubicación</div>
                  <div className="font-medium">{check.ubicacion || "—"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center mt-0.5">
                  R
                </div>
                <div>
                  <div className="text-gray-500">Recorrido</div>
                  <div className="font-medium">{check.nombre_recorrido || "—"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-4 h-4 rounded bg-gray-700 text-white text-[10px] flex items-center justify-center mt-0.5">
                  A
                </div>
                <div>
                  <div className="text-gray-500">Área</div>
                  <div className="font-medium">{check.nombre_area || "—"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <div className="text-gray-500">Fecha y hora</div>
                  <div className="font-medium">{check.fecha_y_hora_check || "—"}</div>
                </div>
              </div>

              {check.folio && (
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded bg-gray-500 text-white text-[10px] flex items-center justify-center mt-0.5">
                    F
                  </div>
                  <div>
                    <div className="text-gray-500">Folio</div>
                    <div className="font-medium">{check.folio}</div>
                  </div>
                </div>
              )}

              {check.comentario_check && (
                <div className="pt-2">
                  <div className="flex items-start gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-gray-500">Comentario</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-gray-800">
                    {check.comentario_check}
                  </div>
                </div>
              )}

              {check.url_check && (
                <a
                  href={check.url_check}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-2"
                >
                  <LinkIcon className="w-4 h-4" />
                  Ver detalle en Linkaform
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckImageModal;