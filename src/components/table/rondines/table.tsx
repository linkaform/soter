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
import { CalendarDays, Eraser, Loader2, MapPin, Menu, MoveLeft, Pause, Play, Plus, Search, Trash2 } from "lucide-react";

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
import { useGetRondinById } from "@/hooks/Rondines/useGetRondinById";
import { AreasModal } from "@/components/modals/add-area-rondin";
import { RondinesBitacoraTable } from "./bitacoras-table";
import dynamic from "next/dynamic";
import { usePlayOrPauseRondin } from "@/hooks/Rondines/usePlayOrPauseROndin";
// import MapView from "@/components/map-v2";

const MapView = dynamic(() => import("@/components/map-v2"), {
	ssr: false,
  });
  

// const puntos = [
// 	{ lat: 25.6866, lng: -100.3161, nombre: 'Centro (Macroplaza)' },          
// 	{ lat: 25.7030, lng: -100.3370, nombre: 'San Pedro Garza García' },    
// 	{ lat: 25.7100, lng: -100.2930, nombre: 'Obispado' },                     
// 	{ lat: 25.6672, lng: -100.2736, nombre: 'Tecnológico (ITESM)' },        
// 	{ lat: 25.6400, lng: -100.3000, nombre: 'Sur (Colonia del Valle)' },     
// 	{ lat: 25.6700, lng: -100.3300, nombre: 'Plaza Cumbres (Noroeste)' },   
//   ];


	
	// [
	//   { nombre: 'Pluma entrada 1', lat: 23.73876196516611 },
	//   { nombre: 'Pluma salida 1', lat: 23.753257064033818 }
	// ]
	
	export interface GeoLocation {
		latitude: number;
		longitude: number;
	  }
	  
	  export interface GeoLocationSearch extends GeoLocation {
		search_txt: string;
	  }
	  
	  export interface ImageData {
		nombre_area: string;
		id: string;
		foto_area: string;
	  }
	  
	  export interface MapItem {
		nombre_area: string;
		id: string;
		geolocation_area?: GeoLocation;
	  }
	  
	  export interface FotoArea {
		file_name: string;
		file_url: string;
		name: string;
	  }
	  
	  export interface Area {
		rondin_area: string;
		geolocalizacion_area_ubicacion: GeoLocation[];
		area_tag_id: string[];
		foto_area: FotoArea[];
	  }
	  
	  export interface RondinResponse {
		fecha_inicio_rondin: string;
		cantidad_de_puntos: number;
		recurrencia: string;
		asignado_a: string;
		duracion_promedio: number;
		images_data: ImageData[];
		nombre_del_rondin: string;
		ubicacion: string;
		map_data: MapItem[];
		estatus_rondin: string;
		ubicacion_geolocation: GeoLocationSearch;
		duracion_esperada_rondin: string;
		areas: Area[];
	  }

	  
interface ListProps {
	data: any;
	isLoading:boolean;
	resetTableFilters: () => void;
	setSelectedRondin:React.Dispatch<React.SetStateAction<string[]|null>>;
	selectedRondin:string[]|null;

	setDate1 :React.Dispatch<React.SetStateAction<Date | "">>;
	setDate2 :React.Dispatch<React.SetStateAction<Date | "">>;
	date1:Date| ""
	date2:Date| ""
	dateFilter: string;
	setDateFilter: React.Dispatch<React.SetStateAction<string>>;
	Filter:() => void;
	setActiveTab: React.Dispatch<React.SetStateAction<string>>;
	activeTab:string;
}


// const fotos: string[]=[
	// 'https://cdn-3.expansion.mx/dims4/default/685434a/2147483647/strip/true/crop/1550x676+0+0/resize/1200x523!/format/webp/quality/60/?url=https%3A%2F%2Fcdn-3.expansion.mx%2F21%2F78%2Fe052aec14a47ab373f1a185e2b81%2Fistock-1397038664.jpg',
	// 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQA5rDSZ2ecN7r_I2F_aoUsH8Ol0sYPQ4-Q&s',
	// 'https://previews.123rf.com/images/bialasiewicz/bialasiewicz1305/bialasiewicz130500224/19688905-entrance-and-reception-in-a-new-contemporary-office-building.jpg',
	// 'https://www.bizneo.com/blog/wp-content/uploads/2020/04/departamentos-de-una-empresa-810x455.jpg.webp',
	// 'https://content.knightfrank.com/property/spn1190a/images/011ff73f-b280-4ddd-8815-54aa12e18fe8-0.jpg?cio=true&w=1200',
	// 'https://img.freepik.com/fotos-premium/interior-hall-entrada-moderno-edificio-oficinas-moderno_308547-4141.jpg',
// ]

// const items = [
// 	{ id: 1, name: "Entrada principal" },
// 	{ id: 2, name: "Zona de carga" },
// 	{ id: 3, name: "Estacionamiento" },
// 	{ id: 4, name: "Oficinas" },
// 	{ id: 5, name: "Patio trasero" },
// 	{ id: 6, name: "Bodega" },
//   ];


// const areas = ["Entrada principal", "Zona de carga", "Patio trasero","Entrada principal", "Zona de carga", "Patio trasero","Entrada principal", "Zona de carga", "Patio trasero"];
// const dias = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do","Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do","Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do", "Lu", "Ma","Mi", "Ju", "Vi",];

const RondinesTable:React.FC<ListProps> = ({ data, isLoading,setSelectedRondin,selectedRondin,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter, resetTableFilters, setActiveTab, activeTab
 })=> {
	console.log("Tabla rondines",data, setSelectedRondin, selectedRondin, activeTab)
	// const [ selectedRow, setSelectedRondin] = React.useState<any | null>(null);
	const {playOrPauseRondinMutation, isLoading:isLoadingPlayOrPause }= usePlayOrPauseRondin();

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
	const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
	const [rondinSeleccionado, setRondinSeleccionado] = useState<Recorrido | null>(null);
	const [verRondin, setVerRondin] = useState(false);

	const { data:rondin , isLoadingRondin} = useGetRondinById(rondinSeleccionado?rondinSeleccionado._id: "")

	const handleEliminar= (rondin: Recorrido) => {
			setRondinSeleccionado(rondin);
			setModalEliminarAbierto(true);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
		const handleVerRondin= (rondin:Recorrido)=>{
			setRondinSeleccionado(rondin); 
			setVerRondin(true);
			setActiveTab("Vista");
		}

		const handleEditarRondin= (rondin:Recorrido)=>{
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
}, [handleVerRondin, isLoading]);

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

// const files = [
// 	{
// 	  file_name: "file_1",
// 	  file_url: "/nouser.svg",
// 	},
// 	{
// 	  file_name: "file_2",
// 	  file_url:"/nouser.svg",
// 	},
// 	{
// 	  file_name: "file_3",
// 	  file_url: "/nouser.svg",
// 	},
// 	{
// 	  file_name: "file_4",
// 	  file_url: "/nouser.svg",
// 	},
//   ];
  
	const handlePlay = () => {
		playOrPauseRondinMutation.mutate({
			record_id: rondinSeleccionado?rondinSeleccionado._id:"",
			paused: false
		});
	};

	const handlePause = () => {
		playOrPauseRondinMutation.mutate({
			record_id: rondinSeleccionado?rondinSeleccionado._id:"",
			paused: true,
		});
	};


  return (
  	<div className="w-full">
		<div className="flex justify-between items-center my-2 ">
			<div className="flex w-full justify-start gap-4 ">
				<div className="flex justify-center items-center">
					<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
						<TabsTrigger value="Rondines">Rondines</TabsTrigger>
						<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
						<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
						<TabsTrigger value="Fotos">Fotos</TabsTrigger>
						<TabsTrigger value="Calendario">Calendario</TabsTrigger>
					</TabsList>
				</div> 
				
				{activeTab !=="Bitacora" ? (
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
				):null}
			</div>
			{activeTab =="Bitacora" ? (
				<div className="text-2xl font-bold">Octubre</div>
			):null}
			

			<div className="flex w-full justify-end gap-3">

				{dateFilter == "range" ?
				<div className="flex items-center gap-2 mr-14">
					<DateTime date={date1} setDate={setDate1} disablePastDates={false}/>
					<DateTime date={date2} setDate={setDate2} disablePastDates={false}/>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={Filter}> Filtrar</Button>
					<Button type="button"  className={"bg-blue-500 hover:bg-blue-600"} onClick={()=>{resetTableFilters()}}> 
						<Eraser/> 
					</Button>
				</div>
				:null}

				<div className="flex items-center w-48 gap-2"> 
					<Select value={dateFilter}  onValueChange={(value) => { 
							setDateFilter(value); 
							}}> 
						<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecciona un filtro de fecha" />
						<CalendarDays />
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
				</div>

				<div className="flex flex-wrap gap-2">
				{activeTab !=="Bitacora" && (
					<AddRondinModal title={"Crear Rondin"} >
						<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
							<Plus />
							Crear Rondin
						</Button>
					</AddRondinModal>
				)}
			
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
		
{/* 
		{activeTab =="Bitacora" ? (
			
		): (  */}
			<>

			{ rondin && verRondin ? (

			<div className="flex flex-col h-full">
				<div className="flex flex-col md:flex-row">
					<div className=" w-1/2 border rounded-md bg-white shadow-md pl-4 min-h-[550px] ">
						<div className="mt-4 flex">
							<Button onClick={() => {setRondinSeleccionado(null); setVerRondin(false); setActiveTab("Rondines");}} className="bg-transparent hover:bg-transparent cursor-pointer">
							<MoveLeft className="text-black w-64"/>
							</Button>
							<h2 className="text-xl font-bold mb-4">{rondin.nombre_del_rondin}</h2>
						</div>
				
						<div className="grid grid-cols-[auto,1fr] gap-4 mb-6">
						<div className="flex ">
							{/* <span className="font-semibold min-w-[130px]">Descripcion:</span> */}
						</div>

						<div>
							<span >
								{rondin?.descripcion}
							</span>
						</div>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Recurrencia:</span>
						</div>

						<div className="flex justify-start gap-10">
							<span >
							{rondin?.recurrencia} 
							</span>
							<Button onClick={() => {setRondinSeleccionado(null);setVerRondin(false); setActiveTab("Rondines");}} className="bg-blue-500 hover:bg-blue-600 cursor-pointer p-2">
								Editar
							</Button>
						</div>

						{/* <div className="flex">
							<span className="font-semibold min-w-[130px]">Asignado a:</span>
							
						</div>
						<div className="w-1/2">
								<SelectReact
									aria-labelledby="aria-label"
									inputId="select-categorias"
									name="categoria"
									options={[]}
									value={null} 
									isDisabled={false}
								/>
						</div> */}

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Ubicacion:</span>
						</div>

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

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Geolocalizacion:</span>
						</div>
						<div className="flex gap-1">
							<MapPin/>  Ver en Map
						</div>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Estatus:</span>
						</div>
						<div
						className={`flex font-semibold ${
							rondin?.estatus_rondin === "Corriendo"
							? "text-green-500"
							: rondin?.estatus_rondin === "Cancelado"
							? "text-red-500"
							: rondin?.estatus_rondin === "Cerrado"
							? "text-gray-300"
							: rondin?.estatus_rondin === "Programado"
							? "text-purple-500"
							: "text-gray-500"
						}`}
						>
						<div>
						{rondin?.estatus_rondin}
						</div>
						<div>
							<div className="flex items-center gap-2 ml-4">
								<Button
								onClick={() => {handlePause()}}
								className="rounded-sm bg-blue-500 hover:bg-blue-600 transition p-2 w-auto h-auto inline-flex"
								title="Pausar Rondín"
								disabled={rondin?.estatus_rondin !== "Corriendo" || isLoadingPlayOrPause}
								>
							 	{isLoadingPlayOrPause && rondin?.estatus_rondin === "Corriendo" ? (
									<Loader2 size={18} className="animate-spin text-white" />
								) : (
									<Pause size={18} className="text-white" />
								)}
								
								</Button>

								<Button
								onClick={() => {handlePlay()}}
								className="rounded-sm bg-blue-500 hover:bg-blue-600 transition p-2 w-auto h-auto inline-flex"
								title="Iniciar Rondín"
								disabled={rondin?.estatus_rondin === "Corriendo" || isLoadingPlayOrPause}
								>
								{isLoadingPlayOrPause && rondin?.estatus_rondin !== "Corriendo" ? (
									<Loader2 size={18} className="animate-spin text-white" />
								) : (
									<Play size={18} className="text-white" />
								)}
								</Button>

								
							</div>
						</div>
						</div>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Inicio:</span>
						</div>
						<span >
							{rondin.fecha_inicio_rondin}
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion promedio:</span>
						</div>
						<span >
							{rondin.duracion_promedio}
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion esperada:</span>
						</div>
						<span >
							{rondin.duracion_esperada_rondin}
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Finalizacion:</span>
						</div>
						<span >
							-
						</span>

						</div>
					
					</div>


					<div className="w-2/3 ml-4 p-4 border rounded-md bg-white shadow-md">	
					<div className="mb-2 font-bold">Fotografías de áreas a inspeccionar: </div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{rondin.images_data.map((val:any, idx:any) => {
							const imageUrl = val?.foto_area;
							return imageUrl ? (
								<div key={idx} className="rounded overflow-hidden shadow-md">
								<Image
									height={100}
									width={100}
									src={imageUrl}
									alt={`Foto área ${idx + 1}`}
									className="w-full h-48 object-cover"
								/>
								</div>
							) :null; 
							})}
						</div>	
					</div>
				</div>
				<div className="flex flex-col md:flex-row mt-4">
					<div className="w-full max-w-2xl mx-auto space-y-4">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold">Puntos de rondin: {rondin.cantidad_de_puntos} puntos</h2>
							<div className="flex justify-around gap-2">
								<AreasModal title={"Agregar Área"} points={rondin.areas}>
									<div className="flex w-full gap-2 md:w-auto bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-sm p-2.5 px-3 round-sm">
										<Plus className="size-5"/>
										Agregar Área
									</div>
								</AreasModal>

								<Button
								className="size-sm bg-yellow-500 hover:bg-yellow-600 "
								title="Guardar cambios"
								>
									Guardar cambios
								</Button>
							</div>
						</div>

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
							{rondin?.areas?.map((item:any) => (
							<div
								key={item.rondin_area}
								className="flex items-center justify-between border border-gray-200 rounded p-3 bg-white shadow-sm"
							>
								<div>
								<p className="font-bold">{item.rondin_area}</p>
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
					<div className="w-2/3 ml-4 p-4 border rounded-md bg-white shadow-md" style={{
					zIndex: 0,
				}}>	
						<div> 
							<MapView map_data={rondin.map_data}></MapView>
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row w-full h-full mt-5">
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

							<TabsContent value="rondiness">
								<div className="p-2">
									<RondinesBitacoraTable />
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
			<>
				{isLoadingRondin && verRondin?(
					<div className="flex justify-center items-center h-screen">
						<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
					</div>
					):(
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
				</>
			)}
			</>
		{/* )} */}
		

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



