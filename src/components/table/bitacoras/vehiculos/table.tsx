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
import { FileX2, Search } from "lucide-react";
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
import {  Bitacora_record, vehiculosColumns } from "./vehiculos-columns";
import { downloadCSV } from "@/lib/utils";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { SelectTrigger } from "@radix-ui/react-select";
// import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";


interface ListProps {
  data: Bitacora_record[];
//   setSelectedOption: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading:boolean;

//   setUbicacionSeleccionada: React.Dispatch<React.SetStateAction<string>>;
//   setAreaSeleccionada:React.Dispatch<React.SetStateAction<string>>;
//   areaSeleccionada:string;
//   ubicacionSeleccionada:string;
//   setAll:React.Dispatch<React.SetStateAction<boolean>>;
//   all:boolean;
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

const VehiculosTable:React.FC<ListProps> = ({ data, isLoading })=> {
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
    data: data||[],
    columns: isLoading ? []:vehiculosColumns,
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

	// const handleSelectChange = (value:string) => {
	// 	setSelectedOption([value]); // Actualiza el estado con el valor seleccionado
	//   };

return (
    <div className="w-full">
		<div className="flex justify-between items-start my-1 gap-3">
			<div className="flex w-full justify-start gap-4">
				<TabsList className="bg-blue-500 text-white">
					<TabsTrigger value="Personal">Personal</TabsTrigger>
                    <TabsTrigger value="Vehiculos">Vehiculos</TabsTrigger>
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

			<div className="flex justify-start">
				
			</div>


			{/* <div className="flex w-1/3 gap-2"> 
				 <ChangeLocation ubicacionSeleccionada={ubicacionSeleccionada} areaSeleccionada={areaSeleccionada} 
        		setUbicacionSeleccionada={setUbicacionSeleccionada} setAreaSeleccionada={setAreaSeleccionada} setAll={setAll} all={all}>
				</ChangeLocation> 
			</div> */}
{/* 
			<div className="flex items-center gap-2">
				<span className="text-lg font-semibold whitespace-nowrap">Tipo de Movimiento:</span>
				<Select defaultValue={""}>
					<SelectTrigger>
					<SelectValue placeholder="Selecciona una opción" />
					</SelectTrigger>
				<SelectContent>
					<SelectItem value="abierto">Abierto</SelectItem>
					<SelectItem value="cerrado">Cerrado</SelectItem>
				</SelectContent>
				</Select>
			</div> */}

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
						colSpan={vehiculosColumns.length}
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
export default VehiculosTable;