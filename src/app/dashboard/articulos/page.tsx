"use client";

import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import {
  Archive,
  CircleHelp,  
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ArticulosPendientesTable } from "@/components/table/articulos/pendientes/page";
import { ConcecionadosTable } from "@/components/table/articulos/concecionados/page";
import { ArticulosDonadosTable } from "@/components/table/articulos/donados/page";
import { ArticulosEntregadosTable } from "@/components/table/articulos/entregados/page";

const ArticulosPage = () => {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stateArticle, setStateArticle] = useState("Pendientes");

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

            {/* Tarjetas de Estadísticas */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                      Articulos consesionados pendientes
                      </p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <Archive />
                                      </div>
                </CardContent>
              </Card>

       

              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                      Articulos perdidos
                      </p>
                      <p className="text-2xl font-bold">23</p>
                    </div>
                    <CircleHelp />
                                      </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>


      <Tabs defaultValue="Perdidos" className="w-full">
      <TabsList>
      <TabsTrigger value="Perdidos">Artículos perdidos</TabsTrigger>
      <TabsTrigger value="Concecionados">Artículos concecionados</TabsTrigger>
      </TabsList>
     <TabsContent value="Perdidos">


      {  stateArticle === "Pendientes" &&   <div className="">
        <ArticulosPendientesTable />
        </div>
      }

     {  stateArticle === "Entregados" &&   <div className="">
      <ArticulosEntregadosTable />
        </div>
      }

    {  stateArticle === "Donados" &&   <div className="">
      <ArticulosDonadosTable />
        </div>
      }

      


      </TabsContent>
      <TabsContent value="Concecionados">
      <div className="">
      <ConcecionadosTable />
      </div>
      </TabsContent>
     </Tabs>     
      </div>    
    </div>
  </div>
  )
}

export default ArticulosPage