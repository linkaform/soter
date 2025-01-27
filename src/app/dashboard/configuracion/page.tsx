"use client"

import { ConfiguracionTable } from "@/components/table/configuracion/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React from "react";

const ConfiguracionPage = () => {



    

  return (
    <div>
      <h1 className="m-10 font-bold text-3xl">Empleados & Áreas</h1>

      <h1 className="m-10 text-base">
        Asignación de empleados a áreas dentro de una ubicación
      </h1>

      <Select>
        <SelectTrigger className="w-[500px]">
          <SelectValue placeholder="Selecciona una opcion" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecciona una opcion</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Input className="w-[500px] mt-10 bg-[#F0F2F5]" type="text" placeholder="Search" />


      <ConfiguracionTable />

    </div>
  );
};

export default ConfiguracionPage;
