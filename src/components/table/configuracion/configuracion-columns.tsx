/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    ColumnDef,  
  } from "@tanstack/react-table";


export type Concecionado = {
    id: string;
    articulo: string;
    fecha: string;
    tipo: string;
    noSerie: string
    reporta: string;
    observaciones: string[]
    recibe: string;
    devolucion: string;
    estado: string;
    area: string;
  };


export const configuracionColumns: ColumnDef<any>[] = [
 
    {
      accessorKey: "nombre",
      header: "Usuario",
      cell: ({ row }) => <div>{row.getValue("nombre")}</div>,
      enableSorting: true,
    },  

    {
      accessorKey: "area",
      header: "Área",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("area")}</div>
      ),
      enableSorting: true,
    },
  ];   
