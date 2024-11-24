import {
    ColumnDef,  
  } from "@tanstack/react-table";
import { CarFront, Hammer, IdCard, LogOut, User } from "lucide-react";



  export type Bitacora = {
    id: string;
    folio: string;
    entrada: string;
    salida: string;
    visitante: string;
    tipo: string;
    contratista: string;
    gafete?: string;
    visitaA: string;
    casetaEntrada: string;
    casetaSalida: string,
    comentarios: string[]
  };
  


export const bitacorasColumns: ColumnDef<Bitacora>[] = [
    {
      id: "options",
      header: "Opciones",
      cell: () => (
        <div className="flex space-x-2">
          {/* Ícono de usuario */}
          <div className="cursor-pointer">
          <User />
                  </div>
          {/* Ícono de credenciales */}
          <div className="cursor-pointer">
          <IdCard />
                  </div>
          {/* Ícono de herramienta */}
          <div className="cursor-pointer">
          <Hammer />
            </div>
          {/* Ícono de automóvil */}
          <div className="cursor-pointer">
          <CarFront />
            </div>
          {/* Ícono de flecha */}
          <div className="cursor-pointer">
            <LogOut />
          </div>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "folio",
      header: "Folio",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("folio")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "entrada",
      header: "Entrada",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("entrada")}</div>
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
      accessorKey: "salida",
      header: "Salida",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("salida")}</div>
      ),
      enableSorting: true,
    },
  
    {
      accessorKey: "tipo",
      header: "Tipo",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("tipo")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "contratista",
      header: "Contratista",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("contratista")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "visitaA",
      header: "Visita a",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("visitaA")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "casetaEntrada",
      header: "Caseta Entrada",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("casetaEntrada")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "casetaSalida",
      header: "Caseta Salida",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("casetaSalida")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "gafete",
      header: "Gafete",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("gafete")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "comentarios",
      header: "Comentarios",
      cell: ({ row }) => {
        const comentarios = row.getValue("comentarios") as string[];
        return (
          <div className="capitalize">
            {Array.isArray(comentarios) ? (
              <ul className="list-disc pl-5">
                {comentarios.map((comentario, index) => (
                  <li key={index}>{comentario}</li>
                ))}
              </ul>
            ) : (
              <span>{comentarios}</span>
            )}
          </div>
        );
      },
      enableSorting: true,
    }
  ];