/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
// import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Eraser,
	Play,
	Download,
	CheckSquare,
	Square,
	ChevronLeft,
	ChevronRight,
	Sun
} from "lucide-react";
import PageTitle from "@/components/page-title";
import ChangeLocation from "@/components/changeLocation";
import { useShiftStore } from "@/store/useShiftStore";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	MultiSelect,
	MultiSelectContent,
	MultiSelectGroup,
	MultiSelectItem,
	MultiSelectTrigger,
	MultiSelectValue,
} from "@/components/ui/multi-select";
import { AttendanceRow, GroupingMode } from "../types/attendance";
import { useReportAsistencias, useReportLocations } from "../hooks/useAsistenciasReport";
import { asistenciasReport } from "../types/report";
import LocationShiftAttendanceTable from "../components/LocationShiftAttendanceTable";
import { SimpleAttendanceTable } from "../components/SimpleAttendanceTable";
import AttendanceTableSymbology from "../components/AttendanceTableSymbology";

const areFiltersEqual = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

const getMonthName = (month: number) => {
	const date = new Date();
	date.setMonth(month - 1);
	return date.toLocaleString('es-ES', { month: 'long' });
};

const ReportsPage = () => {
	const [month, setMonth] = useState<number>(0);
	const [year, setYear] = useState<number>(0);
	const daysInMonth = new Date(year, month, 0).getDate();
	const [groupingMode, setGroupingMode] = useState<GroupingMode>("employees");
	const [timeframe, setTimeframe] = useState<"mes" | "semana">("mes");
	const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

	const [data, setData] = useState<AttendanceRow[]>([]);
	const isInitializing = month === 0 || year === 0;
	const hasData = data.length > 0;

	const [filters, setFilters] = useState<asistenciasReport>({
		enabled: false,
		dateRange: 'mes',
		locations: [],
		groupBy: 'employees'
	});

	const { reportAsistencias, isLoadingReportAsistencias, errorReportAsistencias, refetchReportAsistencias } = useReportAsistencias(filters);
	const { reportLocations } = useReportLocations({ enabled: true });

	const [showReport, setShowReport] = useState(false);
	const [groupByLocation, setGroupByLocation] = useState(false);
	const [isExecuted, setIsExecuted] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

	// State for ChangeLocation (visual/global context)
	const { location } = useShiftStore();
	const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState<string>(location);
	const [areaSeleccionada, setAreaSeleccionada] = useState<string>("");

	useEffect(() => {
		const currentDate = new Date();
		setMonth(currentDate.getMonth() + 1);
		setYear(currentDate.getFullYear());
	}, []);

	useEffect(() => {
		if (!isLoadingReportAsistencias) {
			if (reportAsistencias) {
				setData(reportAsistencias);
			}
		}
	}, [reportAsistencias, isLoadingReportAsistencias]);

	const handleTimeframeChange = (value: string) => {
		setTimeframe(value as "mes" | "semana");
	};

	const handleGroupingChange = (value: string) => {
		setGroupingMode(value as GroupingMode);
		setShowReport(false); // Oculta el reporte al cambiar agrupación
	};

	const handleLocationChange = (values: string[]) => {
		setSelectedLocations(values);
	};

	const handleExecute = () => {
		const newFilters = {
			enabled: true,
			dateRange: timeframe,
			locations: [...selectedLocations],
			groupBy: groupingMode
		};
		if (isExecuted && areFiltersEqual(filters, newFilters)) {
			refetchReportAsistencias();
			return;
		}
		setFilters(newFilters);
		setShowReport(true);
		setIsExecuted(true);
	};

	const handleClear = () => {
		const currentDate = new Date();
		setMonth(currentDate.getMonth() + 1);
		setYear(currentDate.getFullYear());
		setTimeframe("mes");
		setGroupingMode("employees");
		setSelectedLocations([]);
		setData([]);

		setFilters({
			enabled: false,
			dateRange: 'mes',
			locations: [],
			groupBy: 'employees'
		});
		setShowReport(false);
	};

	const handleExport = () => {
		alert("Función de exportación no implementada aún");
	};

	const handleGroupByLocationToggle = () => {
		setGroupByLocation(prev => !prev);
	};

	const handlePrevMonth = () => {
		if (month === 1) {
			setMonth(12);
			setYear(year - 1);
		} else {
			setMonth(month - 1);
		}
	};

	const handleNextMonth = () => {
		if (month === 12) {
			setMonth(1);
			setYear(year + 1);
		} else {
			setMonth(month + 1);
		}
	};

	const totalFaltas = data.reduce((acc, row) => acc + ((row as any).resumen?.faltas || 0), 0);
	const totalRetardos = data.reduce((acc, row) => acc + ((row as any).resumen?.retardos || 0), 0);

	return (
		<div className="min-h-screen pb-10">
			<div className="flex flex-col w-11/12 m-auto mt-2 gap-4">
				{/* Header: Title */}

				<div className="flex justify-between items-end">
					<div className="flex gap-4 flex-col">
						<div>
							<div className="mt-8 px-4">
								<PageTitle title="Reporte de Asistencias" />
							</div>
						</div>
						<div className="flex gap-4">
							<Select value={timeframe} onValueChange={handleTimeframeChange}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Periodo" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="semana">Semana</SelectItem>
										<SelectItem value="mes">Mes</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<MultiSelect
								values={selectedLocations}
								onValuesChange={handleLocationChange}
							>
								<MultiSelectTrigger className="w-[250px] md:w-[300px]">
									<MultiSelectValue placeholder="Ubicaciones" />
								</MultiSelectTrigger>
								<MultiSelectContent>
									<MultiSelectGroup>
										{reportLocations?.map((location: string) => (
											<MultiSelectItem key={location} value={location}>
												{location}
											</MultiSelectItem>
										))}
									</MultiSelectGroup>
								</MultiSelectContent>
							</MultiSelect>
							<Select value={groupingMode} onValueChange={handleGroupingChange}>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Agrupación" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="employees">Empleados</SelectItem>
										<SelectItem value="locations">Ubicaciones</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							{groupingMode === "employees" && (
								<Button
									variant="outline"
									onClick={handleGroupByLocationToggle}
									className={`flex items-center gap-2 ${groupByLocation ? 'bg-blue-100 border-blue-500 hover:bg-blue-200' : ''}`}
								>
									{groupByLocation ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
								</Button>
							)}

						</div>

					</div>
					<div className="flex flex-col gap-4 items-end">
						<div className="flex gap-4">
							<div className="w-[200px]">
								<ChangeLocation
									ubicacionSeleccionada={ubicacionSeleccionada}
									areaSeleccionada={areaSeleccionada}
									setUbicacionSeleccionada={setUbicacionSeleccionada}
									setAreaSeleccionada={setAreaSeleccionada}
								/>
							</div>
							<div className="flex gap-4">
								<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100`}>
									<div className="flex gap-6">
										<Sun className="text-primary w-10 h-10" />
										<span className="flex items-center font-bold text-4xl">
											{totalFaltas}
										</span>
									</div>
									<div className="flex items-center space-x-0">
										<div className="h-1 w-1/2 bg-cyan-100"></div>
										<div className="h-1 w-1/2 bg-blue-500"></div>
									</div>
									<span className="text-md">Total Faltas</span>
								</div>
								<div className={`border p-4 px-12 py-1 rounded-md cursor-pointer transition duration-100`}>
									<div className="flex gap-6">
										<Sun className="text-primary w-10 h-10" />
										<span className="flex items-center font-bold text-4xl">
											{totalRetardos}
										</span>
									</div>
									<div className="flex items-center space-x-0">
										<div className="h-1 w-1/2 bg-cyan-100"></div>
										<div className="h-1 w-1/2 bg-blue-500"></div>
									</div>
									<span className="text-md">Total Retardos</span>
								</div>
							</div>
						</div>

					</div>
				</div>

				{/* Controls Row: Symbology | Month Nav | Buttons */}
				<div className="flex flex-col lg:flex-row items-center justify-between px-4 mt-4 gap-4">
					<div className="flex-1 w-full lg:w-auto">
						<AttendanceTableSymbology
							selectedStatus={selectedStatus}
							onChange={setSelectedStatus}
						/>
					</div>

					<div className="flex-1 flex justify-center">
						<div className="flex items-center bg-white p-1">
							<Button variant="ghost" size="icon" onClick={handlePrevMonth}>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<div className="px-4 font-semibold min-w-[140px] text-center capitalize">
								{getMonthName(month)} {year}
							</div>
							<Button variant="ghost" size="icon" onClick={handleNextMonth}>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>

					<div className="flex-1 flex justify-end gap-2 w-full lg:w-auto">
						<Button variant="outline" onClick={handleClear}><Eraser className="mr-1 h-4 w-4" />Limpiar</Button>
						<Button disabled variant="outline" onClick={handleExport}><Download className="mr-1 h-4 w-4" />Exportar</Button>
						<Button
							className="bg-blue-600"
							onClick={handleExecute}
							disabled={isLoadingReportAsistencias || isInitializing}
						>
							{isLoadingReportAsistencias ? (
								<>
									<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
									Cargando...
								</>
							) : (
								<>
									<Play className="mr-1 h-4 w-4" />Ejecutar
								</>
							)}
						</Button>
					</div>
				</div>
			</div>

			<div className="w-11/12 mx-auto mt-4">
				{isInitializing ? (
					<div className="flex justify-center items-center p-12">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
					</div>
				) : isLoadingReportAsistencias ? (
					<div className="flex justify-center items-center p-12">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
					</div>
				) : errorReportAsistencias ? (
					<div className="text-center p-8">
						<p className="text-red-500 mb-2">Error al cargar los datos</p>
						<Button onClick={() => refetchReportAsistencias()}>
							Reintentar
						</Button>
					</div>
				) : !showReport ? (
					<div className="text-center p-8">
						<p className="text-gray-500 mb-2">Sin datos disponibles</p>
						<p className="text-sm text-gray-400">Haz clic en &quot;Ejecutar&quot; para obtener datos</p>
					</div>
				) : !hasData ? (
					<div className="text-center p-8">
						<p className="text-gray-500 mb-2">Sin datos disponibles</p>
						<p className="text-sm text-gray-400">Haz clic en &quot;Ejecutar&quot; para obtener datos</p>
					</div>
				) : (
					<>
						{groupingMode === "employees" && (
							<div>
								<SimpleAttendanceTable
									data={reportAsistencias}
									daysInMonth={daysInMonth}
									groupByLocation={groupByLocation}
									timeframe={timeframe}
									month={month}
									year={year}
									selectedStatus={selectedStatus}
								/>
							</div>
						)}
						{groupingMode === "locations" && (
							<div>
								<LocationShiftAttendanceTable
									data={reportAsistencias}
									month={month}
									year={year}
									timeframe={timeframe}
									selectedStatus={selectedStatus}
									onStatusChange={setSelectedStatus}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default ReportsPage;