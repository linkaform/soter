// components/ReusableAccordion.tsx

import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

interface ReusableAccordionProps {
  ubicaciones: { value: string; label: string }[];
  casetas: { value: string; label: string }[];
  jefe: string;
  estadisticas: { label: string; value: number; icon: React.ReactNode }[];
}

const ReusableAccordion: React.FC<ReusableAccordionProps> = ({
  ubicaciones,
  casetas,
  jefe,
  estadisticas,
}) => {
  // Determina el número de columnas dinámicamente


  return (
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
                <label className="text-sm text-muted-foreground">Ubicación:</label>
                <Select defaultValue={ubicaciones[0]?.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubicacion) => (
                      <SelectItem key={ubicacion.value} value={ubicacion.value}>
                        {ubicacion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Caseta:</label>
                <Select defaultValue={casetas[0]?.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar caseta" />
                  </SelectTrigger>
                  <SelectContent>
                    {casetas.map((caseta) => (
                      <SelectItem key={caseta.value} value={caseta.value}>
                        {caseta.label}
                      </SelectItem>
                    ))}
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
              <p className="text-lg">{jefe}</p>
            </div>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className={`grid gap-4 sm:grid-cols-2 md:grid-cols-4`}>
            {estadisticas.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    {stat.icon}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ReusableAccordion;
