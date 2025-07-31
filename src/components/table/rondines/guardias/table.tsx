"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";


import {
  Table,
  TableBody,
  TableCell, 
  TableRow,
} from "@/components/ui/table";

import { GuardiasRondinesColumns } from "./guardias-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialData: GuardiaRondines[] = [
  {
    id: "a1b2c3d4",
    empleado: "Juan Pérez",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "e5f6g7h8",
    empleado: "María López",
    avatar: "/image/empleado2.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "i9j0k1l2",
    empleado: "Carlos Díaz",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "m3n4o5p6",
    empleado: "Ana García",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "q7r8s9t0",
    empleado: "Luis Hernández",
    avatar: "/image/empleado2.png",
    puesto: "Jefe de Seguridad",
  },
  {
    id: "u1v2w3x4",
    empleado: "Laura Martínez",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "y5z6a7b8",
    empleado: "Pedro Jiménez",
    avatar: "/image/empleado1.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "c9d0e1f2",
    empleado: "Sofía Castro",
    avatar: "/image/empleado2.png",
    puesto: "Guardia de Seguridad",
  },
  {
    id: "g3h4i5j6",
    empleado: "Roberto Morales",
    avatar: "/image/empleado3.png",
    puesto: "Guardia de Seguridad",
  },
];


export type GuardiaRondines = {
  id: string;
  empleado: string;
  avatar: string;
  puesto: string;
  
};

export type ListProps={
  setSelectedRondin: React.Dispatch<React.SetStateAction<any>>;
  rest: () => void;
}

const GuardiasRondinesTable:React.FC<ListProps> =({
 })=> {
/*   const [guardias, setGuardias] =  React.useState<GuardiaRondines[]>(initialData);
 */
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 12,
  });

  const [empleadoFilter, setEmpleadoFilter] = React.useState("");

  const table = useReactTable({
    data: initialData,
    columns: GuardiasRondinesColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    setColumnFilters([{ id: "empleado", value: empleadoFilter }]);
  }, [empleadoFilter]);


  return (
    <div className="w-full">
      	{/* <Button onClick={() => {setSelectedRondin(null);}} className="bg-transparent hover:bg-transparent cursor-pointer">
            <MoveLeft className="text-black w-64"/>
        </Button> */}

        <div className="flex justify-start items-center mb-4">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          placeholder="Buscar"
          value={empleadoFilter}
          onChange={(e) => setEmpleadoFilter(e.target.value)}
          className="border border-gray-300 rounded-md p-2 h-12 w-full max-w-xs"
        />
      </div>
      <div className="">

      <ScrollArea className="h-[800px] w-full border rounded-md">


        <Table>
      
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={GuardiasRondinesColumns.length}
                  className="h-24 text-center"
                >
                  No hay registros disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        </ScrollArea>

      </div>
  
    </div>
  );
}
export default GuardiasRondinesTable;