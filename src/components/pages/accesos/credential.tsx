import React from "react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { MessageSquare, Phone } from "lucide-react";

import { MakeCallModal } from "@/components/modals/make-call-modal";
import { SendMessageModal } from "@/components/modals/send-message-modal";
import { SearchAccessPass } from "@/hooks/useSearchPass";
import { toast } from "sonner";
import CalendarDays from "@/components/calendar-days";

interface Props {
  searchPass: SearchAccessPass | undefined;
}

const Credentials: React.FC<Props> = ({ searchPass }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Vencido":
        return "red";
      case "Activo":
        return "green";
      case "Proceso":
        return "blue";
      default:
        return "blue";
    }
  };

  return (
    <Card className="">
      <CardContent className="p-6">
        <div className="flex justify-end">
          <Badge
            className={`text-white text-md mb-10 ${
              searchPass?.tipo_movimiento === "Salida"
                ? "bg-red-600 hover:bg-red-600"
                : "bg-green-600 hover:bg-green-600"
            }`}
          >
            {searchPass?.tipo_movimiento ?? "Entrada"}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-[140px] h-[140px] overflow-hidden rounded-lg">
                <Image
                  src={
                    searchPass?.identificacion?.[0]?.file_url || "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
                  }
                  alt="Identificación"
                  width={140}
                  height={140}
                  className="w-full h-full"
                />
              </div>

              <div className="w-[140px] h-[140px] overflow-hidden rounded-lg">
                <Image
                  src={
                    searchPass?.foto?.[0]?.file_url ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/a3/Image-not-found.png"
                  }
                  alt="Foto"
                  width={140}
                  height={140}
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p>Folio</p>
                <div>
                  <p>{searchPass?.folio}</p>
                </div>
              </div>

              <div>
                <p>Tipo de pase</p>
                <div>
                  <p>{searchPass?.tipo_de_pase}</p>
                </div>
              </div>

              <div>
                <p>Estatus </p>

                <p
                  className={`text-${getStatusColor(
                    searchPass?.status_pase ?? ""
                  )}-600`}
                >
                  {searchPass?.status_pase}
                </p>
              </div>

              <div>
                <p>Vigencia del pase:</p>
                <div className="flex justify-between">
                  <p>{searchPass?.fecha_de_caducidad?.toString()}</p>
                </div>
              </div>

              <div>
                <p>Disponible los días:</p>

                {searchPass?.limitado_a_dias && (
                  <div className="">
                    <CalendarDays
                      diasDisponibles={searchPass?.limitado_a_dias}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p>Nombre:</p>
                <p>{searchPass?.nombre}</p>
              </div>

              <div>
                <p>Empresa:</p>
                <p>{searchPass?.empresa}</p>
              </div>

              <div>
                <p>Motivo de visita:</p>
                <p>{searchPass?.motivo_visita}</p>
              </div>

              <div>
                <p>Visita a:</p>
                <div className="space-y-2 w-full flex">
                  {searchPass?.visita_a?.map((visita, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between space-x-6"
                    >
                      <span>{visita.nombre}</span>
                      <div className="space-x-2">
                        {/* Botón de Llamada */}
                        <MakeCallModal
                          title="¿Realizar llamada?"
                          description="Al realizar la llamada, se contactará al número de la persona seleccionada."
                        >
                          <Button
                            size="icon"
                            variant="secondary"
                            className="bg-gray-700 text-white hover:bg-gray-600"
                            onClick={() => {
                              if (!visita.phone) {
                                toast.error(
                                  "¡El teléfono no ha sido configurado para esta persona!"
                                );
                                return;
                              }
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </MakeCallModal>

                        {/* Botón de Mensaje */}
                        <SendMessageModal title="Enviar Recordatorio">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="bg-gray-700 text-white hover:bg-gray-600"
                            onClick={() => {
                              if (!visita.email) {
                                toast.error(
                                  "¡El email no ha sido configurado para esta persona!"
                                );
                                return;
                              }
                            }}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </SendMessageModal>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Gafete:</p>
              </div>
              <div>
                <p>Locker:</p>
                <p className="text-purple-500">{searchPass?.locker_id}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Credentials;