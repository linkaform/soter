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
import { CalendarDays, Eraser, MapPin, Menu, MoveLeft, Plus, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SelectReact from 'react-select';
import {  getRondinesColumns, Recorrido } from "./rondines-columns";
import { Tabs, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent, TabsList } from "@radix-ui/react-tabs";
import { catalogoFechas } from "@/lib/utils";
import DateTime from "@/components/dateTime";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { AddRondinModal } from "@/components/modals/add-rondin";
import { useMemo, useState } from "react";
import { EliminarRondinModal } from "@/components/modals/delete-rondin-modal";
import { EditarRondinModal } from "@/components/modals/editar-rondin";


interface ListProps {
	data: any[];
	isLoading:boolean;
	resetTableFilters: () => void;
	setSelectedRondin:React.Dispatch<React.SetStateAction<string[]>>;
	selectedRondin:string[];

	setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
	setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
	date1:Date| ""
	date2:Date| ""
	dateFilter: string;
	setDateFilter :React.Dispatch<React.SetStateAction<string>>;
	Filter:() => void;
}


const fotos: string[]=[
	// 'https://cdn-3.expansion.mx/dims4/default/685434a/2147483647/strip/true/crop/1550x676+0+0/resize/1200x523!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F21%2F78%2Fe052aec14a47ab373f1a185e2b81%2Fistock-1397038664.jpg',
	// 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQA5rDSZ2ecN7r_I2F_aoUsH8Ol0sYPQ4-Q&s',
	// 'https://previews.123rf.com/images/bialasiewicz/bialasiewicz1305/bialasiewicz130500224/19688905-entrance-and-reception-in-a-new-contemporary-office-building.jpg',
	// 'https://www.bizneo.com/blog/wp-content/uploads/2020/04/departamentos-de-una-empresa-810x455.jpg.webp',
	// 'https://content.knightfrank.com/property/spn1190a/images/011ff73f-b280-4ddd-8815-54aa12e18fe8-0.jpg?cio=true&w=1200',
	// 'https://img.freepik.com/fotos-premium/interior-hall-entrada-moderno-edificio-oficinas-moderno_308547-4141.jpg',
]

const items = [
	{ id: 1, name: "Entrada principal" },
	{ id: 2, name: "Zona de carga" },
	{ id: 3, name: "Estacionamiento" },
	{ id: 4, name: "Oficinas" },
	{ id: 5, name: "Patio trasero" },
	{ id: 6, name: "Bodega" },
  ];


const areas = ["Entrada principal", "Zona de carga", "Patio trasero","Entrada principal", "Zona de carga", "Patio trasero","Entrada principal", "Zona de carga", "Patio trasero"];
const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom","Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom","Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom", "Lun", "Mar","Mié", "Jue", "Vie",];

const RondinesTable:React.FC<ListProps> = ({ data, isLoading,setSelectedRondin,selectedRondin,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter, resetTableFilters
 })=> {
	console.log(setSelectedRondin, selectedRondin)
	const [selectedRow, setSelectedRow] = React.useState<any | null>(null);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [rondinSeleccionado, setRondinSeleccionado] = useState<Recorrido | null>(null);
  const [verRondin, setVerRondin] = useState(false);

  const handleEliminar= (rondin: Recorrido) => {
		setRondinSeleccionado(rondin);
		setModalEliminarAbierto(true);
	};

	const handleVerRondin= (rondin:Recorrido)=>{
		setRondinSeleccionado(rondin); 
		setVerRondin(true);
	}

	const handleEditarRondin= (rondin:Recorrido)=>{
		console.log("rondin", rondin);
		setRondinSeleccionado(rondin); 
		setModalEditarAbierto(true); 
	}
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 25,
  });

  const [globalFilter, setGlobalFilter] = React.useState("");
  
  const columns = useMemo(() => {
	if (isLoading) return [];
	return getRondinesColumns(handleEliminar,handleVerRondin, handleEditarRondin);
}, [isLoading]);

	const memoizedData = useMemo(() => data || [], [data]);

  const table = useReactTable({
    data: memoizedData ?? [],
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

  return (
  	<div className="w-full">
		<div className="flex justify-between items-center my-2">
			<div className="flex w-full justify-start gap-4 ">
				<div className="flex justify-center items-center">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 
				
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
				<AddRondinModal title={"Crear Rondin"} >
					<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
						<Plus />
						Crear Rondin
					</Button>
				</AddRondinModal>
				{/* <Button
				variant="destructive"
				onClick={() => setModalEliminarMultiAbierto(true)}
				disabled={selectedRondin.length === 0} 
				>
					<Trash2 />  
					Eliminar
				</Button>

				<div>
					<EliminarIncidenciaModal title="Eliminar Incidencias" arrayFolios={selectedRondin} 
					modalEliminarAbierto={modalEliminarMultiAbierto}
					setModalEliminarAbierto={setModalEliminarMultiAbierto}/>
				</div> */}


				{modalEditarAbierto && rondinSeleccionado && (
					<EditarRondinModal
					title="Editar Rondin"
					data={rondinSeleccionado}
					modalEditarAbierto={modalEditarAbierto}
					setModalEditarAbierto={setModalEditarAbierto}
					onClose={() => setModalEditarAbierto(false)}
					/>
				)}

				
				 {modalEliminarAbierto && rondinSeleccionado && (
					<EliminarRondinModal title="Eliminar Rondin" folio={rondinSeleccionado.folio} 
					modalEliminarAbierto={modalEliminarAbierto}
					setModalEliminarAbierto={setModalEliminarAbierto}/>
				)}

			</div>
			</div>
    	</div>
		{selectedRondin && verRondin ? (
			// Contenido alternativo al seleccionar una fila
			<div className="flex flex-col h-full">
				<div className="flex">
					<div className=" w-1/2 border rounded-md bg-white shadow-md pl-4 min-h-[550px] ">

						<div className="mt-4 flex">
							<Button onClick={() => {setSelectedRow(null); setVerRondin(false)}} className="bg-transparent hover:bg-transparent cursor-pointer">
							<MoveLeft className="text-black w-64"/>
							</Button>
							<h2 className="text-xl font-bold mb-4">Inspeccion perimetro exterior</h2>
						</div>
				
						<div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
						<div className="flex ">
							<span className="font-semibold min-w-[130px]">Descripcion:</span>
							<span >
							{selectedRow?.folio} Esta es una descripcion y lorem ipsum dolor si amet constectur adisciption elit, Eitam eu triepu molkeste, dictum est, a mattis tellus.
							</span>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Recurrencia:</span>
							<div className="flex justify-between gap-5">
								<span >
								{selectedRow?.recurrencia} Semanalmente los Jueves
								</span>
								<Button onClick={() => {setSelectedRow(null);setVerRondin(false);}} className="bg-blue-500 hover:bg-blue-600 cursor-pointer p-2">
									Editar
								</Button>
							</div>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Asignado a:</span>
							<div className="w-1/2">
								<SelectReact
									aria-labelledby="aria-label"
									inputId="select-categorias"
									name="categoria"
									options={[]}
									value={null} 
									isDisabled={false}
								/>
							</div>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Ubicacion:</span>
							<div className="w-1/2">
								<SelectReact
									aria-labelledby="aria-label"
									inputId="select-categorias"
									name="categoria"
									options={[]}
									value={null} 
									isDisabled={false}
								/>
							</div>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Geolocalizacion:</span>
							<div className="flex">
							<MapPin/> Ver en mapa
							</div>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Estatus:</span>
							<span >
							En proceso
							</span>
						</div>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Inicio:</span>
							<span >
							15/05/25 1:42:23 hr
							</span>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion promedio:</span>
							<span >
							63 horas
							</span>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion esperada:</span>
							<span >
							50 min
							</span>
						</div>
						<div className="flex">
							<span className="font-semibold min-w-[130px]">Finalizacion:</span>
							<span >
							15/05/25 2:30:45 hrs
							</span>
						</div>

						</div>
					
					</div>
					<div className="w-2/3 ml-4 p-4 border rounded-md bg-white shadow-md">	
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{fotos.map((val, idx) => (
							<div key={idx} className="rounded overflow-hidden shadow-md">
							<Image
							    height={100}
							    width={100}
								src={val}
								alt={`Demo ${idx + 1}`}
								className="w-full h-48 object-cover"
							/>
							</div>
						))}
						</div>	
					</div>
				</div>
				<div className="flex mt-4">
					<div className="w-full max-w-2xl mx-auto space-y-4">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Puntos de rondin: {items.length} puntos</h2>
							<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
							Agregar Área
							</button>
						</div>

						{/* Buscador */}
						<div className="relative">
							<Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
							<input
							type="text"
							placeholder="Search"
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-400"
							/>
						</div>

						{/* Lista */}
						<div className="space-y-2">
							{items.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between border border-gray-200 rounded p-3 bg-white shadow-sm"
							>
								<div>
								<p className="font-medium">{item.name}</p>
								<small className="flex items-center text-gray-500 mt-1">
									<Menu className="mr-1 h-4 w-4" /> Ordenar
								</small>
								</div>
								<button className="text-red-600 hover:text-red-800">
								<Trash2 className="w-5 h-5" />
								</button>
							</div>
							))}
						</div>
					</div>
					<div className="w-2/3 ml-4 p-4 border rounded-md bg-white shadow-md">	
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-full w-full">
						{[].map((val, idx) => (
						<div key={idx} className="rounded overflow-hidden shadow-md min-w-max h-full">
							<Image
							width={100}
							height={100}
							src={val}
							alt={`Demo ${idx + 1}`}
							className="w-full h-full object-cover"
							/>
						</div>
						))}
					</div>	
					</div>
				</div>


				<div className="flex w-full h-full">
						<Tabs defaultValue="rondiness" className="w-full">
						{/* Tabs header */}
							<TabsList className="flex border-b border-gray-300 mb-4">
								<TabsTrigger
								value="rondiness"
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
								>
								Rondines
								</TabsTrigger>
								<TabsTrigger
								value="incidentes"
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
								>
								Incidentes
								</TabsTrigger>
								<TabsTrigger
								value="fotos"
								className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-500"
								>
								Fotos
								</TabsTrigger>
							</TabsList>

							{/* Tabs content */}
							<TabsContent value="rondiness">
								<div className="p-4 border rounded-md bg-white shadow">
								<h3 className="font-semibold text-lg mb-2">Contenido de Rondines</h3>
								<div >
									<table className="min-w-max table-auto border-collapse">
										<thead>
										<tr>
											<th className="text-left px-4 py-2 border bg-gray-100">Listado de áreas</th>
											{dias.map((dia, idx) => (
											<th key={idx} className="px-2 py-2 border text-sm text-center bg-gray-100 w-16">
												{dia}
											</th>
											))}
										</tr>
										</thead>
										<tbody>
										{areas.map((area, rowIdx) => (
											<tr key={rowIdx} className="border-t">
											<td className="px-4 py-2 text-left font-medium border">{area}</td>
											{dias.map((_, colIdx) => (
												<td key={colIdx} className="px-2 py-1 text-center border">
												{/* Ejemplo: alternar entre paloma y signo */}
												{Math.random() > 0.5 ? (
													<button className="bg-green-100 text-green-600 text-sm rounded-full px-2 py-1">
													✅
													</button>
												) : (
													<button className="bg-red-100 text-red-600 text-sm rounded-full px-2 py-1">
													❗
													</button>
												)}
												</td>
											))}
											</tr>
										))}
										</tbody>
									</table>
								</div>
								</div>
							</TabsContent>

							<TabsContent value="incidentes">
								<div className="p-4 border rounded-md bg-white shadow">
								<h3 className="font-semibold text-lg mb-2">Contenido de Incidentes</h3>
								<p>Información sobre incidentes registrados.</p>
								</div>
							</TabsContent>

							<TabsContent value="fotos">
								<div className="p-4 border rounded-md bg-white shadow">
								<h3 className="font-semibold text-lg mb-2">Contenido de Fotos</h3>
								<p>Galería o imágenes del sitio.</p>
								</div>
							</TabsContent>
						</Tabs>
				</div>
			</div>

			
		) : (
		<div>
			<Table>
			<TableHeader className="bg-blue-100 hover:bg-blue-100 ">
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
					// onClick={() =>{ handleVerRondin(row.original)}} 
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
				<TableRow >
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
		)}
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
export default RondinesTable;