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
import { ChevronDown, FileX2, Plus, Trash2 } from "lucide-react";

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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Incidencia_record, incidenciasColumns } from "./incidencias-columns";
import { useEffect } from "react";
import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
import { downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangeLocation from "@/components/changeLocation";

interface ListProps {
	refetch:() => void;
	data: Incidencia_record[];
	setPrioridades: React.Dispatch<React.SetStateAction<string[]>>;
	isLoading:boolean;
	openModal: () => void;
	setSelectedIncidencias:React.Dispatch<React.SetStateAction<string[]>>;
	selectedIncidencias:string[];

  	setUbicacionSeleccionada: React.Dispatch<React.SetStateAction<string>>;
	setAreaSeleccionada:React.Dispatch<React.SetStateAction<string>>;
	areaSeleccionada:string;
	ubicacionSeleccionada:string;
	setAll:React.Dispatch<React.SetStateAction<boolean>>;
	all:boolean;
}

const fallasColumnsCSV = [
  { label: 'Folio', key: 'folio' },
  { label: 'Ubicacion', key: 'ubicacion_incidencia' },
  { label: 'Lugar del Incidente', key: 'area_incidencia' },
  { label: 'Fecha y hora', key: 'fecha_hora_incidencia' },
  { label: 'Comentarios', key: 'comentario_incidencia' },
  { label: 'Reporta', key: 'reporta_incidencia' },
];

const IncidenciasTable:React.FC<ListProps> = ({ refetch, data, setPrioridades, isLoading, openModal,setSelectedIncidencias,selectedIncidencias,
	setUbicacionSeleccionada, setAreaSeleccionada, areaSeleccionada, ubicacionSeleccionada, setAll, all
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
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  const handleCheckboxChange = (event:any) => {
    const { id, checked } = event.target;

    setPrioridades((prevPrioridades) => {
      if (checked) {
        return [...prevPrioridades, id]; // Agregar la opción seleccionada
      } else {
        return prevPrioridades.filter((item) => item !== id); // Eliminar la opción deseleccionada
      }
    });
  };


  const table = useReactTable({
    data:data || [],
    columns:  isLoading ? [] : incidenciasColumns,
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
			<div className="flex">
				<TabsList className="bg-blue-500 text-white">
				<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
				<TabsTrigger value="Fallas">Fallas</TabsTrigger>
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

			<div className="flex w-1/3 gap-2"> 
				<ChangeLocation ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} 
        		setUbicacionSeleccionada={setUbicacionSeleccionada} setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all}>
				</ChangeLocation>
			</div>

			<div className="flex items-center gap-2">
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
			</div>

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

				<div>
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
				</div>
			</div>
		</div>

		<div>
			<Table>
			<TableHeader className="bg-blue-100 hover:bg-blue-100">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
					return (
						<TableHead key={header.id} >
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
					colSpan={incidenciasColumns.length}
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
			<div className="flex-1 text-sm text-muted-foreground">
			{table.getFilteredSelectedRowModel().rows.length} de{" "}
			{table.getFilteredRowModel().rows.length} items seleccionados.
			</div>

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