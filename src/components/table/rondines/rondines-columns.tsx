import { AddRondinModal } from "@/components/modals/add-rondin";
import {
    ColumnDef,   
  } from "@tanstack/react-table";
import { Eye, Pencil, Trash } from "lucide-react";


  export interface Recorrido {
    _id:string
    folio: string
    recurrencia: string
    asignado_a: string
    checkpoints: number
    nombre_del_rondin: string
    ubicacion: string
    duracion_estimada?: string
    fecha_hora_programada: string
    cada_cuantos_dias_se_repite: string
    areas: any
  }

  // export const rondinesColumns: ColumnDef<Recorrido>[] = [
  export const getRondinesColumns = ( onEliminarClick: (rondin: Recorrido) => void, handleVerRondin: (rondin: Recorrido) => void): ColumnDef<Recorrido>[] => [
    {
      id: "options",
      header: "Opciones",
      cell: ({ row }) => (
        
        <div className="flex space-x-2">
          <div className="cursor-pointer" onClick={() => { handleVerRondin(row.original) }}  title="Ver Rondin">
            <Eye /> 
          </div>
          <AddRondinModal
            title="Editar Rondín"
            mode="edit"
            rondinData={ row.original}
            rondinId={ row.original._id}
            folio={ row.original.folio}
          >
            <div className="cursor-pointer" title="Editar Rondin">
              <Pencil />
            </div>
          </AddRondinModal>
          <div className="cursor-pointer" title="Eliminar Rondin" onClick={() => { onEliminarClick(row.original) }} >
            <Trash /> 
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
    },
    {
      accessorKey: "nombre_del_rondin",
      header: "Nombre del rondin",
      cell: ({ row }) => <div>{row.getValue("nombre_del_rondin")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "recurrencia",
      header: "Recurrencia",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("recurrencia")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "asignado_a",
      header: "Asignado a",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("asignado_a")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "checkpoints",
      header: "Checkpoints",
      cell: ({ row }) => <div>{row.getValue("checkpoints")}</div>,
      enableSorting: true,
    },

    {
      accessorKey: "ubicacion",
      header: "Ubicación",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("ubicacion")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "duracion_estimada",
      header: "Duracion",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("duracion_estimada")}</div>
      ),
      enableSorting: true,
    },
  ];