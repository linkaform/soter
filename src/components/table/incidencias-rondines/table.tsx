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
import { CalendarDays, Eraser, Eye, FileX2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { useMemo, useState } from "react";
import { EliminarIncidenciaModal } from "@/components/modals/delete-incidencia-modal";
import { catalogoFechas, convertirDateToISO, downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateTime from "@/components/dateTime";
import { EditarIncidenciaModal } from "@/components/modals/editar-incidencia";
import ViewImage from "@/components/modals/view-image";
import { Checkbox } from "@/components/ui/checkbox";
import { SeguimientoIncidenciaLista } from "@/components/modals/add-seguimientos";
import { Incidencia_record, OptionsCell } from "./incidencias-rondines-columns";
import { ViewIncidenciaRondin } from "@/components/modals/view-incidencia-rondin";
import { AddIncidenciaRondinesModal } from "@/components/modals/add-incidencia-rondines";

interface ListProps {
	showTabs:boolean
	data: any[];
	isLoading:boolean;
	openModal: boolean;
	setOpenModal:React.Dispatch<React.SetStateAction<boolean>>;
	resetTableFilters: () => void;
	setSelectedIncidencias:React.Dispatch<React.SetStateAction<string[]>>;
	selectedIncidencias:string[];

	setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
	setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
	date1:Date| ""
	date2:Date| ""
	dateFilter: string;
	setDateFilter :React.Dispatch<React.SetStateAction<string>>;
	Filter:() => void;
}

const incidenciasColumnsCSV = [
  { label: 'Folio', key: 'folio' },
  { label: 'Ubicacion', key: 'ubicacion_incidencia' },
  { label: 'Lugar del Incidente', key: 'area_incidencia' },
  { label: 'Fecha y hora', key: 'fecha_hora_incidencia' },
  { label: 'Comentarios', key: 'comentario_incidencia' },
  { label: 'Reporta', key: 'reporta_incidencia' },
];

const IncidenciasRondinesTable:React.FC<ListProps> = ({ showTabs, data, isLoading, openModal, setOpenModal,setSelectedIncidencias,selectedIncidencias,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter, resetTableFilters
 })=> {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
	const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
	const [tabSelected, setTabSelected] = useState("datos")
	const [modalVerAbierto, setModalVerAbierto] = useState(false);
	const [modalSeguimientoAbierto, setModalSeguimientoAbierto] = useState(false);
	const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
	const [modalEliminarMultiAbierto, setModalEliminarMultiAbierto] = useState(false);
	const [incidenciaSeleccionada, setIncidenciaSeleccionada] = useState<Incidencia_record | null>(null);

	const [ setSeguimientos] = useState<any>([]);
	const [editarSeguimiento, setEditarSeguimiento] = useState(false);
	const [seguimientoSeleccionado] = useState(null);


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
	
	const handleEliminar = (incidencia: Incidencia_record) => {
		setIncidenciaSeleccionada(incidencia);
		setModalEliminarAbierto(true);
	};
	const handleSeguimiento = (incidencia: Incidencia_record) => {
		setIncidenciaSeleccionada(incidencia);
		setModalSeguimientoAbierto(true);
	};

	const handleVer= (incidencia: Incidencia_record) => {
		setIncidenciaSeleccionada(incidencia);
		setModalVerAbierto(true);
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
				<OptionsCell row={row} onEliminarClick={handleEliminar} onSeguimientoClick={handleSeguimiento} onView={()=>{handleVer(row.original)}}/>
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
				id: "incidente",
				header: "Incidencia",
				accessorFn: (row: any) => {
					return `${row.categoria} / ${row.subcategoria} / ${row.incidente}`;
				},
				cell: ({ row }: { row: Row<any> }) => {
					const { categoria, subcategoria, incidente } = row.original;
					return (
					<div className="capitalize">
						{`${categoria} / ${subcategoria} / ${incidente}`}
					</div>
					);
				},
				enableSorting: true,
			},
			{
				accessorKey:"nombre_del_recorrido",
				header: "Recorrido",
				cell: ({ row }:{row: Row <any>}) => {
				return (
				  <span  className="px-4 py-2 block max-w-xs truncate"
				 title={row.getValue("nombre_del_recorrido") || "-"} >{row.getValue("nombre_del_recorrido")}</span>
				);
				},
				enableSorting: true,
			  },
			{
				accessorKey: "comentarios",
				header: "Comentarios",
				cell: ({ row }:{row: Row <any>}) => {
				return (
				  <span  className="px-4 py-2 block max-w-xs truncate"
				 title={row.getValue("comentarios") || "-"} >{row.getValue("comentarios")}</span>
				);
				},
				enableSorting: true,
			  },
			  {
				accessorKey: "accion_tomada",
				header: "Acción",
				cell: ({ row }:{row: Row <any>}) => {
				return (
				  <span  className="px-4 py-2 block max-w-xs truncate"
				 title={row.getValue("accion_tomada") || "-"} >{row.getValue("accion_tomada")}</span>
				);
				},
				enableSorting: true,
			  },
			{
			  accessorKey: "evidencias",
			  header: "Evidencia",
			  cell: ({ row }:{row: Row <any> }) => {
			  const foto = row.original.evidencias;
			  return(<ViewImage imageUrl={foto ?? []} /> )},
			  enableSorting: false,
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
			{showTabs&&
                <div className="flex justify-center items-center">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 
			}
				<div className="flex w-full max-w-sm items-center space-x-2">
				<input
					type="text"
					placeholder="Buscar"
					value={globalFilter || ''}
					onChange={(e) => setGlobalFilter(e.target.value)}
					className="border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full" 
				/>
					<Search />
				</div>
			</div>
			
			<div className="flex w-full justify-end gap-3">
				{dateFilter == "range" ?
				<div className="flex items-center gap-2 mr-14">
					<DateTime date={date1} setDate={setDate1} disablePastDates={false}/>
					<DateTime date={date2} setDate={setDate2} disablePastDates={false}/>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={Filter}> Filtrar</Button>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={()=>{resetTableFilters()}}> 
						<Eraser/> 
					</Button>
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
					<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600" onClick={()=>{downloadCSV(selectedIncidencias, incidenciasColumnsCSV, "incidencias.csv")}}>
						<FileX2 />
						Descargar
					</Button>
				</div>

				<div>
					<EliminarIncidenciaModal title="Eliminar Incidencias" arrayFolios={selectedIncidencias} 
					modalEliminarAbierto={modalEliminarMultiAbierto}
					setModalEliminarAbierto={setModalEliminarMultiAbierto}/>
				</div>

				{modalVerAbierto && incidenciaSeleccionada && (
					<ViewIncidenciaRondin 
						title="Información de la Incidencia"
						data={incidenciaSeleccionada} isSuccess={modalVerAbierto}
						tab={tabSelected}
						setTab={setTabSelected}
						setIsSuccess={setModalVerAbierto}>
						<div className="cursor-pointer" title="Ver Incidencia">
						<Eye /> 
						</div>
					</ViewIncidenciaRondin>
				)}

				{modalEditarAbierto && incidenciaSeleccionada && (
					<EditarIncidenciaModal
					title="Editar Incidencia"
					selectedIncidencia={incidenciaSeleccionada.incidencia}
					data={incidenciaSeleccionada}
					modalEditarAbierto={modalEditarAbierto}
					setModalEditarAbierto={setModalEditarAbierto}
					onClose={() => setModalEditarAbierto(false)}
					tab={tabSelected}
					setTab={setTabSelected}
					/>
				)}

				{modalEliminarAbierto && incidenciaSeleccionada && (
					<EliminarIncidenciaModal title="Eliminar Incidencias" arrayFolios={[incidenciaSeleccionada.folio]} 
					modalEliminarAbierto={modalEliminarAbierto}
					setModalEliminarAbierto={(state) => {
						setModalEliminarMultiAbierto(state);
						if (!state) {
						 	setSelectedIncidencias([]); 
							setRowSelection({});
							setModalEliminarAbierto(state)
						}
					  }}/>
				)}

					<AddIncidenciaRondinesModal title="Crear incidencia" isSuccess={openModal} setIsSuccess={setOpenModal} >
						
					</AddIncidenciaRondinesModal>

				{modalSeguimientoAbierto && incidenciaSeleccionada && (
					<SeguimientoIncidenciaLista
						title="Seguimiento Incidencia"
						isSuccess={modalSeguimientoAbierto}
						setIsSuccess={setModalSeguimientoAbierto}
						seguimientoSeleccionado={seguimientoSeleccionado}
						setSeguimientos={setSeguimientos}
						setEditarSeguimiento={setEditarSeguimiento}
						editarSeguimiento={editarSeguimiento}
						indice={0}
						dateIncidencia={incidenciaSeleccionada.fecha_hora_incidencia ? convertirDateToISO(new Date(incidenciaSeleccionada.fecha_hora_incidencia)):""}
						enviarSeguimiento={true}
						folioIncidencia={incidenciaSeleccionada.folio}
						estatusIncidencia={incidenciaSeleccionada.estatus}
						>
						<div></div>
					</SeguimientoIncidenciaLista>
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
export default IncidenciasRondinesTable;