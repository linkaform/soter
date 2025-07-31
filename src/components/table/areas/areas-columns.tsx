import { ColumnDef } from "@tanstack/react-table";

export interface Areas {
  id:string;
  name:string;
}

export const areasColumns: ColumnDef<Areas>[] = [
  {
    accessorKey: "pase",
    header: "Área",
    cell: ({ row }) => {
      return (
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <span className="font-bold">{row.original.name}</span>
          </div>
        </div>
      );
    },
    enableSorting: false,  // Deshabilitar el orden para esta columna combinada
    enableGlobalFilter: false,
  },
  {
    accessorKey: "nombre",
    header: "",
    cell: () => null, // No renderiza nada
    enableHiding: true,
    enableSorting: false,
  },
  
  {
    accessorKey: "estatus",
    header: "",
    enableHiding: true,
    cell: () => null, // No renderiza nada
    enableSorting: false,
  },

];
