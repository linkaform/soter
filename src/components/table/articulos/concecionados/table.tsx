/* eslint-disable react-hooks/exhaustive-deps */
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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,

  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, Plus } from "lucide-react";
import { Articulo_con_record, conColumns } from "./concecionados-columns";
import { catalogoFechas } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import DateTime from "@/components/dateTime";

interface ListProps {
  data: Articulo_con_record[];
  isLoadingListArticulosCon:boolean;
  openModal: () => void;
//   setStateArticle: React.Dispatch<React.SetStateAction<string>>;
  setSelectedArticulos:React.Dispatch<React.SetStateAction<string[]>>;
//   selectedArticulos:string[];

  setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
  setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
  date1:Date| ""
  date2:Date| ""
  dateFilter: string;
  setDateFilter :React.Dispatch<React.SetStateAction<string>>;
  Filter:() => void;
}

// const articulosColumnsCSV = [
//     { label: 'Folio', key: 'folio' },
//     { label: 'Nombre', key: 'articulo_perdido' },
//     { label: 'Articulo', key: 'articulo_seleccion' },
//     { label: 'Color', key: 'color_perdido' },
//     { label: 'Categoria', key: 'tipo_articulo_perdido' },
//     { label: 'Fecha del Hallazgo', key: 'date_hallazgo_perdido' },
//     { label: 'Area de Resguardo', key: 'locker_perdido' },
//     { label: 'Reporta Interno', key: 'quien_entrega_interno' },
// 	  { label: 'Reporta Externo', key: 'quien_entrega_externo' },
//     { label: 'Fecha de Devolucion', key: 'date_entrega_perdido' },
// 	  { label: 'Comentarios', key: 'comentario_perdido' },
//   ];

const ArticulosConTable:React.FC<ListProps> = ({ data, isLoadingListArticulosCon, openModal,
	setSelectedArticulos, setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter 
})=> {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 23,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data: data || [],
    columns: isLoadingListArticulosCon ? []: conColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
      globalFilter,
    },
  });

	useEffect(()=>{
		if(table.getFilteredSelectedRowModel().rows.length>0){
		const folios: any[] = []
		table.getFilteredSelectedRowModel().rows.map((row) => {
			folios.push(row.original);
		});
		setSelectedArticulos(folios)
		}
  	},[table.getFilteredSelectedRowModel().rows])

  return (
    <div className="w-full">
      	<div className="flex justify-between items-center my-2 ">
			<div className="flex">
				<TabsList className="bg-blue-500 text-white mr-2">
					<TabsTrigger value="Perdidos">Artículos perdidos</TabsTrigger>
					<TabsTrigger value="Concecionados">Artículos concesionados</TabsTrigger>
					<TabsTrigger value="Paqueteria">Paqueteria</TabsTrigger>
				</TabsList>
			</div>
			
			<div className="flex items-center">
				<input
				type="text"
				placeholder="Buscar en todos los campos..."
				value={globalFilter}
				onChange={(e) => setGlobalFilter(e.target.value)}
				className="w-full border border-gray-300 rounded-md p-2"
				/>
			</div>

      		<div className="flex w-full justify-end gap-3">
				{dateFilter == "range" ?
				<div className="flex items-center gap-2 mr-14">
					<DateTime date={date1} setDate={setDate1} />
					<DateTime date={date2} setDate={setDate2} />
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={Filter}> Filtrar</Button>
				</div>:null}
				<div className="flex items-center w-48 gap-2"> 
				<Select value={dateFilter}  onValueChange={(value) => { 
						setDateFilter(value); 
						}}> 
					<SelectTrigger className="w-full">
					<SelectValue placeholder="Selecciona un filtro de fecha" />
					</SelectTrigger>
					<SelectContent>
					{catalogoFechas().map((option:any) => {
						return (
							<SelectItem key={option.key} value={option.key}> 
							{option.label}
							</SelectItem>
						)
					})}
					</SelectContent>
				</Select>
				<CalendarDays />
				</div>

				<div className="flex flex-wrap gap-2">
					<div>
						<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={openModal}>
							<Plus />
							Nuevo Artículo
						</Button>
					</div>

					{/* <div>
						<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={()=>{downloadCSV(selectedArticulos, articulosColumnsCSV, "incidencias.csv")}}>
							<FileX2 />
							Descargar
						</Button>
					</div> */}
				</div>
			</div>
		</div>

      <div className="">
        <Table>
          <TableHeader className=" bg-blue-100 hover:bg-blue-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-1 pl-1">
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
                  colSpan={conColumns.length}
                  className="h-24 text-center"
                >
                  No hay registros disponibles{" "}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
export default ArticulosConTable;