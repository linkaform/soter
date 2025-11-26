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
import { CalendarDays, Eraser, Loader2, MoveLeft, Pause, Play, Plus, Search, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useGetRondinById } from "@/hooks/Rondines/useGetRondinById";
import { AreasModal } from "@/components/modals/add-area-rondin";
import dynamic from "next/dynamic";
import { usePlayOrPauseRondin } from "@/hooks/Rondines/usePlayOrPauseROndin";
import { AreasList } from "@/components/areas-list-draggable";
import { useEditAreasRondin } from "@/hooks/Rondines/useEditAreasRondin";
import { RondinesBitacoraTable } from "./bitacoras-table";
import ChecksImagesSection from "@/components/ChecksImagesSection";
import { useShiftStore } from "@/store/useShiftStore";
import IncidenciasRondinesTable from "../incidencias-rondines/table";
import { useIncidenciaRondin } from "@/hooks/Rondines/useRondinIncidencia";

const MapView = dynamic(() => import("@/components/map-v2"), {
	ssr: false,
  });
	
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


const RondinesTable:React.FC<ListProps> = ({ data, isLoading,setSelectedRondin,selectedRondin,
	setDate1, setDate2, date1, date2, dateFilter, setDateFilter,Filter, resetTableFilters, setActiveTab, activeTab
 })=> {
	console.log("Tabla rondines",data, setSelectedRondin, selectedRondin, activeTab)
	const {playOrPauseRondinMutation, isLoading:isLoadingPlayOrPause }= usePlayOrPauseRondin();

	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const { editAreasRodindMutation, isLoading : isLoadingEditAreas} = useEditAreasRondin();
	const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
	const [rondinSeleccionado, setRondinSeleccionado] = useState<Recorrido | null>(null);
	const [verRondin, setVerRondin] = useState(false);
	const [nuevasAreasSeleccionadas, setNuevasAreasSeleccionadas] = useState<any[]>([]);
	const {location} = useShiftStore()
	const [selectedIncidencias, setSelectedIncidencias] = useState<string[]>([])
	const {listIncidenciasRondin} = useIncidenciaRondin("", "");
	const [openModal, setOpenModal] = useState(false);

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
	return getRondinesColumns(handleEliminar,handleVerRondin);
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
	console.log("rondin?.areas", rondin?.areas)
	const [areas, setAreas] = useState(rondin?.areas || [])

	const handleGuardar = () => {
	  console.log("areas", nuevasAreasSeleccionadas)
	  editAreasRodindMutation.mutate({
		areas:areas,     
		record_id:rondinSeleccionado?rondinSeleccionado._id:"",
		folio:rondinSeleccionado?rondinSeleccionado.folio:"",
	  });
	}

	
	React.useEffect(() => {
	  console.log("AREAS:", areas);
	}, [areas]);

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
				{activeTab !== "Bitacora" && (
					<>
					<AddRondinModal title="Crear Rondín" mode="create">
						<Button className="w-full md:w-auto bg-blue-500 hover:bg-blue-600">
						<Plus />
						Crear Rondín
						</Button>
					</AddRondinModal>

					{rondinSeleccionado && (
						<AddRondinModal
						title="Editar Rondín"
						mode="edit"
						rondinData={rondinSeleccionado}
						rondinId={rondinSeleccionado._id}
						>
						<div />
						</AddRondinModal>
					)}
					</>
				)}

				 {modalEliminarAbierto && rondinSeleccionado && (
					<EliminarRondinModal title="Eliminar Rondin" folio={rondinSeleccionado.folio} 
					modalEliminarAbierto={modalEliminarAbierto}
					setModalEliminarAbierto={setModalEliminarAbierto}/>
				)}

			</div>
			</div>
    	</div>
		
		<>
		{ rondin && verRondin ? (

		<div className="flex flex-col h-full">
			<div className="flex flex-col md:flex-row">
				<div className=" w-1/2 border rounded-md bg-white shadow-md pl-4 min-h-[550px] ">
					<div className="mt-4 flex justify-between mr-5">
						<div className="flex">
							<Button onClick={() => {setRondinSeleccionado(null); setVerRondin(false); setActiveTab("Rondines");}} className="bg-transparent hover:bg-transparent cursor-pointer">
								<MoveLeft className="text-black w-64"/>
							</Button>
							<h2 className="text-xl font-bold mb-4">{rondin.nombre_del_rondin}</h2>
						</div>
						<div className="flex gap-5">
							<div className="flex">
								<span className="text-xl"> <span className="font-bold">Folio:</span> {rondin?.folio|| "No disponible" } </span>
							</div>
							<div className="cursor-pointer" title="Eliminar Rondin" onClick={() => { handleEliminar(rondin) }} >
								<Trash /> 
							</div>
						</div>
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
						<span className="font-semibold">Recurrencia:</span>
					</div>
{/* 
					<div className="flex justify-start gap-10">
						<span >
						{rondin?.recurrencia} 
						</span>
						<Button onClick={() => {setRondinSeleccionado(null);setVerRondin(false); setActiveTab("Rondines");}} className="bg-blue-500 hover:bg-blue-600 cursor-pointer p-2">
							Editar
						</Button>
					</div> */}
					
					<div className="flex justify-start gap-10">
						<span >
						{rondin?.recurrencia} 
						</span>
						<AddRondinModal
						title="Editar Rondín"
						mode="edit"
						rondinData={rondinSeleccionado}
						rondinId={rondinSeleccionado?rondinSeleccionado._id:""}
						>
						<Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer p-2">
							Editar
						</Button>
						</AddRondinModal>
					</div>


					<div className="flex">
						<span className="font-semibold min-w-[130px]">Ubicacion:</span>
					</div>
					<div className="flex justify-start gap-10">
						<span >
						{rondin?.ubicacion|| "No disponible" } 
						</span>
					</div>
					{/* <div className="w-1/2">
							<SelectReact
								aria-labelledby="aria-label"
								inputId="select-categorias"
								name="categoria"
								options={[]}
								value={null} 
								isDisabled={false}
							/>
					</div> */}

					{/* <div className="flex">
						<span className="font-semibold min-w-[130px]">Geolocalizacion:</span>
					</div>
					<div className="flex gap-1">
						<MapPin/>  Ver en Map
					</div> */}

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
						<span className="font-semibold min-w-[130px]">Asignado a :</span>
					</div>
					<span >
						{rondin.asignado_a || "No disponible"}
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
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold">Puntos de rondin: {rondin.cantidad_de_puntos} puntos</h2>
						<div className="flex justify-around gap-2">
							<AreasModal title={"Agregar Área"} points={areas} setAreas={setAreas} areas={areas} setNuevasAreasSeleccionadas={setNuevasAreasSeleccionadas} rondin= {rondinSeleccionado}>
								<div className="flex w-full gap-2 md:w-auto bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-sm p-2.5 px-3 round-sm">
									<Plus className="size-5"/>
									Agregar Área
								</div>
							</AreasModal>

							<Button
							className="size-sm bg-yellow-500 hover:bg-yellow-600 "
							title="Guardar cambios"
							onClick={()=>{handleGuardar()}}
							disabled={isLoadingEditAreas} 
							>

							{isLoadingEditAreas ? (<>
								<> <Loader2 className="animate-spin" /> {" Cargando..."} </>
							</>) : (<> Guardar cambios</>)}

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

						<h2 className="text-xl font-semibold mb-4">Áreas del Rondín</h2>
						<AreasList rondin={rondin} setAreas={setAreas} areas={areas}/>
					
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
							</div>
							<RondinesBitacoraTable showTabs={false}/>
						</TabsContent>

						<TabsContent value="incidentes">
							<div>
							<IncidenciasRondinesTable showTabs={false} data={listIncidenciasRondin} 
								isLoading={false}  setSelectedIncidencias={setSelectedIncidencias} selectedIncidencias={selectedIncidencias} 
								date1={date1} date2={date2} setDate1={setDate1} setDate2={setDate2} dateFilter={dateFilter} setDateFilter={setDateFilter} Filter={Filter} resetTableFilters={resetTableFilters} openModal={openModal} setOpenModal={setOpenModal}
								/>
							</div>
						</TabsContent>

						<TabsContent value="fotos">
						<div>
							<ChecksImagesSection
								location={location}
								area={""}
								showTabs={false}
							/>
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



