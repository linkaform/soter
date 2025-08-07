/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Multiselect from "multiselect-react-dropdown";
import GridDisplay from "../components/GridDisplay";
import FilterPanel from "../components/FilterPanel";
import StatCard from "../components/StatCard";
import GaugeChart from "../graphs/GaugeChart";
import AuditCard from "../components/AuditCard";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { YearSelect } from "../components/YearSelect"
import { useGetReportAuditorias, useGetStates, useGetAuditorias } from "../hooks/useReportInspecciones";
import { getAuditoriaById, getInspeccionPDF } from "../requests/peticiones";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { processAuditoriasData, processFallasDetalle } from "../utils/dataProcessors"
import {
	ChartLine,
	Check,
	Flag,
	Search,
	Warehouse,
	Star,
	Trophy,
	X,
	Eraser,
	Play,
} from "lucide-react";
import AuditStatsCard from "../components/AuditStatsCard";
import AuditoriasTable from "../tables/auditoriasTable";
import ImagesSection from "../components/ImagesSection";
import CommentsSection from "../components/CommentsSection";
// import BubbleChart from "../graphs/BubbleChart";
// import MultiLineChart from "../graphs/MultiLineChart";
// import RadarChart from "../graphs/RadarChart";

const currentYear = new Date().getFullYear().toString();

interface Filters {
	year: string;
	states: string[];
}

interface State {
	id: string;
	name: string;
}

interface AuditoriaSeleccionada {
	folio?: string;
	[key: string]: any;
}

const ReportsPage = () => {

	const formatSelectedStates = (states: State[]) => {
		return states.map((state) => state.name);
	};

	const [selectedYear, setSelectedYear] = useState<string>(currentYear);
	const [activeTab, setActiveTab] = useState("habitaciones");
	const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<AuditoriaSeleccionada>({});
	const [selectedAuditItem, setSelectedAuditItem] = useState<string | null>(null);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [fallasStates, setFallasStates] = useState<string[]>([]);
	const [searchCategory, setSearchCategory] = useState("");
	const [selectedStates, setSelectedStates] = useState<State[]>([]);
	const [filters, setFilters] = useState<Filters>({
		year: currentYear,
		states: formatSelectedStates(selectedStates)
	});
	const { data: states, isLoading, error } = useGetStates(true);
	const { data: reportData, isLoading: isReportLoading, error: reportError, refetch: executeReport } = useGetReportAuditorias(filters, false);
	const { data: auditoriasData, refetch: executeAuditorias } = useGetAuditorias(selectedCategories, fallasStates, false);
	const auditorias = processAuditoriasData(reportData?.table_section || []);
	const fallasDetalle = processFallasDetalle(reportData?.table_section || []);

	const stats = [
		{
			icon: <Star className="text-yellow-500" />,
			value: reportData?.cards?.total_auditorias ?? 0,
			label: 'Total de auditorias'
		},
		{
			icon: <Search />,
			value: reportData?.cards?.nes_con_auditoria ?? 0,
			label: 'Cantidad de E.S auditadas'
		},
		{
			icon: <Warehouse className="text-green-500" />,
			value: reportData?.cards?.inspecciones_pendientes ?? 0,
			label: 'Cantidad de E.S pendientes'
		},
		{
			icon: <Check className="text-green-700" />,
			value: reportData?.cards?.total_aciertos ?? 0,
			label: 'Aciertos (Cumple)'
		},
		{
			icon: <X className="text-red-800" />,
			value: reportData?.cards?.total_fallas ?? 0,
			label: 'Fallas (No Cumple)'
		},

		{
			icon: <Trophy className="text-sky-600" />,
			value: reportData?.cards?.calificacion_maxima ?? 0,
			label: 'Calificacion maxima'
		},
		{
			icon: <Flag className="text-orange-600" />,
			value: reportData?.cards?.calificacion_minima ?? 0,
			label: 'Calificacion minima'
		},
		{
			icon: <ChartLine className="text-black" />,
			value: reportData?.cards?.calificacion_promedio ?? 0,
			label: 'Calificacion promedio'
		},
	];

	const handleClear = () => {
		setSelectedYear(currentYear);
		setSelectedStates([]);
		setFilters({
			year: currentYear,
			states: []
		});
	};

	const handleAuditItemClick = async (item: any) => {
		setSelectedAuditItem(item._id);
		const auditoriaSeleccionada = await getAuditoriaById(item._id);
		setAuditoriaSeleccionada(auditoriaSeleccionada?.auditoria);
	};

	const handleCategoryToggle = (categoryId: string) => {
		setSelectedCategories(prev =>
			prev.includes(categoryId)
				? prev.filter(c => c !== categoryId)
				: [...prev, categoryId]
		);
	};

	const handleSelectAllCategories = () => {
		if (reportData?.fallas && Array.isArray(reportData.fallas)) {
			const allFallaIds = reportData.fallas.map((falla: { id: string, label: string, total: number }) => falla.id);
			setSelectedCategories(allFallaIds);
		} else {
			setSelectedCategories([]);
		}
	};

	const handleClearCategories = () => {
		setSelectedCategories([]);
	};

	const handleExecuteReport = () => {
		const currentStates = selectedStates;
		const currentYear = selectedYear;
		const formattedStates = formatSelectedStates(currentStates);
		setFilters({
			year: currentYear,
			states: formattedStates
		});
		setFallasStates(formattedStates);
		setTimeout(() => {
			executeReport();
			executeAuditorias();
		}, 100);
	};

	useEffect(() => {
		if (states && Array.isArray(states) && states.length > 0 && selectedStates.length === 0) {
			setSelectedStates(states);
			const formattedStates = formatSelectedStates(states);
			setFilters({
				year: currentYear,
				states: formattedStates
			});
		}
	}, [states]);

	if (isLoading || isReportLoading) {
		return (
			<div className="flex justify-center items-center h-40 text-gray-400">
				Cargando reporte de auditorias...
			</div>
		);
	}

	if (error || reportError) {
		return (
			<div className="flex justify-center items-center h-40 text-red-600">
				Error al cargar los datos del reporte.
			</div>
		);
	}

	return (
		<div className="h-screen mt-8">
			<div className="flex gap-3 w-3/4 justify-between items-center m-auto">
				<div className="flex items-center">
					<Image
						width={1200}
						height={1000}
						src="/company_pic_17236.jpg"
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
					<YearSelect value={selectedYear} onChange={setSelectedYear} />
					<Multiselect
						key={selectedStates.length}
						options={Array.isArray(states) ? states : []}
						displayValue="name"
						placeholder="Estados"
						selectedValues={selectedStates}
						onSelect={setSelectedStates}
						onRemove={setSelectedStates}
					/>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={handleClear}><Eraser />Limpiar</Button>
					<Button className="bg-blue-600" onClick={handleExecuteReport}><Play />Ejecutar</Button>
				</div>
			</div>

			{reportData ? (
				<>
					<div className="flex justify-between w-11/12 m-auto mt-6 gap-4">
						<div className="grid grid-cols-4 gap-4">
							{stats.map((stat, idx) => (
								<StatCard key={idx} icon={stat.icon} value={stat.value} label={stat.label} />
							))}
						</div>
						<div>
							<div className="border p-4 h-full flex items-center rounded-lg">
								<GaugeChart porcentaje={reportData?.cards?.porcentaje_realizadas ?? 0.0} />
							</div>
						</div>
					</div>

					{/* <div className="flex flex-col w-11/12 m-auto mt-6 gap-4 border p-4 rounded-lg">
						<Tabs defaultValue="principal">
							<TabsList>
								<TabsTrigger value="principal">Ranking de Estaciones</TabsTrigger>
								<TabsTrigger value="secundaria">Calificacion por Estacion</TabsTrigger>
								<TabsTrigger value="tercera">Calificacion por Seccion</TabsTrigger>
							</TabsList>
							<TabsContent value="principal">
								<div className="text-2xl underline my-4">Ranking de Estaciones</div>
								<BubbleChart data={[]} />
							</TabsContent>
							<TabsContent value="secundaria">
								<div className="text-2xl underline my-4">Calificacion por Estacion</div>
								<MultiLineChart data={[]} />
							</TabsContent>
							<TabsContent value="tercera">
								<div className="text-2xl underline my-4">Calificacion por Seccion</div>
								<RadarChart data={[]} />
							</TabsContent>
						</Tabs>
					</div> */}

					<div className="flex flex-col w-11/12 m-auto mt-6" style={{ height: "52rem" }}>
						<div className="flex gap-4 h-full">
							<div className="border rounded-lg p-4 w-2/5 flex flex-col gap-4 h-full">
								<FilterPanel
									title="Fallas de Auditoría"
									items={reportData?.fallas || []}
									selectedItems={selectedCategories}
									searchTerm={searchCategory}
									searchPlaceholder="Buscar fallas..."
									selectAllText="Seleccionar todas"
									clearSelectionText="Limpiar selección"
									emptyMessage="No se encontraron fallas"
									onItemToggle={handleCategoryToggle}
									onSearchChange={setSearchCategory}
									onSelectAll={handleSelectAllCategories}
									onClearSelection={handleClearCategories}
									getTotalCount={(items) => items.reduce((sum, item) => sum + (item.total || 0), 0)}
									className="w-2/5"
								/>
							</div>
							<div className="border rounded-lg p-4 w-3/5 h-full flex flex-col">
								<Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="habitaciones" className="flex-1 flex flex-col min-h-0">
									<div>
										<TabsList>
											<TabsTrigger value="grafica">Fallas</TabsTrigger>
											<TabsTrigger value="habitaciones">Auditorias</TabsTrigger>
										</TabsList>
									</div>
									<TabsContent value="grafica" className="flex-1 min-h-0">
										<div className="h-full flex-1 min-h-0">
										</div>
									</TabsContent>
									<TabsContent value="habitaciones" className="flex-1 min-h-0">
										<div className="flex gap-4 flex-col h-full min-h-0">
											<GridDisplay
												title="Auditoría de Calidad Diurna"
												items={auditoriasData?.auditorias || []}
												isLoading={isReportLoading}
												idField="_id"
												onItemClick={handleAuditItemClick}
												selectedItemId={selectedAuditItem}
												emptyMessage="Selecciona una o mas fallas para ver las auditorías"
												getItemStatus={(item) => item.status}
												getItemTooltip={(item) => `${item.label} - ${item.state} (Último chequeo: ${item.created_at})`}
												gridConfig={{
													minItemWidth: "3rem",
													gap: "gap-3",
													itemSize: "w-14 h-14"
												}}
												// Nuevas props para agrupación
												enableGrouping={true}
												groupByField="label" // Agrupar por NES (campo label)
											/>

											<div className="border rounded-lg p-4 flex justify-center items-center flex-1 min-h-0 text-gray-400 text-xl">
												{selectedAuditItem ? (
													<AuditCard
														auditData={auditoriaSeleccionada}
														onDownloadReport={async (auditId) => {
															try {
																const data = await getInspeccionPDF({ recordId: auditId });
																const downloadURL = data?.response?.response?.pdf?.data?.download_url;
																if (downloadURL) {
																	try {
																		const response = await fetch(downloadURL);
																		const blob = await response.blob();
																		const blobURL = URL.createObjectURL(blob);
																		const link = document.createElement("a");
																		link.href = blobURL;
																		link.download = `Auditoria-${auditoriaSeleccionada?.folio}.pdf`;
																		document.body.appendChild(link);
																		link.click();
																		document.body.removeChild(link);
																		URL.revokeObjectURL(blobURL);
																	} catch (err) {
																		console.error("Error downloading PDF blob:", err);
																		alert("Error al descargar el archivo PDF");
																	}
																} else {
																	console.error("No se encontró URL de descarga");
																	alert("No se pudo generar el PDF");
																}
															} catch (err) {
																console.error("Error fetching audit PDF:", err);
																alert("Error al generar el reporte PDF");
															}
														}}
														onImageModal={(imageUrl, auditData) => {
															console.log('Abrir modal con imagen:', imageUrl, auditData);
														}}
													/>
												) : 'Selecciona un elemento para ver sus detalles'}
											</div>
										</div>
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
									<div className="flex justify-between p-4 gap-4">
										<div className="w-2/5">
											<h3 className="text-3xl font-bold">Auditorias</h3>
										</div>
										<div className="w-3/5 flex gap-4">
											<AuditStatsCard
												title="Mejor Auditoría"
												type="best"
												data={reportData?.mejor_peor_auditoria?.mejor_auditoria}
											/>
											<AuditStatsCard
												title="Auditoría con Menor Calificación"
												type="worst"
												data={reportData?.mejor_peor_auditoria?.peor_auditoria}
											/>
										</div>
									</div>
									<div className="p-4">
										<AuditoriasTable
											isLoading={isReportLoading}
											auditorias={auditorias}
										/>
									</div>
								</TabsContent>
								<TabsContent value="fotografias">
									<div className="flex justify-between p-4 gap-4">
										<div>
											<h3 className="text-3xl font-bold">Imagenes de las Auditorias</h3>
										</div>
									</div>
									<div className="p-4">
										<ImagesSection
											fallasDetalle={fallasDetalle}
											isLoading={isReportLoading}
											states={states || []}
											fallas={reportData?.fallas || []}
										/>
									</div>
								</TabsContent>
								<TabsContent value="comentarios">
									<div className="flex justify-between p-4 gap-4">
										<div>
											<h3 className="text-3xl font-bold">Comentarios de las Auditorias</h3>
										</div>
									</div>
									<div className="p-4">
										<CommentsSection
											fallasDetalle={fallasDetalle}
											isLoading={isReportLoading}
											states={states || []}
											fallas={reportData?.fallas || []}
										/>
									</div>
								</TabsContent>
								<TabsContent value="acciones">
									<div className="flex items-center justify-center h-96">
										<span className="text-3xl text-gray-400 font-semibold">Módulo no habilitado</span>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</>
			) : (
				<div className="text-center text-gray-500 text-lg py-12">
					Por favor selecciona los filtros y haz clic en Ejecutar para ver el reporte de auditorías.
				</div>
			)}


			<div className="mb-40 h-40"></div>
		</div>
	);
};

export default ReportsPage;