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
import { Eraser, List, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { EquipoAutorizadoColumns } from "./equipos-autorizados-columns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EqipmentLocalPassModal } from "@/components/modals/add-local-equipo";
import { Equipo } from "@/lib/update-pass";
import { SelectedEquiposModal } from "@/components/modals/modal-selected-equipos";

interface TableProps {
	selectedEquipos: Equipo[]
	setSelectedEquipos: (equipos: Equipo[])=> void
	equipos:Equipo[]
	setEquipos: React.Dispatch<React.SetStateAction<Equipo[]>>
	tipoMovimiento:string
}

export const EquiposAutorizadosTable: React.FC<TableProps> = ({ equipos, setEquipos, setSelectedEquipos, selectedEquipos, tipoMovimiento}) => {
	// equipos: Estado que contiene los equipos, se usa cuando se pasa directamente el estado 
	// setEquipos: Estado para setear nuevos equipos, se usa cuando se pasa directamente el estado 
	// setSelectedEquipos: Funcion para setear nuevos equipos,  se usa en accesos, donde usamos el store, para poder pasar la funcion de seteo entre pantallas y modales y facilitar su uso
	// selectedEquipos : Estado que contiene los equipos selecteccionados, se usa en accesos, donde usamos el store, para poder pasar la funcion de seteo entre pantallas y modales y facilitar su uso

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 8,
	});

	const [globalFilter, setGlobalFilter] = React.useState("");

	const table = useReactTable({
		data: equipos || [],
		columns: EquipoAutorizadoColumns,
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

	return (
		<div className="w-full">
		{/* Botones a la derecha */}
		<div className="flex justify-between mb-3 space-x-3">
			<div className="mb-3">
			<h1 className="text-2xl font-bold">Equipos Autorizados</h1>
			</div>
			<div className="flex gap-2">
			<EqipmentLocalPassModal title="Nuevo Equipo" equipos= {equipos} setEquipos={setEquipos} isAccesos={true}>
			<Button className="bg-green-600 hover:bg-green-700 text-white" disabled={tipoMovimiento=="Salida"}>
				<Plus />
				Equipo
			</Button>
			</EqipmentLocalPassModal>

			<SelectedEquiposModal title={"Equipos seleccionados"} selectedEquipos={selectedEquipos}>
			<Button
				className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
				variant="outline"
				size={"icon"}
				disabled={tipoMovimiento=="Salida"}
			>
				<List size={36} />
			</Button>
			</SelectedEquiposModal>

			<Button
			className="bg-yellow-500 hover:bg-yellow-600 text-black"
			variant="outline"
			size={"icon"}
			disabled={tipoMovimiento=="Salida"}
			onClick={() => {
				setSelectedEquipos([]);
				table.resetRowSelection();
			}}
			>
			<Eraser />
			</Button>
			</div>
		</div>
		<div className="w-full">
			<ScrollArea className="h-44 w-full border rounded-md">
			<Table>
				<TableHeader className="bg-[#F0F2F5]">
				{table.getHeaderGroups().map((headerGroup) => (
					<TableRow key={headerGroup.id}>
					{headerGroup.headers.map((header) => {
						return (
						<TableHead key={header.id} className="h-7">
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
						colSpan={EquipoAutorizadoColumns.length}
						className="h-24 text-center"
					>
						No hay registros disponibles{" "}
					</TableCell>
					</TableRow>
				)}
				</TableBody>
			</Table>
			</ScrollArea>
		</div>
		</div>
	);
}