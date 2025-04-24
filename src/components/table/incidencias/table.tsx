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
import { CalendarDays, FileX2, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Incidencia_record, incidenciasColumns } from "./incidencias-columns";
import { useEffect, useMemo } from "react";
import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
import { catalogoFechas, downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateTime from "@/components/dateTime";
// import ChangeLocation from "@/components/changeLocation";

interface ListProps {
	refetch:() => void;
	data: Incidencia_record[];
	setPrioridades: React.Dispatch<React.SetStateAction<string[]>>;
	isLoading:boolean;
	openModal: () => void;
	setSelectedIncidencias:React.Dispatch<React.SetStateAction<string[]>>;
	selectedIncidencias:string[];

  	// setUbicacionSeleccionada: React.Dispatch<React.SetStateAction<string>>;
	// setAreaSeleccionada:React.Dispatch<React.SetStateAction<string>>;
	// areaSeleccionada:string;
	// ubicacionSeleccionada:string;

	setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
	setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
	date1:Date| ""
	date2:Date| ""
	dateFilter: string;
	setDateFilter :React.Dispatch<React.SetStateAction<string>>;
	Filter:() => void;
}

const fallasColumnsCSV = [
  { label: 'Folio', key: 'folio' },
  { label: 'Ubicacion', key: 'ubicacion_incidencia' },
  { label: 'Lugar del Incidente', key: 'area_incidencia' },
  { label: 'Fecha y hora', key: 'fecha_hora_incidencia' },
  { label: 'Comentarios', key: 'comentario_incidencia' },
  { label: 'Reporta', key: 'reporta_incidencia' },
];

const IncidenciasTable:React.FC<ListProps> = ({ refetch, data, isLoading, openModal,setSelectedIncidencias,selectedIncidencias,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter
	// setUbicacionSeleccionada, setAreaSeleccionada, areaSeleccionada, ubicacionSeleccionada
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
  const columns = useMemo(() => (isLoading ? [] : incidenciasColumns), [isLoading]);
  const memoizedData = useMemo(() => data || [], [data]);

  const table = useReactTable({
    data:memoizedData,
    columns: columns,
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
    refetch()
  },[])


  React.useEffect(()=>{
    if(table.getFilteredSelectedRowModel().rows.length>0){
      const folios: any[] = []
      table.getFilteredSelectedRowModel().rows.map((row) => {
        folios.push(row.original);
      });
      setSelectedIncidencias(folios)
    }
  },[table.getFilteredSelectedRowModel().rows])

  return (
    <div className="w-full">
		<div className="flex justify-between items-center my-2 ">
			<div className="flex w-1/2 justify-start gap-4 ">
				<div className="flex">
					<TabsList className="bg-blue-500 text-white">
					<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
					<TabsTrigger value="Fallas">Fallas</TabsTrigger>
					</TabsList>
				</div> 

				<div className="flex w-full max-w-sm items-center space-x-2">
				<input
					type="text"
					placeholder="Buscar"
					value={globalFilter || ''}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className=" border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full" 
				/>
					<Search />
				</div>
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

				{/* <div className="flex items-center gap-2">
					<span className="text-lg font-semibold">Prioridad:</span>
					<Select onValueChange={handleCheckboxChange} defaultValue={""}>
						<SelectTrigger>
							<SelectValue placeholder="Selecciona una opción" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="alta">Alta</SelectItem>
							<SelectItem value="media">Media</SelectItem>
							<SelectItem value="baja">Baja</SelectItem>
							<SelectItem value="crítica">Crítica</SelectItem>
						</SelectContent>
					</Select>
				</div> */}

				<div className="flex flex-wrap gap-2">
				<div>
					<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={openModal}>
						<Plus />
						Nuevo Incidente
					</Button>
				</div>

				<div>
					<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={()=>{downloadCSV(selectedIncidencias, fallasColumnsCSV, "incidencias.csv")}}>
						<FileX2 />
						Descargar
					</Button>
				</div>

				<div>
					<EliminarIncidenciaModal title="Eliminar Incidencias" arrayFolios={selectedIncidencias}>
						<div className="flex flex-shrink p-2 rounded-sm px-3 w-full bg-red-500 text-white hover:bg-red-600 mb-0" >
							<Trash2 />        
							Eliminar
						</div>
					</EliminarIncidenciaModal>
				</div>

				{/* <div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Columnas <ChevronDown />
						</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="bg-blue-500">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
							return (
								<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize bg-blue-500"
								checked={column.getIsVisible()}
								onCheckedChange={(value) =>
									column.toggleVisibility(!!value)
								}
								>
								{column.id}
								</DropdownMenuCheckboxItem>
							);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div> */}
			</div>
			</div>
		</div>

		<div>
			<Table>
			<TableHeader className="bg-blue-100 hover:bg-blue-100 ">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id} >
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
					colSpan={incidenciasColumns.length}
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
			{!isLoading? 
				<div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} de{" "}
				{table.getFilteredRowModel().rows.length} items seleccionados.
				</div>
			:null}
			

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
export default IncidenciasTable;