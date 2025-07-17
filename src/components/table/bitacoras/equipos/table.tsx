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
import { CalendarDays, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {  Bitacora_record, equiposColumns } from "./equipos-columns";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateTime from "@/components/dateTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { catalogoFechas } from "@/lib/utils";

interface ListProps {
  data: Bitacora_record[];
  isLoading:boolean;

  setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
  setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
  date1:Date| ""
  date2:Date| ""
  dateFilter: string;
  setDateFilter :React.Dispatch<React.SetStateAction<string>>;
  Filter:() => void;
}

// const fallasColumnsCSV = [
//   { label: 'Folio', key: 'folio' },
//   { label: 'Visitante', key: 'nombre_visitante' },
//   { label: 'Fecha de entrada', key: 'fecha_entrada' },
//   { label: 'Fecha de salida', key: 'fecha_salida' },
//   { label: 'Tipo', key: 'perfil_visita' },
//   { label: 'Contratista', key: 'contratista' },
//   { label: 'Visita a', key: 'formated_visita' },
//   { label: 'Caseta de entrada', key: 'caseta_entrada' },
//   { label: 'Caseta de salida', key: 'caseta_salida' },
//   { label: 'Gafete', key: 'id_gafet' },
//   { label: 'Locker', key: 'id_locker' },
//   { label: 'Comentarios', key: 'formated_comentarios' },
// ];

const EquiposTable:React.FC<ListProps> = ({ data, isLoading, setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter })=> {
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
    data: (data) ||[],
    columns: isLoading ? []:equiposColumns,
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
    }
  	});

return (
    <div className="w-full">
		<div className="flex justify-between items-start my-1 gap-3">
			<div className="flex w-full justify-start gap-4">
				<TabsList className="bg-blue-500 text-white">
					<TabsTrigger value="Personal">Personal</TabsTrigger>
                    <TabsTrigger value="Vehiculos">Vehículos</TabsTrigger>
                    <TabsTrigger value="Equipos">Equipos</TabsTrigger>
					<TabsTrigger value="Locker">Locker</TabsTrigger>
				</TabsList>

				<div className="flex w-full max-w-sm items-center space-x-2">
				<input
					type="text"
					placeholder="Buscar"
					value={globalFilter}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className=" border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full" 
				/>
					<Search />
				</div>
			</div> 

			<div className="flex w-full justify-end">
				{dateFilter == "range" ?
				<div className="flex items-center gap-2 mr-14">
					<DateTime date={date1} setDate={setDate1} disablePastDates={false}/>
					<DateTime date={date2} setDate={setDate2} disablePastDates={false}/>
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
			</div>
		</div>

		<div className="">
			<Table>
				<TableHeader className="bg-blue-100 hover:bg-blue-100">
					{table.getHeaderGroups().map((headerGroup:any) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header:any) => {
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
				<TableBody >
					{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map((row:any) => (
						<TableRow 
						key={row.id}
						data-state={row.getIsSelected() && "selected"}
						
						>
						{row.getVisibleCells().map((cell:any) => (
							<TableCell key={cell.id} className="p-1 pl-1">
							{flexRender(
								cell.column.columnDef.cell,
								cell.getContext(),
							)}
							</TableCell>
						))}
						</TableRow>
					))
					) : (
					<TableRow>
						<TableCell
						colSpan={equiposColumns.length}
						className="h-24 text-center"
						>
						{isLoading? (<div className='text-xl font-semibold'>Cargando registros... </div>): 
							(<div className='text-xl font-semibold'>No hay registros disponibles...</div>)}
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
export default EquiposTable;