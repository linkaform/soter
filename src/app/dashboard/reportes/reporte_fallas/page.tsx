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
} from "lucide-react";
import GaugeChart from "../graphs/GaugeChart";
import MultiLineChart from "../graphs/MultiLineChart";
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
import HotelComments from "../components/HotelComments";
import { YearSelect } from "../components/YearSelect"

// import { misTickets } from '../data/tickets'
import { optionsCuatri } from '../data/consts'
import ProgressBar from "../components/ProgressBar";
import FallaBadge from "../components/FallaBadge";
import Multiselect from "multiselect-react-dropdown";
import { useGetHoteles, useReportFallas } from "../hooks/useReportFallas";

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

const ReportsPage = () => {

	const [imagesGrid, setImageGrid] = useState('6')
	const [appliedCuatri, setAppliedCuatri] = useState<any>([]);
	const [selectedYear, setSelectedYear] = useState<string | null>(null);
	const [selectedCuatri, setSelectedCuatri] = useState<any[]>([]);
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
		anio: null,
		cuatrimestres: [],
		hoteles: []
	});
	const { reportFallas, isLoadingReportFallas, errorReportFallas, refetchReportFallas } = useReportFallas(filters);
	const { hotelesFallas, isLoadingHotelesFallas, errorHotelesFallas } = useGetHoteles(true);
	const hoteles = hotelesFallas?.hoteles;
	const cantidadSi = reportFallas?.cantidad_si_y_no[0].total
	const cantidadNo = reportFallas?.cantidad_si_y_no[1].total
	const inspecciones = reportFallas?.total_inspecciones_y_remodeladas?.total_inspecciones_completadas
	const remodeladas = reportFallas?.total_inspecciones_y_remodeladas?.total_habitaciones_remodeladas
	const cal_maxima = reportFallas?.calificaciones?.resumen?.max_global
	const cal_min = reportFallas?.calificaciones?.resumen?.min_global
	const cal_promedio = reportFallas?.calificaciones?.resumen?.promedio_global
	const porcentaje = reportFallas?.porcentaje_propiedades_inspeccionadas
	const calificacionXHotelGraph = reportFallas?.calificacion_x_hotel_grafica
	const tagsFallas = reportFallas?.fallas?.totales
	const fallasXHotelGraph = reportFallas?.fallas?.por_hotel
	const tableHabitacionesInspeccionadas = reportFallas?.table_habitaciones_inspeccionadas;
	const bubbleChart = reportFallas?.table_habitaciones_inspeccionadas;
	const mejorHabitacion = reportFallas?.mejor_y_peor_habitacion?.mejor_habitacion;
	const peorHabitacion = reportFallas?.mejor_y_peor_habitacion?.habitacion_mas_fallas;
	const radarData = reportFallas?.graph_radar?.radar_data;
	const hotelesFotografias = reportFallas?.hoteles_fotografias?.hoteles_fotografias
	const hotelesComentarios = reportFallas?.hoteles_comentarios?.hoteles_comentarios
	const [hotelHabitaciones, setHotelHabitaciones] = useState<any[]>([]);
	const [hotelHabitacion, setHotelHabitacion] = useState<any>();
	const stats = [
		{
			icon: <Search />,
			value: inspecciones ?? '0.0',
			label: 'Habitaciones inspeccionadas'
		},
		{
			icon: <Bed className="text-green-500" />,
			value: remodeladas ?? '0.0',
			label: 'Habitaciones remodeladas'
		},
		{
			icon: <Check className="text-green-700" />,
			value: cantidadSi ?? '0.0',
			label: 'Aciertos (Si)'
		},
		{
			icon: <X className="text-red-800" />,
			value: cantidadNo ?? '0.0',
			label: 'Fallas (No)'
		},

		{
			icon: <Trophy className="text-sky-600" />,
			value: cal_maxima ?? '0.0',
			label: 'Calificacion maxima'
		},
		{
			icon: <Flag className="text-orange-600" />,
			value: cal_min ?? '0.0',
			label: 'Calificacion minima'
		},
		{
			icon: <ChartLine className="text-black" />,
			value: cal_promedio ?? '0.0',
			label: 'Calificacion promedio'
		},
		{
			icon: <Star className="text-yellow-500" />,
			value: '0.0',
			label: 'Calificacion de hotel'
		}
	]

	const filteredFallas = (tagsFallas ?? []).filter((tag: any) =>
		tag.falla.toLowerCase().includes(searchFalla.toLowerCase())
	);

	const handleChangeGrid = (cols: string) => {
		if (cols == imagesGrid) {
			setImageGrid('6')
		} else {
			setImageGrid(cols)
		}
	}

	const handleGetReport = () => {
		setFilters({
			enabled: true,
			anio: selectedYear,
			cuatrimestres: selectedCuatri,
			hoteles: selectedHoteles
		});
		setAppliedCuatri(selectedCuatri);
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
		if (filters.enabled) {
			refetchReportFallas();
		}
	}, [filters]);

	useEffect(() => {
		if (tagsFallas && tagsFallas.length > 0) {
			setSelectedFallas(tagsFallas.map((tag: any) => tag.falla));
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
	const hotelesImagenes = Object.entries(hotelImagesMap).map(([hotel, images]) => ({
		hotel,
		images,
	}));

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

	// Convierte el mapa a un arreglo para renderizar
	const hotelesComentariosArr = Object.entries(hotelesComentariosMap).map(([hotel, comments]) => ({
		hotel,
		comments,
	}));

	if (isLoadingReportFallas || isLoadingHotelesFallas) {
		return (
			<div className="flex items-center justify-center h-screen">
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
						<YearSelect onChange={setSelectedYear} />
					</div>
					<div>
						<Multiselect
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
							options={hoteles}
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
			<div className="flex justify-between w-11/12 m-auto mt-6 gap-4">
				<div className="grid grid-cols-4 gap-4">
					{stats.map((stat, idx) => (
						<StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} />
					))}
				</div>
				<div>
					<div className="border p-4 h-full flex items-center rounded-lg">
						<GaugeChart porcentaje={porcentaje} />
					</div>
				</div>
			</div>
			<div className="flex flex-col w-11/12 m-auto mt-6 gap-4 border p-4 rounded-lg">
				<Tabs defaultValue="principal">
					<TabsList>
						<TabsTrigger value="principal">Ranking de Habitaciones</TabsTrigger>
						<TabsTrigger value="secundaria">Calificacion por Hotel</TabsTrigger>
						<TabsTrigger value="tercera">Calificacion por Seccion</TabsTrigger>
					</TabsList>
					<TabsContent value="principal">
						<div className="text-2xl underline my-4">Ranking de Habitaciones</div>
						<BubbleChart data={bubbleChart} />
					</TabsContent>
					<TabsContent value="secundaria">
						<div className="text-2xl underline my-4">Calificacion por Hotel</div>
						<MultiLineChart data={calificacionXHotelGraph} cuatris={appliedCuatri ? appliedCuatri : []} />
					</TabsContent>
					<TabsContent value="tercera">
						<div className="text-2xl underline my-4">Calificacion por Seccion</div>
						<RadarChart data={radarData} />
					</TabsContent>
				</Tabs>
			</div>
			<div className="flex flex-col w-11/12 m-auto mt-6" style={{ height: "52rem" }}>
				<div className="flex gap-4 h-full">
					<div className="border rounded-lg p-4 w-2/5 flex flex-col gap-4 h-full">
						<div>
							<div className="font-bold">
								Fallas: {tagsFallas?.reduce((sum: number, tag: any) => sum + (tag.total ?? 0), 0) ?? 0}
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
															hotelHabitaciones.map((hab, idx) => {
																const numero = hab.numero_habitacion;
																let boxClass = 'border border-red-500 text-red-700';
																if (hab.inspeccion_habitacion) {
																	if (hab.inspeccion_habitacion.fallas > 0) {
																		boxClass = 'bg-red-600 text-white';
																	} else {
																		boxClass = 'bg-green-500 text-white';
																	}
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
													<div className="font-semibold">{mejorHabitacion?.habitacion}</div>
													<div className="text-gray-500 text-sm">{mejorHabitacion?.hotel}</div>
													<div className="text-gray-500 text-sm">{mejorHabitacion?.total_inspecciones} inspecciones, {mejorHabitacion?.total_fallas} fallas</div>
												</div>
												<div>
													<div className="bg-gray-200 p-4 rounded-full">
														{mejorHabitacion?.grade}%
													</div>
												</div>
											</div>
											<div><ProgressBar value={mejorHabitacion?.grade} color="bg-green-500" /></div>
										</div>
										<div className="border p-4 rounded-lg w-full flex flex-col gap-4">
											<div className="font-semibold">Habitacion con mayor indice de fallas</div>
											<div className="flex justify-between items-center">
												<div>
													<div className="font-semibold">{peorHabitacion?.habitacion}</div>
													<div className="text-gray-500 text-sm">{peorHabitacion?.hotel}</div>
													<div className="text-gray-500 text-sm">{peorHabitacion?.total_inspecciones} inspecciones, {peorHabitacion?.total_fallas} fallas</div>
												</div>
												<div>
													<div className="bg-gray-200 p-4 rounded-full">
														{peorHabitacion?.grade}%
													</div>
												</div>
											</div>
											<div><ProgressBar value={peorHabitacion?.grade} color="bg-red-500" /></div>
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
									{hotelesImagenes.map(({ hotel, images }, idx) => (
										<ImageCarrousel
											key={hotel + idx}
											hotelName={hotel}
											images={images}
											cols={imagesGrid}
										/>
									))}
								</ScrollArea>
							</div>
						</TabsContent>
						<TabsContent value="comentarios">
							<div className="">
								<div>
									<div className="font-semibold text-3xl my-8">Comentarios</div>
									<div className="h-[56rem]">
										<ScrollArea className="w-full h-full">
											{hotelesComentariosArr.map(({ hotel, comments }, idx) => (
												<HotelComments key={hotel + idx} hotel={hotel} comments={comments} />
											))}
										</ScrollArea>
									</div>
								</div>
							</div>
						</TabsContent>
						<TabsContent value="acciones">
							{/* <div className="">
								<div className="text-3xl mt-4">Acciones correctivas</div>
								<TicketsTable isLoading={false} tickets={misTickets} />
							</div> */}
							<div className="flex items-center justify-center h-96">
								<span className="text-3xl text-gray-400 font-semibold">Coming soon...</span>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div >
	);
};

export default ReportsPage;