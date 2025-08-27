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
import { CalendarDays,  Eraser,  Eye,  FileX2,  Plus,  Search, Trash2 } from "lucide-react";



import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {Fallas_record, getFallasColumns } from "./fallas-columns";
import { EliminarFallaModal } from "@/components/modals/delete-falla-modal";
import { catalogoFechas, downloadCSV } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import DateTime from "@/components/dateTime";
import { useMemo, useState } from "react";
import { EditarFallaModal } from "@/components/modals/editar-falla";
import { SeguimientoFallaModal } from "@/components/modals/add-seguimiento-falla";
import { CerrarFallaModal } from "@/components/modals/close-falla-modal";
import { ViewFalla } from "@/components/modals/view-falla";

  interface ListProps {
    data: Fallas_record[];
    isLoading:boolean;
    openModal: () => void;
	resetTableFilters: () => void;
    setSelectedFallas:React.Dispatch<React.SetStateAction<string[]>>;
    selectedFallas:string[]

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
		{ label: 'Fecha y hora', key: 'falla_fecha_hora' },
		{ label: 'Estado', key: 'falla_estatus' },
		{ label: 'Ubicacion', key: 'falla_ubicacion' },
		{ label: 'Lugar del Fallo', key: 'falla_caseta' },
		{ label: 'Falla', key: 'falla' },
		{ label: 'Comentarios', key: 'falla_comentarios' },
		{ label: 'Reporta', key: 'falla_reporta_nombre' },
		{ label: 'Responsable', key: 'falla_responsable_solucionar_nombre' },
	];
  
  const FallasTable:React.FC<ListProps> = ({ isLoading, data, openModal, setSelectedFallas, selectedFallas,
		setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter,resetTableFilters
	})=> {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
	const [modalVerSeguimientoAbierto, setModalVerSeguimientoAbierto] = useState(false);
	const [modalSeguimientoAbierto, setModalSeguimientoAbierto] = useState(false);
	const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
	const [modalEliminarMultiAbierto, setModalEliminarMultiAbierto] = useState(false);
	const [modalCerrarAbierto, setModalCerrarAbierto] = useState(false);
	const [fallaSeleccionada, setFallaSeleccionada] = useState<Fallas_record | null>(null);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 23,
	});

	// const handleEditar = (falla: Fallas_record) => {
	// 	setFallaSeleccionada(falla);
	// 	setModalEditarAbierto(true);
	// };
	
	// const handleSeguimiento= (falla: Fallas_record) => {
	// 	setFallaSeleccionada(falla);
	// 	setModalSeguimientoAbierto(true);
	// };
	
	const handleEliminar= (falla: Fallas_record) => {
		setFallaSeleccionada(falla);
		setModalEliminarAbierto(true);
	};

	const handleCerrar= (falla: Fallas_record) => {
		setFallaSeleccionada(falla);
		setModalCerrarAbierto(true);
	};

	const handleVer= (falla: Fallas_record) => {
		setFallaSeleccionada(falla);
		setModalVerSeguimientoAbierto(true);
	};
	

	const [globalFilter, setGlobalFilter] = React.useState("");
	
	const columns = useMemo(() => {
	if (isLoading) return [];
	return getFallasColumns( handleEliminar, handleCerrar, handleVer);
	}, [isLoading]);

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
		setSelectedFallas(folios)
		}
	},[table.getFilteredSelectedRowModel().rows])
	
return (
    <div className="w-full">
		<div className="flex justify-between items-center my-2 gap-3">
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
				
				
				<Button
				variant="destructive"
				onClick={() => setModalEliminarMultiAbierto(true)}
				disabled={selectedFallas.length === 0} 
				>
						<Trash2 />  
					Eliminar
				</Button>

				<div>
					<EliminarFallaModal
						title="Eliminar Falla"
						arrayFolios={selectedFallas} setModalEliminarAbierto={setModalEliminarMultiAbierto} modalEliminarAbierto={modalEliminarMultiAbierto}/>
				</div>
				
				</div>
			</div>
			
			{modalEditarAbierto && fallaSeleccionada && (
				<EditarFallaModal
					title="Editar Falla"
					data={fallaSeleccionada}
					modalEditarAbierto={modalEditarAbierto}
					setModalEditarAbierto={setModalEditarAbierto}
					onClose={() => setModalEditarAbierto(false)}
				/>
			)}


			{modalVerSeguimientoAbierto && fallaSeleccionada && (
				<ViewFalla 
					title="Información de la Falla"
					data={fallaSeleccionada} isSuccess={modalVerSeguimientoAbierto}
					setIsSuccess={setModalVerSeguimientoAbierto} setModalEditarAbierto={setModalEditarAbierto }>
					<div className="cursor-pointer" title="Ver Falla">
						<Eye /> 
					</div>
				</ViewFalla>
			)}

			{modalSeguimientoAbierto && fallaSeleccionada && (
				<SeguimientoFallaModal
					title="Seguimiento Falla"
					data={fallaSeleccionada} isSuccess={modalSeguimientoAbierto} setIsSuccess={setModalSeguimientoAbierto}
				/>
			)}
			{modalEliminarAbierto && fallaSeleccionada && (
				<EliminarFallaModal
					title="Eliminar Falla"
					arrayFolios={[fallaSeleccionada.folio]}
					modalEliminarAbierto={modalEliminarAbierto}
					setModalEliminarAbierto={setModalEliminarAbierto}
					/>
			)}

			{modalCerrarAbierto && fallaSeleccionada && (
				<CerrarFallaModal
					title="Cerrar Falla"
					folio={fallaSeleccionada.folio}
					modalCerrarAbierto={modalCerrarAbierto}
					setModalCerrarAbierto={setModalCerrarAbierto}
					/>
			)}
		</div>
		<div className="">
			<Table>
			<TableHeader className="bg-blue-100 hover:bg-blue-100">
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

