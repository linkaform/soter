"use client";

import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


import Vehicles from "@/components/icon/vehicles";
import Exit from "@/components/icon/exit";
import { Button } from "@/components/ui/button";
import { ActivePassesModal } from "@/components/modals/active-passes-modal";
import Image from "next/image";
import {
  Home,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { MakeCallModal } from "@/components/modals/make-call-modal";
import { SendMessageModal } from "@/components/modals/send-message-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ErrorModal } from "@/components/modals/error-modal";
import { CommentPassModal } from "@/components/modals/comment-pass-modal";
import { AssingBadgeModal } from "@/components/modals/asign-badge-modal";
import CalendarDays from "@/components/calendar-days";

const AccesosPage = () => {
  return (
    <div className="">

      <div className="flex flex-col">
        <div className="p-6 space-y-6 w-full mx-auto">
        <Accordion type="single" collapsible>
        {/* Información de la Caseta */}
        <AccordionItem value="informacion-caseta">
          <AccordionTrigger>
            <h1 className="text-2xl font-semibold">Información de la Caseta</h1>
          </AccordionTrigger>
          <AccordionContent>
          <div className="space-y-4">

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  Ubicación:
                </label>
                <Select defaultValue="planta-monterrey">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planta-monterrey">
                      Planta Monterrey
                    </SelectItem>
                    <SelectItem value="planta-saltillo">
                      Planta Saltillo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Caseta:</label>
                <Select defaultValue="caseta-6">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar caseta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="caseta-6">Caseta 6 Poniente</SelectItem>
                    <SelectItem value="caseta-5">Caseta 5 Norte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="todas-casetas" />
              <label htmlFor="todas-casetas" className="text-sm">
                Todas las casetas
              </label>
            </div>

            <div className="p-4 bg-muted/40 rounded-lg">
              <h2 className="font-medium">Jefe en Guardia:</h2>
              <p className="text-lg">Emiliano Zapata</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Visitas en el Día
                    </p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Home className="text-primary h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Visitas Dentro
                    </p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Users className="text-primary h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Vehículos Estacionados
                    </p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Vehicles />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Salidas Registradas
                    </p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                  <Exit />
                </div>
              </CardContent>
            </Card>
          </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>


          <div className="flex flex-col sm:flex-row">
            <div className="flex mb-5 mr-5 w-full md:max-w-lg  mx-auto">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar usuario"
                  className="pl-10 pr-10 w-full"
                />

                <ActivePassesModal title="Pases Activos">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </ActivePassesModal>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <ErrorModal
                title={"Error al registrar la entrada"}
                message="No es posible registrar la entrada porque la vigencia del pase ha expirado."
                description="Por favor, contacte al responsable adecuado para actualizar el pase."
              >
                <Button className="bg-green-600 hover:bg-green-700">
                  Registrar ingreso
                </Button>
              </ErrorModal>

              <AssingBadgeModal title={"Recibir Gafete"} description={"Al recibir el gafete, se liberará el espacio y se retirarán los documentos del locker asignado."} >


              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                variant="secondary"
              >
                Asignar Gafete
              </Button>

              </AssingBadgeModal>

              <CommentPassModal title="Comentario al Pase">
                <Button variant="outline">+ Agregar Comentario</Button>
              </CommentPassModal>
            </div>
          </div>
        </div>


        


        


        

        <div className="flex flex-row">
          <div className="max-w-3xl p-4">
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
                        <Label>Estatus  </Label>
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
                                <Button size="icon" variant="outline">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </MakeCallModal>

                              <SendMessageModal title="Enviar Recordatorio">
                                <Button size="icon" variant="outline">
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
                                <Button size="icon" variant="outline">
                                  <Phone className="h-4 w-4" />
                                </Button>
                              </MakeCallModal>

                              <SendMessageModal title="Enviar Recordatorio">
                                <Button size="icon" variant="outline">
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
          </div>

          <div className=""></div>
        </div>
      </div>
    </div>
  );
};

export default AccesosPage;
