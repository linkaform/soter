/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";

import {
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanstackTable
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
import { Incidencia_record, OptionsCell } from "./incidencias-columns";
import { useMemo, useState } from "react";
import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
import { catalogoFechas, downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateTime from "@/components/dateTime";
import { EditarIncidenciaModal } from "@/components/modals/editar-incidencia";
import ViewImage from "@/components/modals/view-image";
import { Checkbox } from "@/components/ui/checkbox";
// import ChangeLocation from "@/components/changeLocation";

interface ListProps {
	data: Incidencia_record[];
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

const IncidenciasTable:React.FC<ListProps> = ({ data, isLoading, openModal,setSelectedIncidencias,selectedIncidencias,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter
	// setUbicacionSeleccionada, setAreaSeleccionada, areaSeleccionada, ubicacionSeleccionada
 })=> {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

	const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
	const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia_record | null>(null);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 23,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");


	const handleEditar = (incidencia: Incidencia_record) => {
		setIncidenciaSeleccionada(incidencia);
		setModalEditarAbierto(true);
	};
	

  const columns = useMemo(() => {
	if (isLoading) return [];
	 	return [
			{
			id: "select",
			cell: ({ row}: { row: Row<Incidencia_record> }) => (
				<div className="flex space-x-3 items-center">
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
				<OptionsCell row={row} onEditarClick={handleEditar} />
				</div>
			),
			header: ({ table } : { table: TanstackTable<Incidencia_record> }) => (
				<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				/>
			),
			enableSorting: false,
			enableHiding: false,
			},
			{
			  accessorKey: "folio",
			  header: "Folio",
			  cell: ({ row }:{row: Row<Incidencia_record> }) => (
			  <div className="capitalize">{row.getValue("folio")}</div>
			  ),
			  enableSorting: true,
			},
			{
			  accessorKey: "ubicacion_incidencia",
			  header: "Ubicación",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => (
			  <div className="capitalize">{row.getValue("ubicacion_incidencia")}</div>
			  ),
			  enableSorting: true,
			},
			{
			  accessorKey: "area_incidencia",
			  header: "Lugar del Incidente",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => (
			  <div className="capitalize">{row.getValue("area_incidencia")}</div>
			  ),
			  enableSorting: true,
			},
			{
			  accessorKey: "incidencia",
			  header: "Incidencia",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => (
			  <div className="capitalize">{row.getValue("incidencia")}</div>
			  ),
			  enableSorting: true,
			},
		   {
			  accessorKey: "fecha_hora_incidencia",
			  header: "Fecha",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => (
			  <div className="capitalize">{row.getValue("fecha_hora_incidencia")}</div>
			  ),
			  enableSorting: true,
			},
			{
			  accessorKey: "evidencia_incidencia",
			  header: "Evidencia",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => {
			  const foto = row.original.evidencia_incidencia;
			  // const primeraImagen = foto && foto.length > 0 ? foto[0].file_url : '/nouser.svg';
			  return(<ViewImage imageUrl={foto ?? []} /> )},
			  enableSorting: false,
		  },
			{
			  accessorKey: "comentario_incidencia",
			  header: "Comentarios",
			  cell: ({ row }:{row: Row <Incidencia_record>}) => {
			  return (
				<span>{row.getValue("comentario_incidencia")}</span>
			  );
			  },
			  enableSorting: true,
			},
			{
			  accessorKey: "reporta_incidencia",
			  header: "Reporta",
			  cell: ({ row }:{row: Row <Incidencia_record> }) => (
			  <div>{row.getValue("reporta_incidencia")}</div>
			  ),
			  enableSorting: true,
			},
		  
	];
  }, [isLoading, handleEditar]);


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


				{modalEditarAbierto && incidenciaSeleccionada && (
					<EditarIncidenciaModal
					title="Editar Incidencia"
					selectedIncidencia={incidenciaSeleccionada.incidencia}
					data={incidenciaSeleccionada}
					modalEditarAbierto={modalEditarAbierto}
					setModalEditarAbierto={setModalEditarAbierto}
					onClose={() => setModalEditarAbierto(false)}
					/>
				)}

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
					colSpan={table.getVisibleFlatColumns().length}
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