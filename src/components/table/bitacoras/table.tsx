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
import { ChevronDown, FileX2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  Bitacora_record, bitacorasColumns } from "./bitacoras-columns";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { downloadCSV } from "@/lib/utils";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import ChangeLocation from "@/components/changeLocation";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";


interface ListProps {
  refetch:() => void;
  data: Bitacora_record[];
  setSelectedOption: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading:boolean;
}

const fallasColumnsCSV = [
  { label: 'Folio', key: 'folio' },
  { label: 'Visitante', key: 'nombre_visitante' },
  { label: 'Fecha de entrada', key: 'fecha_entrada' },
  { label: 'Fecha de salida', key: 'fecha_salida' },
  { label: 'Tipo', key: 'perfil_visita' },
  { label: 'Contratista', key: 'contratista' },
  { label: 'Visita a', key: 'formated_visita' },
  { label: 'Caseta de entrada', key: 'caseta_entrada' },
  { label: 'Caseta de salida', key: 'caseta_salida' },
  { label: 'Gafete', key: 'id_gafet' },
  { label: 'Locker', key: 'id_locker' },
  { label: 'Comentarios', key: 'formated_comentarios' },
];

const BitacorasTable:React.FC<ListProps> = ({ refetch, data, setSelectedOption, isLoading})=> {
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>("");
	const { dataAreas:catAreas, dataLocations:ubicaciones, isLoadingAreas:loadingCatAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true, ubicacionSeleccionada?true:false);
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

 
  const table = useReactTable({
    data: data||[],
    columns: isLoading ? []:bitacorasColumns,
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


  useEffect(()=>{
    refetch()
  },[])


  const handleValueChange = (value:string) => {
    setSelectedOption([value]);
  };

    // Función que se ejecuta cuando se selecciona un valor
	const handleSelectChange = (value:string) => {
		setUbicacionSeleccionada(value); // Actualiza el estado con el valor seleccionado
	  };

return (
    <div className="w-full">
		<div className="flex justify-between items-center my-2 gap-3">
			<div className="flex">
				<TabsList className="bg-blue-500 text-white">
					<TabsTrigger value="Personal">Personal</TabsTrigger>
					<TabsTrigger value="Locker">Locker</TabsTrigger>
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
				<ChangeLocation location={""} area={""} all={false} setAreas={() => { } } setLocations={() => { } } 
				setAll={()=>{}}>
				</ChangeLocation>
			</div>

			<div className="flex items-center gap-2">
				<span className="text-lg font-semibold whitespace-nowrap">Tipo de Movimiento:</span>
					<Select onValueChange={handleSelectChange} defaultValue={""}>
						<SelectTrigger>
						<SelectValue placeholder="Selecciona una opción" />
						</SelectTrigger>
					<SelectContent>
						<SelectItem value="entrada">Abierto</SelectItem>
						<SelectItem value="salida">Cerrado</SelectItem>
					</SelectContent>
					</Select>
				</div>

			<div className="flex flex-wrap gap-2">
				<div>
					<Button className="bg-blue-500 w-full md:w-auto hover:bg-blue-600 text-white px-4 py-2" onClick={()=>{downloadCSV(data, fallasColumnsCSV, "bitacora.csv")}}>
						<FileX2 />
						Descargar
					</Button>
				</div>

				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto w-full md:w-auto ">
							Columnas <ChevronDown />
						</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column:any) => column.getCanHide())
							.map((column:any) => {
							return (
								<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value:boolean) =>
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

		<div className="">
			<Table>
				<TableHeader className="bg-blue-100 hover:bg-blue-100">
					{table.getHeaderGroups().map((headerGroup:any) => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map((header:any) => {
						return (
							<TableHead key={header.id}>
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
					table.getRowModel().rows.map((row:any) => (
						<TableRow
						key={row.id}
						data-state={row.getIsSelected() && "selected"}
						
						>
						{row.getVisibleCells().map((cell:any) => (
							<TableCell key={cell.id} >
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
						colSpan={bitacorasColumns.length}
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
export default BitacorasTable;