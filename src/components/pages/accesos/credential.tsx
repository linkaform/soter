import React from "react";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import CalendarDays from "@/components/calendar-days";
import { Button } from "@/components/ui/button";

import { MessageSquare, Phone } from "lucide-react";

import { MakeCallModal } from "@/components/modals/make-call-modal";
import { SendMessageModal } from "@/components/modals/send-message-modal";

const Credentials = () => {
  return (
    <Card className="">
      <CardContent className="p-6">
        <div className="flex justify-end">
          <Badge className="bg-blue-600 hover:bg-blue-600 text-white">
            Entrada
          </Badge>
        </div>

        <div className="grid md:grid-cols-[350px_1fr] gap-6">
          <div className="space-y-4">
            <div className="flex">
              <Image
                src="/image/credencial1.png"
                alt="Descripción de la imagen"
                width={108}
                height={108}
              />

              <Image
                src="/image/credencial2.png"
                alt="Descripción de la imagen"
                width={162}
                height={108}
              />
            </div>

            <div className="space-y-2">
              <div>
                <Label>Folio</Label>
                <div>PE/2408/039</div>
              </div>

              <div>
                <Label>Tipo de pase</Label>
                <div>Chófer</div>
              </div>

              <div>
                <Label>Estatus </Label>
                <Badge variant="destructive">Vencido</Badge>
              </div>

              <div>
                <Label>Vigencia del pase</Label>
                <div className="flex justify-between">
                  <span>20/09/2024</span>
                  <span>11:25:12 hrs</span>
                </div>
              </div>

              <div>
                <CalendarDays />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <p>Nombre:</p>
                <p>Smantha Chávez Juárez:</p>
              </div>

              <div>
                <p>Empresa:</p>
                <p>Linkaform:</p>
              </div>

              <div>
                <p>Motivo de visita:</p>
                <p>Carga de material reciclable:</p>
              </div>

              <div>
                <Label>Visita a:</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Laura Perez Nuria</span>
                    <div className="space-x-2">
                      <MakeCallModal
                        title={"¿Realizar llamada?"}
                        description={
                          "Al realizar la llamada, se contactará al número de la persona seleccionada."
                        }
                      >
                        <Button size="icon" variant="secondary"
                            className="bg-gray-700 text-white hover:bg-gray-600"

                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </MakeCallModal>

                      <SendMessageModal title="Enviar Recordatorio">
                        <Button size="icon" variant="secondary"
                         className="bg-gray-700 text-white hover:bg-gray-600"

                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </SendMessageModal>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Sebastián Chávez Pérez</span>
                    <div className="space-x-2">
                      <MakeCallModal
                        title={"¿Realizar llamada?"}
                        description={
                          "Al realizar la llamada, se contactará al número de la persona seleccionada."
                        }
                      >
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-gray-700 text-white hover:bg-gray-600"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </MakeCallModal>

                      <SendMessageModal title="Enviar Recordatorio">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-gray-700 text-white hover:bg-gray-600"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </SendMessageModal>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Gafete:</p>
                <p className="text-purple-500">MTY-10</p>
              </div>
              <div>
                <p>Locker:</p>
                <p className="text-purple-500">L-03 </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Credentials;
