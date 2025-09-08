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
import {  Bitacora_record, getBitacorasColumns } from "./bitacoras-columns";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DateTime from "@/components/dateTime";
import { catalogoFechas } from "@/lib/utils";
import { DoOutModal } from "@/components/modals/do-out-modal";
import { AddBadgeModal } from "@/components/modals/add-badge-modal";
import { ReturnGafeteModal } from "@/components/modals/return-gafete-modal";

interface ListProps {
	data: Bitacora_record[]|undefined;
	isLoading:boolean;
	setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
	setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
	date1:Date| ""
	date2:Date| ""
	dateFilter: string;
	setDateFilter :React.Dispatch<React.SetStateAction<string>>;
	Filter:() => void;
}


const BitacorasTable:React.FC<ListProps> = ({ data, isLoading, setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter})=> {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const [modalRegresarGafeteAbierto, setModalRegresarGafeteAbierto] = useState(false);
	const [modalAgregarBadgeAbierto, setModalAgregarBadgeAbierto] = useState(false);
	const [modalSalidaAbierto, setModalSalidaAbierto] = useState(false);
	const [bitacoraSeleccionada, setBitacoraSeleccionada] = useState<Bitacora_record | null>(null);

	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 23,
	});

	const handleRegresarGafete = (bitacora: Bitacora_record) => {
		setBitacoraSeleccionada(bitacora);
		setModalRegresarGafeteAbierto(true);
	};
	
	const handleAgregarBadge= (bitacora: Bitacora_record) => {
		setBitacoraSeleccionada(bitacora);
		setModalAgregarBadgeAbierto(true);
	};
	
	const handleSalida= (bitacora: Bitacora_record) => {
		setBitacoraSeleccionada(bitacora);
		setModalSalidaAbierto(true);
	};
	


  	const [globalFilter, setGlobalFilter] = React.useState("");
	const columns = useMemo(() => {
		if (isLoading) return [];
		return getBitacorasColumns(handleRegresarGafete, handleAgregarBadge, handleSalida);
	}, [isLoading]);
   	const memoizedData = useMemo(() => data || [], [data]);

  	const table = useReactTable({
		data: memoizedData,
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
		globalFilterFn: 'includesString', 
		
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
			<div className="flex w-1/2 justify-start gap-4 ">
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
					value={globalFilter || ''}
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

			{modalRegresarGafeteAbierto && bitacoraSeleccionada  ? (
				<ReturnGafeteModal 
					title={"Recibir Gafete"} 
					id_bitacora={bitacoraSeleccionada._id}
					ubicacion={bitacoraSeleccionada.ubicacion} 
					area={bitacoraSeleccionada?.status_visita?.toLowerCase() == "entrada" ? bitacoraSeleccionada.caseta_entrada : bitacoraSeleccionada.caseta_salida || ""} 
					fecha_salida={bitacoraSeleccionada.fecha_salida} 
					gafete={bitacoraSeleccionada.id_gafet} 
					locker={bitacoraSeleccionada.id_locker||""} 
					tipo_movimiento={bitacoraSeleccionada?.status_visita?.toLowerCase()}
					modalRegresarGafeteAbierto={modalRegresarGafeteAbierto}
					setModalRegresarGafeteAbierto={setModalRegresarGafeteAbierto}
					/> 
			):null}

			{ modalAgregarBadgeAbierto && bitacoraSeleccionada ? (
				<AddBadgeModal 
					title={"Gafete"} 
					status={"Disponible"} 
					id_bitacora= {bitacoraSeleccionada._id}
					tipo_movimiento={bitacoraSeleccionada.status_visita} 
					ubicacion={bitacoraSeleccionada.ubicacion} 
					area={bitacoraSeleccionada?.status_visita?.toLowerCase()=="entrada" ? bitacoraSeleccionada.caseta_entrada: bitacoraSeleccionada.caseta_salida||""}
					modalAgregarBadgeAbierto={modalAgregarBadgeAbierto}
					setModalAgregarBadgeAbierto={setModalAgregarBadgeAbierto}
					/>
			):null}

			{modalSalidaAbierto && bitacoraSeleccionada ? (
				<DoOutModal 
					title={"Registar Salida"} 
					id_bitacora={bitacoraSeleccionada.codigo_qr} ubicacion={bitacoraSeleccionada.ubicacion} 
					area={bitacoraSeleccionada?.status_visita?.toLowerCase() == "entrada" ? bitacoraSeleccionada.caseta_entrada : bitacoraSeleccionada.caseta_salida || ""} 
					fecha_salida={bitacoraSeleccionada.fecha_salida}
					modalSalidaAbierto={modalSalidaAbierto}
					setModalSalidaAbierto={setModalSalidaAbierto}
					/>
			):null}

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
						colSpan={table.getVisibleFlatColumns().length}
						className="h-36 text-center font-medium"
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
export default BitacorasTable;