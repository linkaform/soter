/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Eraser,
	Grid2x2,
	Grid3x3,
	Play,
	Square,
	FileSpreadsheet,
	Construction,
} from "lucide-react";
import GaugeChart from "../graphs/GaugeChart";
import MultiLineChart from "../graphs/MultiLineChart";
import MultiLineChartZoom from "../graphs/MultiLineChartZoom";
import BubbleChart from "../graphs/BubbleChart";
import PieChart from "../graphs/PieChart";
import PieChartFallas from "../graphs/PieChartFallas";
import RadarChart from "../graphs/RadarChart";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HabitacionesInspeccionadasTable from "../tables/HabitacionesInspeccionadasTable";
// import TicketsTable from "../tables/TicketsTable";
import StatCard from "../components/StatCard";
import RoomCard from "../components/RoomCard";
import ImageCarrousel from "../components/ImageCarrousel";
import { YearSelect } from "../components/YearSelect"
import ComentariosFiltrados from "../components/ComentariosFiltrados";

// import { misTickets } from '../data/tickets'
import { optionsCuatri, optionsCuatriDefecto } from '../data/consts'
import ProgressBar from "../components/ProgressBar";
import FallaBadge from "../components/FallaBadge";
import Multiselect from "multiselect-react-dropdown";
import { useGetAvancesInspecciones, useGetHoteles, useReportBackgroundCommentsAndImages, useReportBackgroundGraphs, useReportFallas } from "../hooks/useReportFallas";
import { formatNumber } from "../utils/formatNumber";
import { exportStatsSimple } from "../utils/exportUtils";

import {
	Bed,
	ChartLine,
	Check,
	Flag,
	Search,
	Star,
	Trophy,
	X,
} from "lucide-react";
import { getHabitacion, getHotelHabitaciones } from "../requests/peticiones";

const currentYear = new Date().getFullYear().toString();

const ReportsPage = () => {

	const [imagesGrid, setImageGrid] = useState('6')
	const [appliedCuatri, setAppliedCuatri] = useState<any>([]);
	const [selectedYear, setSelectedYear] = useState<string | null>(currentYear);
	const [selectedCuatri, setSelectedCuatri] = useState<any[]>([...optionsCuatriDefecto]);
	const [selectedHoteles, setSelectedHoteles] = useState<any[]>([]);
	const [selectedFallas, setSelectedFallas] = useState<string[]>([]);
	const [activeTab, setActiveTab] = useState("grafica");
	const [hotelSeleccionado, setHotelSeleccionado] = useState<string | null>(null);
	const [isLoadingHabitaciones, setIsLoadingHabitaciones] = useState(false);
	const [isLoadingHabitacion, setIsLoadingHabitacion] = useState(false);
	const [searchFalla, setSearchFalla] = useState("");
	const [habitacionSeleccionada, setHabitacionSeleccionada] = useState<string | null>(null);
	const [filters, setFilters] = useState<{
		enabled: boolean;
		anio: string | null;
		cuatrimestres: any[];
		hoteles: any[];
	}>({
		enabled: true,
		anio: currentYear,
		cuatrimestres: selectedCuatri,
		hoteles: []
	});
	const { reportFallas, isLoadingReportFallas, errorReportFallas, refetchReportFallas } = useReportFallas(filters);
	const { reportBackgroundGraphs, refetchReportBackgroundGraphs } = useReportBackgroundGraphs(filters);
	const { reportBackgroundCommentsAndImages, refetchReportBackgroundCommentsAndImages } = useReportBackgroundCommentsAndImages(filters);
	const { hotelesFallas, isLoadingHotelesFallas, errorHotelesFallas } = useGetHoteles(true);
	const hoteles = hotelesFallas?.hoteles ?? [];
	const cards = reportFallas?.cards ?? {};
	const porcentaje = reportFallas?.porcentaje_propiedades_inspeccionadas ?? 0;
	const calificacionXHotelGraph = reportBackgroundGraphs?.calificacion_x_hotel_grafica ?? [];
	const tagsFallas = reportFallas?.fallas?.totales ?? [];
	const fallasXHotelGraph = reportFallas?.fallas?.por_hotel ?? [];
	const tableHabitacionesInspeccionadas = reportFallas?.table_habitaciones_inspeccionadas ?? [];
	const bubbleChart = reportFallas?.table_habitaciones_inspeccionadas ?? [];
	const mejorHabitacion = reportFallas?.mejor_y_peor_habitacion?.mejor_habitacion ?? {};
	const peorHabitacion = reportFallas?.mejor_y_peor_habitacion?.habitacion_mas_fallas ?? {};
	const radarData = reportBackgroundGraphs?.graph_radar?.radar_data ?? [];
	const hotelesFotografias = reportBackgroundCommentsAndImages?.rooms_details ?? [];
	const hotelesComentarios = reportBackgroundCommentsAndImages?.rooms_details ?? [];
	const [hotelHabitaciones, setHotelHabitaciones] = useState<any[]>([]);
	const [isExportingStats, setIsExportingStats] = useState(false); // ✅ Agregar estado
	const [hotelHabitacion, setHotelHabitacion] = useState<any>();
	const {
		avancesInspecciones,
		isLoadingAvancesInspecciones,
		errorAvancesInspecciones,
		refetchAvancesInspecciones
	} = useGetAvancesInspecciones({
		enabled: false,
		anio: filters.anio,
		cuatrimestres: filters.cuatrimestres,
		hoteles: filters.hoteles
	});
	const [activePrincipalTab, setActivePrincipalTab] = useState("principal");
	// Extrae los máximos de los arreglos para mejorHabitacion
	const maxGrade = Array.isArray(mejorHabitacion?.grades)
		? Math.max(...mejorHabitacion.grades)
		: mejorHabitacion?.grades ?? 0;

	const maxAciertos = Array.isArray(mejorHabitacion?.aciertos)
		? Math.max(...mejorHabitacion.aciertos)
		: mejorHabitacion?.aciertos ?? 0;

	const maxFallas = Array.isArray(mejorHabitacion?.fallas)
		? Math.max(...mejorHabitacion.fallas)
		: mejorHabitacion?.fallas ?? 0;

	const maxInspecciones = Array.isArray(mejorHabitacion?.total_inspecciones)
		? Math.max(...mejorHabitacion.total_inspecciones)
		: mejorHabitacion?.total_inspecciones ?? 0;
	// Extrae los máximos de los arreglos para peorHabitacion
	const peorGrade = Array.isArray(peorHabitacion?.grades)
		? Math.max(...peorHabitacion.grades)
		: peorHabitacion?.grades ?? 0;

	const peorAciertos = Array.isArray(peorHabitacion?.aciertos)
		? Math.max(...peorHabitacion.aciertos)
		: peorHabitacion?.aciertos ?? 0;

	const peorFallas = Array.isArray(peorHabitacion?.fallas)
		? Math.max(...peorHabitacion.fallas)
		: peorHabitacion?.fallas ?? 0;

	const peorInspecciones = Array.isArray(peorHabitacion?.total_inspecciones)
		? Math.max(...peorHabitacion.total_inspecciones)
		: peorHabitacion?.total_inspecciones ?? 0;

	const stats = [
		{
			icon: <Search />,
			value: formatNumber(cards?.inspecciones_realizadas) ?? '0.0',
			label: 'Habitaciones inspeccionadas'
		},
		{
			icon: <Bed className="text-green-500" />,
			value: formatNumber(cards?.habitaciones_remodeladas) ?? '0.0',
			label: 'Habitaciones remodeladas'
		},
		{
			icon: <Check className="text-green-700" />,
			value: formatNumber(cards?.total_aciertos) ?? '0.0',
			label: 'Aciertos (Si)'
		},
		{
			icon: <X className="text-red-800" />,
			value: formatNumber(cards?.total_fallas) ?? '0.0',
			label: 'Fallas (No)'
		},

		{
			icon: <Trophy className="text-sky-600" />,
			value: ((cards?.grade_max * 100).toFixed(2)).toString(),
			label: 'Calificacion maxima'
		},
		{
			icon: <Flag className="text-orange-600" />,
			value: ((cards?.grade_min * 100).toFixed(2)).toString(),
			label: 'Calificacion minima'
		},
		{
			icon: <ChartLine className="text-black" />,
			value: ((cards?.grade_avg * 100).toFixed(2)).toString(),
			label: 'Calificacion promedio'
		},
		{
			icon: <Star className="text-yellow-500" />,
			value: ((cards?.grade_avg * 100).toFixed(2)).toString(),
			label:
				selectedHoteles && selectedHoteles.length > 1
					? 'Calificacion de los hoteles'
					: 'Calificacion de hotel'
		}
	]

	const filteredFallas = (tagsFallas ?? []).filter((tag: any) =>
		tag.falla.toLowerCase().includes(searchFalla.toLowerCase())
	);

	const handleAvancesInspecciones = () => {
		if (filters.enabled) {
			refetchAvancesInspecciones();
		}
	};

	const handleChangeGrid = (cols: string) => {
		if (cols == imagesGrid) {
			setImageGrid('6')
		} else {
			setImageGrid(cols)
		}
	}

	const handleExportStats = async () => {
		setIsExportingStats(true);

		try {
			const success = exportStatsSimple(stats, 'estadisticas_reporte_fallas');

			if (success) {
				console.log('✅ Estadísticas exportadas exitosamente');
			} else {
				alert('Error al generar el archivo de estadísticas');
			}
		} catch (error) {
			console.error('❌ Error durante la exportación de estadísticas:', error);
			alert('Error al exportar las estadísticas');
		} finally {
			setIsExportingStats(false);
		}
	};

	const handleGetReport = () => {
		setFilters({
			enabled: true,
			anio: selectedYear,
			cuatrimestres: selectedCuatri,
			hoteles: selectedHoteles
		});
		setAppliedCuatri(selectedCuatri);
		setAppliedCuatri(appliedCuatri);
	}

	const handleToggleFalla = (falla: string) => {
		setSelectedFallas((prev) =>
			prev.includes(falla)
				? prev.filter((f) => f !== falla)
				: [...prev, falla]
		);
	};

	const handleClear = () => {
		setSelectedYear(null);
		setSelectedCuatri([]);
		setSelectedHoteles([]);
	};

	const handleHotelClick = (hotel: string) => {
		setHotelSeleccionado(hotel);
		setActiveTab("habitaciones");
		setIsLoadingHabitaciones(true);
		setHotelHabitacion('');

		const fetchHabitaciones = async () => {
			try {
				const normalizedFallas = selectedFallas.map(f =>
					f.toLowerCase().replace(/ /g, "_")
				);
				const data = await getHotelHabitaciones({
					hotel: hotel,
					fallas: normalizedFallas,
					anio: selectedYear,
					cuatrimestres: selectedCuatri
				});
				const hotelHabitaciones = data?.response?.data?.habitaciones ?? [];
				setHotelHabitaciones(hotelHabitaciones);
			} catch (err) {
				console.error("Error fetching habitaciones:", err);
			} finally {
				setIsLoadingHabitaciones(false);
			}
		};

		fetchHabitaciones();
	};

	const handleHabitacionClick = (hotel: string, habitacion: string) => {
		setHabitacionSeleccionada(habitacion); // <-- Marca la habitación seleccionada
		setIsLoadingHabitacion(true);
		const fetchHabitacion = async () => {
			try {
				const data = await getHabitacion({
					hotel: hotel,
					roomId: habitacion,
				});
				const hotelHabitacion = data?.response?.data ?? [];
				setHotelHabitacion(hotelHabitacion);
			} catch (err) {
				console.error("Error fetching habitaciones:", err);
			} finally {
				setIsLoadingHabitacion(false);
			}
		};
		fetchHabitacion();
	};

	useEffect(() => {
		if (!hoteles) return;
		// Solo actualiza si es diferente
		const isDifferent =
			hoteles.length !== selectedHoteles.length ||
			hoteles.some((h: any, i: any) => h.nombre_hotel !== selectedHoteles[i]?.nombre_hotel);
		if (isDifferent) {
			setSelectedHoteles(hoteles);
		}
	}, [hoteles]);

	useEffect(() => {
		if (filters.enabled) {
			refetchReportFallas();
			refetchReportBackgroundGraphs();
			refetchReportBackgroundCommentsAndImages();
		}
	}, [filters]);

	useEffect(() => {
		if (tagsFallas && tagsFallas.length > 0) {
			setSelectedFallas([]);
		}
	}, [tagsFallas]);

	useEffect(() => {
		if (
			Array.isArray(fallasXHotelGraph) &&
			fallasXHotelGraph.length === 1 &&
			fallasXHotelGraph[0]?.hotel
		) {
			const formattedHotel =
				fallasXHotelGraph[0].hotel.toUpperCase().replace(/_/g, " ");
			if (hotelSeleccionado !== formattedHotel) {
				handleHotelClick(formattedHotel);
			}
		}
	}, [fallasXHotelGraph]);

	useEffect(() => {
		// Cambio de prueba para hacer la peticion si no hay fallas seleccionadas
		if (!selectedFallas || selectedFallas.length === 0) return;

		const handler = setTimeout(() => {
			// Si hay un solo hotel en la gráfica
			if (
				Array.isArray(fallasXHotelGraph) &&
				fallasXHotelGraph.length === 1 &&
				fallasXHotelGraph[0]?.hotel
			) {
				const formattedHotel = fallasXHotelGraph[0].hotel.toUpperCase().replace(/_/g, " ");
				if (hotelSeleccionado === formattedHotel) {
					handleHotelClick(formattedHotel);
				}
			}

			// Si hay más de un hotel y uno está seleccionado
			if (
				Array.isArray(fallasXHotelGraph) &&
				fallasXHotelGraph.length > 1 &&
				hotelSeleccionado
			) {
				handleHotelClick(hotelSeleccionado);
			}
		}, 500); // 500 ms de debounce

		return () => clearTimeout(handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedFallas]);

	// En page.tsx, agregar después de los otros useEffect (línea ~370):
	useEffect(() => {
		// Ejecutar avances de inspecciones cuando la tab activa sea "cuarta"
		if (activePrincipalTab === "cuarta" && filters.enabled) {
			handleAvancesInspecciones();
		}
	}, [activePrincipalTab, filters.enabled]);

	const hotelImagesMap: Record<string, { name: string; url: string }[]> = {};

	(hotelesFotografias ?? []).forEach((item: any) => {
		const hotel = item.hotel;
		if (!hotel) return;
		if (!hotelImagesMap[hotel]) hotelImagesMap[hotel] = [];

		// Extrae todos los file_url de media
		Object.values(item.media || {}).forEach((arr: any) => {
			if (Array.isArray(arr)) {
				arr.forEach((img: any) => {
					if (img.file_url) {
						hotelImagesMap[hotel].push({
							name: img.file_name || img.name || "",
							url: img.file_url,
						});
					}
				});
			}
		});
	});

	// Convierte el mapa a un arreglo para renderizar
	const hotelesImagenes: any[] = [];

	(hotelesFotografias ?? []).forEach((item: any) => {
		const hotel = item.hotel;
		const habitacion = item.habitacion;
		const fieldLabel = item.field_label || {};
		const media = item.media || {};
		const comments = item.comments || {};

		Object.entries(media).forEach(([fallaId, imagesArr]) => {
			const fallaNombre = fieldLabel[fallaId] || "";
			const comentario = comments[fallaId] || "";
			if (Array.isArray(imagesArr)) {
				imagesArr.forEach((img: any) => {
					if (img.file_url) {
						hotelesImagenes.push({
							hotel,
							habitacion,
							falla: fallaNombre,
							comentario,
							image: {
								name: img.file_name || img.name || "",
								url: img.file_url,
							},
						});
					}
				});
			}
		});
	});

	const hotelesComentariosMap: Record<string, { falla: string; comment: string; room: string; images: { name: string; url: string }[] }[]> = {};

	(hotelesComentarios ?? []).forEach((item: any) => {
		const hotel = item.hotel;
		if (!hotel) return;
		if (!hotelesComentariosMap[hotel]) hotelesComentariosMap[hotel] = [];

		const commentsObj = item.comments || {};
		const mediaObj = item.media || {};
		const fieldLabelObj = item.field_label || {};
		const habitacion = item.habitacion || "";

		Object.entries(commentsObj).forEach(([commentId, commentText]) => {
			// Relaciona imágenes por id
			const imagesArr = Array.isArray(mediaObj[commentId])
				? mediaObj[commentId].map((img: any) => ({
					name: img.file_name || img.name || "",
					url: img.file_url,
				}))
				: [];

			// Toma el nombre de la falla desde field_label
			const fallaNombre = fieldLabelObj[commentId] || "";

			hotelesComentariosMap[hotel].push({
				falla: fallaNombre, // nombre de la falla
				comment: commentText as string,
				room: habitacion,   // nombre de la habitación
				images: imagesArr,
			});
		});
	});


	const hotelesImagenesPorHotel: Record<string, any[]> = {};
	hotelesImagenes.forEach((imgObj: any) => {
		if (imgObj.hotel) { // Solo agrega si hotel no es null
			if (!hotelesImagenesPorHotel[imgObj.hotel]) {
				hotelesImagenesPorHotel[imgObj.hotel] = [];
			}
			hotelesImagenesPorHotel[imgObj.hotel].push(imgObj);
		}
	});

	if (isLoadingReportFallas || isLoadingHotelesFallas) {
		return (
			<div className="flex flex-col items-center justify-center h-screen">
				<div className="flex space-x-2 mb-4">
					<div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
					<div className="w-4 h-4 bg-blue-400 rounded-full animate-bounce delay-150"></div>
					<div className="w-4 h-4 bg-blue-300 rounded-full animate-bounce delay-300"></div>
				</div>
				<div className="text-2xl text-gray-500">Cargando Reporte Fallas...</div>
			</div>
		);
	}
	if (errorReportFallas || errorHotelesFallas) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-2xl text-red-500">
					Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.
				</div>
			</div>
		);
	}

	return (
		<div className="h-screen mt-8">
			<div className="flex gap-3 w-3/4 justify-between items-center m-auto">
				<div className="flex items-center">
					<Image
						width={1200}
						height={1200}
						src="/company_pic_7742.jpg"
						alt="Imagen"
						className="w-full h-full object-contain bg-gray-200 rounded-lg"
					/>
				</div>
				<div>
					<h1 className="text-3xl font-semibold">Reporte fallas</h1>
				</div>
				<div></div>
			</div>
			<div className="flex justify-between w-11/12 m-auto mt-6 gap-4">
				<div className="flex gap-4">
					<div>
						<YearSelect value={selectedYear} onChange={setSelectedYear} />
					</div>
					<div>
						<Multiselect
							key={selectedCuatri.length}
							options={optionsCuatri}
							displayValue="name"
							placeholder="Cuatrimestre"
							selectedValues={selectedCuatri}
							onSelect={setSelectedCuatri}
							onRemove={setSelectedCuatri}
						/>
					</div>
					<div>
						<Multiselect
							key={selectedHoteles.length}
							options={Array.isArray(hoteles) ? hoteles : []}
							displayValue="nombre_hotel"
							placeholder="Hoteles"
							selectedValues={selectedHoteles}
							onSelect={setSelectedHoteles}
							onRemove={setSelectedHoteles}
						/>
					</div>
				</div>
				<div className="flex gap-2">
					<div>
						<Button variant="outline" onClick={handleClear}><Eraser />Limpiar</Button>
					</div>
					<div>
						<Button className="bg-blue-600" onClick={handleGetReport}><Play />Ejecutar</Button>
					</div>
				</div>
			</div>
			{!cards || Object.keys(cards).length === 0 ? (
				<div className="flex justify-center items-center w-11/12 m-auto mt-6">
					<div className="text-lg text-gray-500 p-8">
						<h1>No hay inspecciones registradas para este hotel.</h1>
					</div>
				</div>
			) : (
				<>
					<div className="flex justify-between w-11/12 m-auto mt-6 gap-4">
						<div className="grid grid-cols-4 gap-4">
							{stats.map((stat, idx) => (
								<StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} />
							))}
						</div>
						<div className="flex flex-col gap-2">
							{/* ✅ Contenedor del gauge chart */}
							<div className="border p-4 h-full flex items-center rounded-lg">
								<GaugeChart porcentaje={porcentaje} />
							</div>

							{/* ✅ Botón simple de exportar estadísticas */}
							<Button
								onClick={handleExportStats}
								disabled={isExportingStats || !stats || stats.length === 0}
								className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
								size="sm"
							>
								{isExportingStats ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
										Exportando...
									</>
								) : (
									<>
										<FileSpreadsheet className="mr-2 h-4 w-4" />
										Exportar Stats
									</>
								)}
							</Button>
						</div>
					</div>
					<div className="flex flex-col w-11/12 m-auto mt-6 gap-4 border p-4 rounded-lg">
						<Tabs
							value={activePrincipalTab}
							onValueChange={setActivePrincipalTab}
							defaultValue="principal"
						>
							<TabsList>
								<TabsTrigger value="principal">Ranking de Habitaciones</TabsTrigger>
								<TabsTrigger value="secundaria">Calificacion por Hotel</TabsTrigger>
								<TabsTrigger value="tercera">Calificacion por Seccion</TabsTrigger>
								<TabsTrigger value="cuarta">Avance de Inspecciones</TabsTrigger>
							</TabsList>
							<TabsContent value="principal">
								<div className="text-2xl underline my-4">Ranking de Habitaciones</div>
								<BubbleChart data={bubbleChart} />
							</TabsContent>
							<TabsContent value="secundaria">
								<div className="text-2xl underline my-4">Calificacion por Hotel</div>
								<MultiLineChart data={calificacionXHotelGraph} />
							</TabsContent>
							<TabsContent value="tercera">
								<div className="text-2xl underline my-4">Calificacion por Seccion</div>
								<RadarChart data={radarData} />
							</TabsContent>
							<TabsContent value="cuarta">
								<div className="text-2xl underline my-4">Avance de Inspecciones</div>
								{/* ✅ Agregar contenido para mostrar los datos */}
								{isLoadingAvancesInspecciones ? (
									<div className="flex justify-center items-center h-40 text-xl text-gray-400">
										Cargando avances de inspecciones...
									</div>
								) : errorAvancesInspecciones ? (
									<div className="flex flex-col items-center justify-center h-40 text-red-400">
										<div className="text-xl mb-2">❌ Error al cargar avances</div>
										<div className="text-sm mb-4">{errorAvancesInspecciones.message}</div>
										<Button
											onClick={handleAvancesInspecciones}
											className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
										>
											Reintentar
										</Button>
									</div>
								) : avancesInspecciones?.agrupado_por_hotel ? (
									<div>
										{/* ✅ Usar el nuevo componente con zoom */}
										<MultiLineChartZoom data={avancesInspecciones.agrupado_por_hotel} />
									</div>
								) : (
									<div className="flex items-center justify-center h-40 text-gray-400">
										<div className="text-xl">Sin datos de avances de inspecciones</div>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</div>
					<div className="flex flex-col w-11/12 m-auto mt-6" style={{ height: "52rem" }}>
						<div className="flex gap-4 h-full">
							<div className="border rounded-lg p-4 w-2/5 flex flex-col gap-4 h-full">
								<div>
									<div className="font-bold">
										Fallas: {formatNumber(tagsFallas?.reduce((sum: number, tag: any) => sum + (tag.total ?? 0), 0) ?? 0)}
									</div>
									<div className="text-gray-400 flex items-center justify-between">
										<div>
											Seleccione una falla para visualizar
										</div>
										<div>
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													selectedFallas.length === 0
														? setSelectedFallas(tagsFallas.map((tag: any) => tag.falla))
														: setSelectedFallas([])
												}
												className="ml-2"
											>
												{selectedFallas.length === 0 ? "Seleccionar todas" : "Limpiar selección"}
											</Button>
										</div>
									</div>
								</div>
								<div>
									<Input
										type="text"
										placeholder="Search"
										value={searchFalla ?? ""}
										onChange={e => setSearchFalla(e.target.value)}
									/>
								</div>
								<div className="flex-1 min-h-0">
									<ScrollArea className="w-full rounded-md border h-full">
										<div className="p-4 h-full">
											{(filteredFallas ?? []).map((tag: any, idx: any) => (
												<div key={idx}>
													<div className="text-sm my-2 w-full">
														<FallaBadge
															falla={tag.falla}
															total={tag.total}
															active={selectedFallas.includes(tag.falla)}
															onToggle={handleToggleFalla}
														/>
													</div>
												</div>
											))}
										</div>
									</ScrollArea>
								</div>
							</div>
							<div className="border rounded-lg p-4 w-3/5 h-full flex flex-col">
								<Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="grafica" className="flex-1 flex flex-col min-h-0">
									<div>
										<TabsList>
											<TabsTrigger value="grafica">Fallas</TabsTrigger>
											<TabsTrigger value="habitaciones">Habitaciones</TabsTrigger>
										</TabsList>
									</div>
									<TabsContent value="grafica" className="flex-1 min-h-0">
										<div className="h-full flex-1 min-h-0">
											{Array.isArray(fallasXHotelGraph) && fallasXHotelGraph.length === 1 ? (
												<PieChartFallas
													values={fallasXHotelGraph}
													selectedFallas={selectedFallas}
													onHotelClick={handleHotelClick}
												/>
											) : (
												<PieChart
													values={fallasXHotelGraph}
													selectedFallas={selectedFallas}
													onHotelClick={handleHotelClick}
												/>
											)}
										</div>
									</TabsContent>
									<TabsContent value="habitaciones" className="flex-1 min-h-0">
										{!hotelSeleccionado ? (
											<div className="text-gray-400 text-xl flex items-center justify-center h-full">
												Haz clic en un hotel dentro de la gráfica para ver su información detallada
											</div>
										) : (
											<div className="flex gap-4 flex-col h-full min-h-0">
												<div className="border rounded-lg p-4 flex-1 min-h-0 flex flex-col">
													<div className="text-2xl">Habitaciones {hotelSeleccionado && `Hotel ${hotelSeleccionado}`}</div>
													<Separator className="w-[22rem] bg-black mt-2" />
													<ScrollArea className="w-full flex-1 min-h-0">
														<div className="w-full">
															<div
																className="grid gap-2 p-4"
																style={{
																	gridTemplateColumns: "repeat(auto-fit, minmax(2.5rem, 1fr))",
																}}
															>
																{isLoadingHabitaciones ? (
																	<div className="flex justify-center items-center h-40 text-xl text-gray-400">
																		Obteniendo habitaciones...
																	</div>
																) : (
																	[...hotelHabitaciones]
																		.sort((a, b) => Number(a.numero_habitacion) - Number(b.numero_habitacion))
																		.map((hab, idx) => {
																			const numero = hab.numero_habitacion;

																			let boxClass = 'border text-white bg-gray-400'; // Por defecto blanca

																			if (hab.sin_fallas === true) {
																				boxClass = 'bg-green-600 text-white';
																			} else if (hab.inspeccion_habitacion) {
																				if (hab.inspeccion_habitacion.fallas > 0) {
																					boxClass = 'bg-red-600 text-white';
																				} else {
																					boxClass = 'bg-green-500 text-white';
																				}
																			} else if (hab.inspeccion_id) {
																				boxClass = 'bg-blue-500 text-white';
																			}

																			// Si está seleccionada, agrega una clase extra
																			const isSelected = habitacionSeleccionada === hab.nombre_area_habitacion;
																			const selectedClass = isSelected ? 'ring-4 ring-blue-500 ring-offset-2' : '';

																			return (
																				<div
																					key={`${hab.numero_habitacion}-${idx}`}
																					className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded cursor-pointer ${boxClass} ${selectedClass}`}
																					onClick={() => handleHabitacionClick(hotelSeleccionado, hab.nombre_area_habitacion)}
																					title={hab.nombre_area_habitacion || hab.numero_habitacion}
																				>
																					{numero}
																				</div>
																			);
																		})
																)}
															</div>
														</div>
													</ScrollArea>
												</div>
												{isLoadingHabitacion ? (
													<div className="border rounded-lg p-4 flex justify-center items-center flex-1 min-h-0 text-gray-400 text-xl">
														Cargando detalles de la habitación...
													</div>
												) : !hotelHabitacion || Object.keys(hotelHabitacion).length === 0 ? (
													<div className="border rounded-lg p-4 flex justify-center items-center flex-1 min-h-0 text-gray-400 text-xl">
														Selecciona una habitacion para ver sus detalles
													</div>
												) : hotelHabitacion.mensaje === "No hay inspección para esta habitación" ? (
													<div className="border rounded-lg p-4 flex justify-center items-center flex-1 min-h-0 text-gray-400 text-xl">
														No hay inspección para esta habitación
													</div>
												) : (
													<div className="border rounded-lg p-4 flex justify-center flex-1 min-h-0">
														<RoomCard roomData={hotelHabitacion} />
													</div>
												)}
											</div>
										)}

									</TabsContent>
								</Tabs>
							</div>
						</div>
					</div>
					<div className="flex flex-col w-11/12 m-auto mt-6">
						<div className="border p-4 rounded-lg mb-6">
							<Tabs defaultValue="general">
								<TabsList>
									<TabsTrigger value="general">General</TabsTrigger>
									<TabsTrigger value="fotografias">Fotografias</TabsTrigger>
									<TabsTrigger value="comentarios">Comentarios</TabsTrigger>
									<TabsTrigger value="acciones">Acciones</TabsTrigger>
								</TabsList>
								<TabsContent value="general">
									<div className="">
										<div className="flex justify-between mt-4">
											<div className="w-2/4 text-3xl">Habitaciones inspeccionadas</div>
											<div className="flex w-2/4 gap-4">
												<div className="border p-4 rounded-lg w-full flex flex-col gap-4">
													<div className="font-semibold">Mejor habitacion</div>
													<div className="flex justify-between items-center">
														<div>
															<div className="font-semibold">{mejorHabitacion?._id?.habitacion}</div>
															<div className="text-gray-500 text-sm">{mejorHabitacion?._id?.hotel}</div>
															<div className="text-gray-500 text-sm">
																{maxInspecciones} inspecciones, {maxFallas} fallas y {maxAciertos} aciertos
															</div>
														</div>
														<div>
															<div className="bg-gray-200 p-4 rounded-full">
																{(maxGrade * 100).toFixed(2)}%
															</div>
														</div>
													</div>
													<div>
														<ProgressBar value={maxGrade * 100} color="bg-green-500" />
													</div>
												</div>
												<div className="border p-4 rounded-lg w-full flex flex-col gap-4">
													<div className="font-semibold">Habitacion con mayor indice de fallas</div>
													<div className="flex justify-between items-center">
														<div>
															<div className="font-semibold">{peorHabitacion?._id?.habitacion}</div>
															<div className="text-gray-500 text-sm">{peorHabitacion?._id?.hotel}</div>
															<div className="text-gray-500 text-sm">
																{peorInspecciones} inspecciones, {peorFallas} fallas y {peorAciertos} aciertos
															</div>
														</div>
														<div>
															<div className="bg-gray-200 p-4 rounded-full">
																{(peorGrade * 100).toFixed(2)}%
															</div>
														</div>
													</div>
													<div>
														<ProgressBar value={peorGrade * 100} color="bg-red-500" />
													</div>
												</div>
											</div>
										</div>
										<div className="p-4">
											<HabitacionesInspeccionadasTable
												isLoading={false}
												habitaciones={tableHabitacionesInspeccionadas}
											/>
										</div>
									</div>
								</TabsContent>
								<TabsContent value="fotografias">
									<div className="flex justify-end w-full gap-2">
										<Button className={imagesGrid == '1' ? `bg-black text-white hover:text-white` : `bg-transparent text-black hover:text-white`} onClick={() => { handleChangeGrid('1') }}>
											<Square />
										</Button>
										<Button className={imagesGrid == '2' ? `bg-black text-white hover:text-white` : `bg-transparent text-black hover:text-white`} onClick={() => { handleChangeGrid('2') }}>
											<Grid2x2 />
										</Button>
										<Button className={imagesGrid == '3' ? `bg-black text-white hover:text-white` : `bg-transparent text-black hover:text-white`} onClick={() => { handleChangeGrid('3') }}>
											<Grid3x3 />
										</Button>
									</div>
									<div className="h-[56rem]">
										<ScrollArea className="w-full h-full">
											{Object.entries(hotelesImagenesPorHotel).map(([hotel, images]) => (
												hotel && (
													<div key={hotel} className="mb-10">
														<div className="text-2xl font-bold mb-4">{hotel}</div>
														<ImageCarrousel
															images={images}
															cols={imagesGrid}
														/>
													</div>
												)
											))}
										</ScrollArea>
									</div>
								</TabsContent>
								<TabsContent value="comentarios">
									<div className="">
										<div className="font-semibold text-3xl my-8">Comentarios</div>
										<ComentariosFiltrados hotelesComentarios={hotelesComentarios} />
									</div>
								</TabsContent>
								<TabsContent value="acciones">
									{/* <div className="">
								<div className="text-3xl mt-4">Acciones correctivas</div>
								<TicketsTable isLoading={false} tickets={misTickets} />
							</div> */}
									<div className="flex items-center justify-center h-96">
										<div className="flex flex-col items-center justify-center">
											{/* Usa un icono de Lucide */}
											<Construction className="w-24 h-24 text-yellow-400 mb-6 animate-bounce" />
											<span className="text-2xl text-gray-400 font-semibold mb-2">
												La tabla de acciones correctivas estará disponible próximamente
											</span>
											<span className="text-lg text-gray-500">
												Estamos trabajando en esta funcionalidad.
											</span>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</>
			)}
		</div >
	);
};

export default ReportsPage;