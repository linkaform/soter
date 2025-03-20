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
import { ChevronDown,  FileX2,  Plus,  Trash2 } from "lucide-react";



import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Fallas_record, fallasColumns } from "./fallas-columns";
import { EliminarFallaModal } from "@/components/modals/delete-falla-modal";
import { downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCatalogoPaseAreaLocation } from "@/hooks/useCatalogoPaseAreaLocation";
import { useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChangeLocation from "@/components/changeLocation";

  interface ListProps {
    refetch:() => void;
    data: Fallas_record[];
    setPrioridades: React.Dispatch<React.SetStateAction<string[]>>;
    isLoading:boolean;
    openModal: () => void;
    setSelectedFallas:React.Dispatch<React.SetStateAction<string[]>>;
    selectedFallas:string[]
  }
  const fallasColumnsCSV = [
    { label: 'Folio', key: 'folio' },
    { label: 'Fecha y hora', key: 'falla_fecha_hora' },
    { label: 'Estado', key: 'falla_estatus' },
    { label: 'Ubicacion', key: 'falla_ubicacion' },
    { label: 'Lugar del Fallo', key: 'falla_caseta' },
    { label: 'Falla', key: 'falla' },
    { label: 'Comentarios', key: 'falla_comentarios' },
    { label: 'Reporta', key: 'falla_reporta_nombre' },
    { label: 'Responsable', key: 'falla_responsable_solucionar_nombre' },
  ];
  
  const FallasTable:React.FC<ListProps> = ({ refetch, data, openModal, setSelectedFallas, selectedFallas})=> {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>("");
  const { dataAreas:catAreas, dataLocations:ubicaciones, isLoadingAreas:loadingCatAreas, isLoadingLocations:loadingUbicaciones} = useCatalogoPaseAreaLocation(ubicacionSeleccionada, true, ubicacionSeleccionada?true:false);
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data:data||[],
    columns: fallasColumns,
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
  
  React.useEffect(()=>{
    refetch()
  },[])

  React.useEffect(()=>{
    if(table.getFilteredSelectedRowModel().rows.length>0){
      const folios: any[] = []
      table.getFilteredSelectedRowModel().rows.map((row) => {
        folios.push(row.original);
      });
      setSelectedFallas(folios)
    }
  },[table.getFilteredSelectedRowModel().rows])
  
  const handleSelectChange = (value:string) => {
    // setSelectedOption([value]);
	console.log("Bitacoras",value)
  };

return (
    <div className="w-full">
		<div className="flex justify-between items-center my-2 gap-3">
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
					<Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2" onClick={openModal}>
						<Plus />        
						Nueva Falla
					</Button>
				</div>
				
				<div>
					<Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2" onClick={()=>{downloadCSV(selectedFallas, fallasColumnsCSV, "fallas.csv")}}>
						<FileX2 />
						Descargar
					</Button>
				</div>
				
				<div>
					<EliminarFallaModal
						title="Eliminar Falla"
						arrayFolios={selectedFallas}>
						<div className="flex flex-shrink p-2 rounded-sm px-3 w-full bg-red-500 text-white hover:bg-red-600" >
							<Trash2 />        
							Eliminar
						</div>
					</EliminarFallaModal>
				</div>

				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
							Columnas <ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) =>
									column.toggleVisibility(!!value)
									}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
								)
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

		</div>
		<div className="">
			<Table>
			<TableHeader className="bg-blue-100 hover:bg-blue-100">
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
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
					colSpan={fallasColumns.length}
					className="h-24 text-center"
					>
					No hay registros disponibles</TableCell>
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
export default FallasTable;

