import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Check, IdCard, Printer, X } from "lucide-react";

export type Locker = {
    id: string;
    locker: string;
    libre: boolean;
    visitante: string;
    documento: string;
    numeroGafete: string;
    planta: string;
  };


  export const lockerColumns: ColumnDef<Locker>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: () => (
        <div className="flex space-x-2">
          {/* Ícono de credenciales */}
          <div className="cursor-pointer">
            <IdCard />
          </div>
          {/* Ícono de imprimir */}
          <div className="cursor-pointer">
            <Printer />
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "locker",
      header: "Locker",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("locker")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "libre",
      header: "Libre",
      cell: ({ row }) => (
        <div>
          {row.getValue("libre") ? (
            <>
            <Check color="#55be5c" />
            </>
            
            
          ) : (
            <X color="#da2a0b" />
           
          )}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "visitante",
      header: "Visitante",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("visitante")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "documento",
      header: "Documento",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("documento")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "numeroGafete",
      header: "Número gafete",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("numeroGafete")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "planta",
      header: "Planta",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("planta")}</div>
      ),
      enableSorting: true,
    },
  ];
  