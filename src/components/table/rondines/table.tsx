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
import { useGetRondinById } from "@/hooks/Rondines/useGetRondinById";
import { AreasModal } from "@/components/modals/add-area-rondin";
import { RondinesBitacoraTable } from "./bitacoras-table";
import dynamic from "next/dynamic";
// import MapView from "@/components/map-v2";

const MapView = dynamic(() => import("@/components/map-v2"), {
	ssr: false,
  });
  

const puntos = [
	{ lat: 25.6866, lng: -100.3161, nombre: 'Centro (Macroplaza)' },          
	{ lat: 25.7030, lng: -100.3370, nombre: 'San Pedro Garza García' },    
	{ lat: 25.7100, lng: -100.2930, nombre: 'Obispado' },                     
	{ lat: 25.6672, lng: -100.2736, nombre: 'Tecnológico (ITESM)' },        
	{ lat: 25.6400, lng: -100.3000, nombre: 'Sur (Colonia del Valle)' },     
	{ lat: 25.6700, lng: -100.3300, nombre: 'Plaza Cumbres (Noroeste)' },   
  ];


interface ListProps {
	data: any[];
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
	console.log("Tabla rondines",setSelectedRondin, selectedRondin, activeTab)
	// const [ selectedRow, setSelectedRondin] = React.useState<any | null>(null);

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

const files = [
	{
	  file_name: "file_1",
	  file_url: "/nouser.svg",
	},
	{
	  file_name: "file_2",
	  file_url:"/nouser.svg",
	},
	{
	  file_name: "file_3",
	  file_url: "/nouser.svg",
	},
	{
	  file_name: "file_4",
	  file_url: "/nouser.svg",
	},
  ];
  

  const dataRondin = [
	{
	  hora: "08:00 am",
	  categorias: [
		{
		  titulo: "Inspección Perímetro Exterior",
		  resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
			"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
			"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","no_inspeccionada","none"],
		  areas: [
			{
			  nombre: "Caseta de vigilancia planta 1",
			  estados: [
				{ dia: 1, estado: "finalizado" },
				{ dia: 2, estado: "no_inspeccionada" },
				{ dia: 3, estado: "finalizado" },
				{ dia: 4, estado: "area_incidente" },
				{ dia: 5, estado: "cancelado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "area_incidente" },
				{ dia: 9, estado: "check" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "cerrado" },
				{ dia: 13, estado: "rondin_progreso" },
				{ dia: 14, estado: "cerrado" },
				{ dia: 15, estado: "rondin_progreso" },
				{ dia: 16, estado: "rondin_progreso" },
				{ dia: 17, estado: "rondin_programado" },
				{ dia: 18, estado: "rondin_programado" },
				{ dia: 19, estado: "rondin_programado" },
				{ dia: 20, estado: "rondin_programado" },
				{ dia: 21, estado: "rondin_programado" },
				{ dia: 22, estado: "rondin_programado" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
			{
			  nombre: "Área de rampa 24",
			  estados: [
				{ dia: 1, estado: "finalizado" },
				{ dia: 2, estado: "finalizado" },
				{ dia: 3, estado: "no_inspeccionada" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "cancelado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "finalizado" },
				{ dia: 9, estado: "area_incidente" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "cerrado" },
				{ dia: 13, estado: "cerrado" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "cancelado" },
				{ dia: 17, estado: "finalizado" },
				{ dia: 18, estado: "rondin_progreso" },
				{ dia: 19, estado: "canrondin_progresocelado" },
				{ dia: 20, estado: "chrondin_progresoeck" },
				{ dia: 21, estado: "check" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "rondin_programado" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
			{
			  nombre: "Cisterna",
			  estados: [
				{ dia: 1, estado: "no_inspeccionada" },
				{ dia: 2, estado: "no_inspeccionada" },
				{ dia: 3, estado: "finalizado" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "cancelado" },
				{ dia: 8, estado: "finalizado" },
				{ dia: 9, estado: "finalizado" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "finalizado" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "rondin_progreso" },
				{ dia: 16, estado: "cerrado" },
				{ dia: 17, estado: "cerrado" },
				{ dia: 18, estado: "cerrado" },
				{ dia: 19, estado: "cancelado" },
				{ dia: 20, estado: "none" },
				{ dia: 21, estado: "none" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "rondin_programado" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
		  ],
		},
		{
		  titulo: "Rondín de áreas públicas",
		  resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
			"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","cancelado","finalizado","finalizado",
			"area_incidente","cerrado","cerrado","cerrado","cancelado","cancelado","cancelado","cancelado","no_inspeccionada","none"],
		  areas: [
			{
			  nombre: "Planta baja",
			  estados: [
				{ dia: 1, estado: "cancelado" },
				{ dia: 2, estado: "cancelado" },
				{ dia: 3, estado: "finalizado" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "cancelado" },
				{ dia: 8, estado: "cancelado" },
				{ dia: 9, estado: "finalizado" },
				{ dia: 10, estado: "area_incidente" },
				{ dia: 11, estado: "area_incidente" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "area_incidente" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "rondin_progreso" },
				{ dia: 17, estado: "cancelado" },
				{ dia: 18, estado: "none" },
				{ dia: 19, estado: "cancelado" },
				{ dia: 20, estado: "rondin_programado" },
				{ dia: 21, estado: "none" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
				
			  ],
			},
			{
			  nombre: "Comedor",
			  estados: [
				{ dia: 1, estado: "finalizado" },
				{ dia: 2, estado: "no_inspeccionada" },
				{ dia: 3, estado: "no_inspeccionada" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "finalizado" },
				{ dia: 9, estado: "finalizado" },
				{ dia: 10, estado: "area_incidente" },
				{ dia: 11, estado: "area_incidente" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "area_incidente" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "area_incidente" },
				{ dia: 16, estado: "rondin_programado" },
				{ dia: 17, estado: "rondin_programado" },
				{ dia: 18, estado: "rondin_progreso" },
				{ dia: 19, estado: "cancelado" },
				{ dia: 20, estado: "rondin_progreso" },
				{ dia: 21, estado: "rondin_programado" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
		  ],
		},
	  ],
	},
	{
	  hora: "11:00 am",
	  categorias: [
		{
		  titulo: "Inspección matutina",
		  resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
			"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
			"area_incidente","finalizado","finalizado","cerrado","cerrado","cerrado","cerrado","cerrado","no_inspeccionada","none"],
		  areas: [
			{
			  nombre: "Oficina A",
			  estados: [
				{ dia: 1, estado: "finalizado" },
				{ dia: 2, estado: "finalizado" },
				{ dia: 3, estado: "cancelado" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "no_inspeccionada" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "finalizado" },
				{ dia: 9, estado: "finalizado" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "finalizado" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "none" },
				{ dia: 17, estado: "rondin_progreso" },
				{ dia: 18, estado: "rondin_progreso" },
				{ dia: 19, estado: "area_incidente" },
				{ dia: 20, estado: "area_incidente" },
				{ dia: 21, estado: "nonarea_incidentee" },
				{ dia: 22, estado: "rondin_programado" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
			{
			  nombre: "Oficina B",
			  estados: [
				{ dia: 1, estado: "cancelado" },
				{ dia: 2, estado: "cancelado" },
				{ dia: 3, estado: "area_incidente" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "area_incidente" },
				{ dia: 9, estado: "finalizado" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "finalizado" },
				{ dia: 14, estado: "no_inspeccionada" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "rondin_progreso" },
				{ dia: 17, estado: "rondin_programado" },
				{ dia: 18, estado: "rondin_programado" },
				{ dia: 19, estado: "rondin_programado" },
				{ dia: 20, estado: "rondin_programado" },
				{ dia: 21, estado: "rondin_programado" },
				{ dia: 22, estado: "rondin_programado" },
				{ dia: 23, estado: "rondin_programado" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
			{
				nombre: "Planta baja",
				estados: [
				  { dia: 1, estado: "cancelado" },
				  { dia: 2, estado: "cancelado" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "cancelado" },
				  { dia: 8, estado: "cancelado" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "area_incidente" },
				  { dia: 11, estado: "area_incidente" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "area_incidente" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "rondin_progreso" },
				  { dia: 17, estado: "cancelado" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "cancelado" },
				  { dia: 20, estado: "rondin_programado" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				  
				],
			  },
		  ],
		},
	  ],
	},
	{
	  hora: "01:00 pm",
	  categorias: [
		{
		  titulo: "Rondín áreas eléctricas",
		  resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
			"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
			"area_incidente","finalizado","finalizado","cerrado","cerrado","cerrado","cerrado","rondin_programado","no_inspeccionada","none"],
		  areas: [
			{
			  nombre: "Subestación norte",
			  estados: [
				{ dia: 1, estado: "finalizado" },
				{ dia: 2, estado: "finalizado" },
				{ dia: 3, estado: "no_inspeccionada" },
				{ dia: 4, estado: "finalizado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "no_inspeccionada" },
				{ dia: 7, estado: "finalizado" },
				{ dia: 8, estado: "finalizado" },
				{ dia: 9, estado: "cerrado" },
				{ dia: 10, estado: "finalizado" },
				{ dia: 11, estado: "cerrado" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "finalizado" },
				{ dia: 14, estado: "cerrado" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "none" },
				{ dia: 17, estado: "none" },
				{ dia: 18, estado: "none" },
				{ dia: 19, estado: "none" },
				{ dia: 20, estado: "none" },
				{ dia: 21, estado: "none" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
			{
			  nombre: "Subestación sur",
			  estados: [
				{ dia: 1, estado: "no_inspeccionada" },
				{ dia: 2, estado: "no_inspeccionada" },
				{ dia: 3, estado: "finalizado" },
				{ dia: 4, estado: "cancelado" },
				{ dia: 5, estado: "finalizado" },
				{ dia: 6, estado: "cerrado" },
				{ dia: 7, estado: "cancelado" },
				{ dia: 8, estado: "cancelado" },
				{ dia: 9, estado: "area_incidente" },
				{ dia: 10, estado: "cerrado" },
				{ dia: 11, estado: "finalizado" },
				{ dia: 12, estado: "no_inspeccionada" },
				{ dia: 13, estado: "cancelado" },
				{ dia: 14, estado: "cerrado" },
				{ dia: 15, estado: "finalizado" },
				{ dia: 16, estado: "none" },
				{ dia: 17, estado: "none" },
				{ dia: 18, estado: "none" },
				{ dia: 19, estado: "rondin_programado" },
				{ dia: 20, estado: "none" },
				{ dia: 21, estado: "none" },
				{ dia: 22, estado: "none" },
				{ dia: 23, estado: "none" },
				{ dia: 24, estado: "none" },
				{ dia: 25, estado: "none" },
				{ dia: 26, estado: "none" },
				{ dia: 27, estado: "none" },
				{ dia: 28, estado: "none" },
				{ dia: 29, estado: "none" },
				{ dia: 30, estado: "none" },
			  	{ dia: 31, estado: "none" }
			  ],
			},
		  ],
		},
	  ],
	},
	{
		hora: "02:00 pm",
		categorias: [
		  {
			titulo: "Rondín áreas eléctricas",
			resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","cerrado","rondin_programado","rondin_programado","cerrado","none"],
			areas: [
			  {
				nombre: "Subestación norte",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "finalizado" },
				  { dia: 3, estado: "no_inspeccionada" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "cerrado" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "cerrado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "finalizado" },
				  { dia: 14, estado: "cerrado" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "none" },
				  { dia: 17, estado: "none" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "none" },
				  { dia: 20, estado: "none" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			  {
				nombre: "Subestación sur",
				estados: [
				  { dia: 1, estado: "no_inspeccionada" },
				  { dia: 2, estado: "no_inspeccionada" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "cancelado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "cerrado" },
				  { dia: 7, estado: "cancelado" },
				  { dia: 8, estado: "cancelado" },
				  { dia: 9, estado: "area_incidente" },
				  { dia: 10, estado: "cerrado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "cancelado" },
				  { dia: 14, estado: "cerrado" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "none" },
				  { dia: 17, estado: "none" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "rondin_programado" },
				  { dia: 20, estado: "none" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			],
		  },
		],
	  },
	  {
		hora: "04:00 am",
		categorias: [
		  {
			titulo: "Inspección Perímetro Exterior",
			resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","rondin_programado","rondin_programado","cerrado","cerrado","none"],
			areas: [
			  {
				nombre: "Caseta de vigilancia planta 1",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "no_inspeccionada" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "area_incidente" },
				  { dia: 5, estado: "cancelado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "area_incidente" },
				  { dia: 9, estado: "check" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "cerrado" },
				  { dia: 13, estado: "rondin_progreso" },
				  { dia: 14, estado: "cerrado" },
				  { dia: 15, estado: "rondin_progreso" },
				  { dia: 16, estado: "rondin_progreso" },
				  { dia: 17, estado: "rondin_programado" },
				  { dia: 18, estado: "rondin_programado" },
				  { dia: 19, estado: "rondin_programado" },
				  { dia: 20, estado: "rondin_programado" },
				  { dia: 21, estado: "rondin_programado" },
				  { dia: 22, estado: "rondin_programado" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			  {
				nombre: "Área de rampa 24",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "finalizado" },
				  { dia: 3, estado: "no_inspeccionada" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "cancelado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "area_incidente" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "cerrado" },
				  { dia: 13, estado: "cerrado" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "cancelado" },
				  { dia: 17, estado: "finalizado" },
				  { dia: 18, estado: "rondin_progreso" },
				  { dia: 19, estado: "canrondin_progresocelado" },
				  { dia: 20, estado: "chrondin_progresoeck" },
				  { dia: 21, estado: "check" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "rondin_programado" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			  {
				nombre: "Cisterna",
				estados: [
				  { dia: 1, estado: "no_inspeccionada" },
				  { dia: 2, estado: "no_inspeccionada" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "cancelado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "finalizado" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "rondin_progreso" },
				  { dia: 16, estado: "cerrado" },
				  { dia: 17, estado: "cerrado" },
				  { dia: 18, estado: "cerrado" },
				  { dia: 19, estado: "cancelado" },
				  { dia: 20, estado: "none" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "rondin_programado" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			],
		  },
		  {
			titulo: "Rondín de áreas públicas",
			resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","none","rondin_programado","rondin_programado","cerrado","no_inspeccionada","cerrado"],
			areas: [
			  {
				nombre: "Planta baja",
				estados: [
				  { dia: 1, estado: "cancelado" },
				  { dia: 2, estado: "cancelado" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "cancelado" },
				  { dia: 8, estado: "cancelado" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "area_incidente" },
				  { dia: 11, estado: "area_incidente" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "area_incidente" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "rondin_progreso" },
				  { dia: 17, estado: "cancelado" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "cancelado" },
				  { dia: 20, estado: "rondin_programado" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				  
				],
			  },
			  {
				nombre: "Comedor",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "no_inspeccionada" },
				  { dia: 3, estado: "no_inspeccionada" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "area_incidente" },
				  { dia: 11, estado: "area_incidente" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "area_incidente" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "area_incidente" },
				  { dia: 16, estado: "rondin_programado" },
				  { dia: 17, estado: "rondin_programado" },
				  { dia: 18, estado: "rondin_progreso" },
				  { dia: 19, estado: "cancelado" },
				  { dia: 20, estado: "rondin_progreso" },
				  { dia: 21, estado: "rondin_programado" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			],
		  },
		],
	  },
	  {
		hora: "7:00 pm",
		categorias: [
		  {
			titulo: "Inspección matutina",
			resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","rondin_programado","none","none","none","none"],
			areas: [
			  {
				nombre: "Oficina A",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "finalizado" },
				  { dia: 3, estado: "cancelado" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "no_inspeccionada" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "finalizado" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "none" },
				  { dia: 17, estado: "rondin_progreso" },
				  { dia: 18, estado: "rondin_progreso" },
				  { dia: 19, estado: "area_incidente" },
				  { dia: 20, estado: "area_incidente" },
				  { dia: 21, estado: "nonarea_incidentee" },
				  { dia: 22, estado: "rondin_programado" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			  {
				nombre: "Oficina B",
				estados: [
				  { dia: 1, estado: "cancelado" },
				  { dia: 2, estado: "cancelado" },
				  { dia: 3, estado: "area_incidente" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "area_incidente" },
				  { dia: 9, estado: "finalizado" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "finalizado" },
				  { dia: 14, estado: "no_inspeccionada" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "rondin_progreso" },
				  { dia: 17, estado: "rondin_programado" },
				  { dia: 18, estado: "rondin_programado" },
				  { dia: 19, estado: "rondin_programado" },
				  { dia: 20, estado: "rondin_programado" },
				  { dia: 21, estado: "rondin_programado" },
				  { dia: 22, estado: "rondin_programado" },
				  { dia: 23, estado: "rondin_programado" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			],
		  },
		],
	  },
	  {
		hora: "010:00 pm",
		categorias: [
		  {
			titulo: "Rondín áreas eléctricas",
			resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","rondin_programado","none","none","none","none"],
			areas: [
			  {
				nombre: "Subestación norte",
				estados: [
				  { dia: 1, estado: "finalizado" },
				  { dia: 2, estado: "finalizado" },
				  { dia: 3, estado: "no_inspeccionada" },
				  { dia: 4, estado: "finalizado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "no_inspeccionada" },
				  { dia: 7, estado: "finalizado" },
				  { dia: 8, estado: "finalizado" },
				  { dia: 9, estado: "cerrado" },
				  { dia: 10, estado: "finalizado" },
				  { dia: 11, estado: "cerrado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "finalizado" },
				  { dia: 14, estado: "cerrado" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "none" },
				  { dia: 17, estado: "none" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "none" },
				  { dia: 20, estado: "none" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			  {
				nombre: "Subestación sur",
				estados: [
				  { dia: 1, estado: "no_inspeccionada" },
				  { dia: 2, estado: "no_inspeccionada" },
				  { dia: 3, estado: "finalizado" },
				  { dia: 4, estado: "cancelado" },
				  { dia: 5, estado: "finalizado" },
				  { dia: 6, estado: "cerrado" },
				  { dia: 7, estado: "cancelado" },
				  { dia: 8, estado: "cancelado" },
				  { dia: 9, estado: "area_incidente" },
				  { dia: 10, estado: "cerrado" },
				  { dia: 11, estado: "finalizado" },
				  { dia: 12, estado: "no_inspeccionada" },
				  { dia: 13, estado: "cancelado" },
				  { dia: 14, estado: "cerrado" },
				  { dia: 15, estado: "finalizado" },
				  { dia: 16, estado: "none" },
				  { dia: 17, estado: "none" },
				  { dia: 18, estado: "none" },
				  { dia: 19, estado: "rondin_programado" },
				  { dia: 20, estado: "none" },
				  { dia: 21, estado: "none" },
				  { dia: 22, estado: "none" },
				  { dia: 23, estado: "none" },
				  { dia: 24, estado: "none" },
				  { dia: 25, estado: "none" },
				  { dia: 26, estado: "none" },
				  { dia: 27, estado: "none" },
				  { dia: 28, estado: "none" },
				  { dia: 29, estado: "none" },
				  { dia: 30, estado: "none" },
					{ dia: 31, estado: "none" }
				],
			  },
			],
		  },
		],
	  },
	  {
		  hora: "11:00 pm",
		  categorias: [
			{
			  titulo: "Rondín áreas eléctricas",
			  resumen: ["finalizado","finalizado","area_incidente","finalizado","cancelado","rondin_progreso","finalizado","finalizado","area_incidente",
				"finalizado","cerrado","cerrado","rondin_progreso","rondin_progreso","rondin_programado","rondin_programado","rondin_programado","cancelado","no_inspeccionada","finalizado","finalizado",
				"area_incidente","finalizado","finalizado","cerrado","rondin_progreso","rondin_programado","none","none","none","none"],
			  areas: [
				{
				  nombre: "Subestación norte",
				  estados: [
					{ dia: 1, estado: "finalizado" },
					{ dia: 2, estado: "finalizado" },
					{ dia: 3, estado: "no_inspeccionada" },
					{ dia: 4, estado: "finalizado" },
					{ dia: 5, estado: "finalizado" },
					{ dia: 6, estado: "no_inspeccionada" },
					{ dia: 7, estado: "finalizado" },
					{ dia: 8, estado: "finalizado" },
					{ dia: 9, estado: "cerrado" },
					{ dia: 10, estado: "finalizado" },
					{ dia: 11, estado: "cerrado" },
					{ dia: 12, estado: "no_inspeccionada" },
					{ dia: 13, estado: "finalizado" },
					{ dia: 14, estado: "cerrado" },
					{ dia: 15, estado: "finalizado" },
					{ dia: 16, estado: "none" },
					{ dia: 17, estado: "none" },
					{ dia: 18, estado: "none" },
					{ dia: 19, estado: "none" },
					{ dia: 20, estado: "none" },
					{ dia: 21, estado: "none" },
					{ dia: 22, estado: "none" },
					{ dia: 23, estado: "none" },
					{ dia: 24, estado: "none" },
					{ dia: 25, estado: "none" },
					{ dia: 26, estado: "none" },
					{ dia: 27, estado: "none" },
					{ dia: 28, estado: "none" },
					{ dia: 29, estado: "none" },
					{ dia: 30, estado: "none" },
					  { dia: 31, estado: "none" }
				  ],
				},
				{
				  nombre: "Subestación sur",
				  estados: [
					{ dia: 1, estado: "no_inspeccionada" },
					{ dia: 2, estado: "no_inspeccionada" },
					{ dia: 3, estado: "finalizado" },
					{ dia: 4, estado: "cancelado" },
					{ dia: 5, estado: "finalizado" },
					{ dia: 6, estado: "cerrado" },
					{ dia: 7, estado: "cancelado" },
					{ dia: 8, estado: "cancelado" },
					{ dia: 9, estado: "area_incidente" },
					{ dia: 10, estado: "cerrado" },
					{ dia: 11, estado: "finalizado" },
					{ dia: 12, estado: "no_inspeccionada" },
					{ dia: 13, estado: "cancelado" },
					{ dia: 14, estado: "cerrado" },
					{ dia: 15, estado: "finalizado" },
					{ dia: 16, estado: "none" },
					{ dia: 17, estado: "none" },
					{ dia: 18, estado: "none" },
					{ dia: 19, estado: "rondin_programado" },
					{ dia: 20, estado: "none" },
					{ dia: 21, estado: "none" },
					{ dia: 22, estado: "none" },
					{ dia: 23, estado: "none" },
					{ dia: 24, estado: "none" },
					{ dia: 25, estado: "none" },
					{ dia: 26, estado: "none" },
					{ dia: 27, estado: "none" },
					{ dia: 28, estado: "none" },
					{ dia: 29, estado: "none" },
					{ dia: 30, estado: "none" },
					  { dia: 31, estado: "none" }
				  ],
				},
			  ],
			},
		  ],
		},
	  
  ];

  return (
  	<div className="w-full">
		<div className="flex justify-between items-center my-2">
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
		

		{activeTab =="Bitacora" ? (
			<div className="p-2">
				<RondinesBitacoraTable data={dataRondin} dateFilter={dateFilter}/>
			</div>
		): ( 
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
							<span className="font-semibold min-w-[130px]">Descripcion:</span>
							
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

						<div className="flex">
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
						</div>

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
						<div className="flex">
							<MapPin/> Ver en MapContainer
						</div>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Estatus:</span>
						</div>
						<span >
							En proceso
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Inicio:</span>
						</div>
						<span >
							15/05/25 1:42:23 hr
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion promedio:</span>
						</div>
						<span >
							63 horas
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Duracion esperada:</span>
						</div>
						<span >
							{rondin.duracion_esperada}
						</span>

						<div className="flex">
							<span className="font-semibold min-w-[130px]">Finalizacion:</span>
						</div>
						<span >
							15/05/25 2:30:45 hrs
						</span>

						</div>
					
					</div>


					<div className="w-2/3 ml-4 p-4 border rounded-md bg-white shadow-md">	
					<div className="mb-2 font-bold">Fotografías de áreas a inspeccionar: </div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{files.map((val:any, idx:any) => {
							const imageUrl = val?.file_url;
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
							<AreasModal title={"Agregar Área"} points={rondin.areas}>
								<div className="flex w-full gap-2 md:w-auto bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-sm p-2 px-3">
									<Plus className="size-5"/>
									Agregar Área
								</div>
							</AreasModal>

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
							{rondin.areas.map((item:any) => (
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
							<MapView puntos={puntos}></MapView>
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
									<RondinesBitacoraTable data={dataRondin} dateFilter={dateFilter}/>
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



