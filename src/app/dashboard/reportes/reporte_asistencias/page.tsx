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
	Square
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
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

	const [isManualLoading, setIsManualLoading] = useState(false);

	useEffect(() => {
		const currentDate = new Date();
		setMonth(currentDate.getMonth() + 1);
		setYear(currentDate.getFullYear());
	}, []);

	useEffect(() => {
		// Cuando la carga termina (ya sea con éxito o error)
		if (!isLoadingReportAsistencias) {
			// Desactiva el loading manual
			setIsManualLoading(false);

			if (reportAsistencias) {
				setData(reportAsistencias);
			}
		}
	}, [reportAsistencias, isLoadingReportAsistencias]);

	const handleTimeframeChange = (value: string) => {
		setTimeframe(value as "mes" | "semana");
	};

	const [showReport, setShowReport] = useState(false);

	const handleGroupingChange = (value: string) => {
		setGroupingMode(value as GroupingMode);
		setShowReport(false); // Oculta el reporte al cambiar agrupación
	};

	const handleLocationChange = (values: string[]) => {
		setSelectedLocations(values);
	};

	const handleExecute = () => {
		setIsManualLoading(true);
		const newFilters = {
			enabled: true,
			dateRange: timeframe,
			locations: [...selectedLocations],
			groupBy: groupingMode
		};
		setFilters(newFilters);
		setShowReport(true); // Muestra el reporte solo al ejecutar
		setTimeout(() => {
			refetchReportAsistencias();
		}, 10);
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
		setShowReport(false); // Oculta el reporte al limpiar
	};

	const handleExport = () => {
		alert("Función de exportación no implementada aún");
	};

	const [groupByLocation, setGroupByLocation] = useState(false);

	const handleGroupByLocationToggle = () => {
		setGroupByLocation(prev => !prev);
	};

	const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

	return (
		<div className="min-h-screen pb-10">
			<div className="flex justify-between w-11/12 m-auto mt-2 gap-4">
				<div className="grid grid-cols-3 items-center w-full mx-auto mt-8 px-4">
					<div className="justify-self-start"></div>
					<div className="justify-self-center">
						<h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
							Reporte de Asistencias
						</h1>
					</div>
					<div className="justify-self-end">
					</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row justify-between w-11/12 m-auto mt-6 gap-4">
				<div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
					<Select value={timeframe} onValueChange={handleTimeframeChange}>
						<SelectTrigger className="w-full md:w-[180px]">
							<SelectValue placeholder="Selecciona una fecha" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Fechas</SelectLabel>
								<SelectItem value="semana">Esta semana</SelectItem>
								<SelectItem value="mes">Este mes</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
					<MultiSelect
						values={selectedLocations}
						onValuesChange={handleLocationChange}
					>
						<MultiSelectTrigger className="md:w-[500px]">
							<MultiSelectValue placeholder="Selección de ubicaciones" />
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
						<SelectTrigger className="w-full md:w-[200px]">
							<SelectValue placeholder="Selecciona la agrupación" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Agrupación</SelectLabel>
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
							{groupByLocation ? (
								<>
									<CheckSquare className="h-4 w-4" /> Agrupar por ubicación
								</>
							) : (
								<>
									<Square className="h-4 w-4" /> Agrupar por ubicación
								</>
							)}
						</Button>
					)}
				</div>
				<div className="flex gap-2 mt-3 md:mt-0">
					<Button variant="outline" onClick={handleClear}><Eraser className="mr-1" />Limpiar</Button>
					<Button variant="outline" onClick={handleExport}><Download className="mr-1" />Exportar</Button>
					<Button
						className="bg-blue-600"
						onClick={handleExecute}
						disabled={isLoadingReportAsistencias || isManualLoading || isInitializing}
					>
						{isLoadingReportAsistencias || isManualLoading ? (
							<>
								<div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
								Cargando...
							</>
						) : (
							<>
								<Play className="mr-1" />Ejecutar
							</>
						)}
					</Button>
				</div>
			</div>

			<div className="w-11/12 mx-auto mt-8">
				{isInitializing ? (
					<div className="flex justify-center items-center p-12">
						<div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
					</div>
				) : isLoadingReportAsistencias || isManualLoading ? (
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
								<AttendanceTableSymbology
									selectedStatus={selectedStatus}
									onChange={setSelectedStatus}
								/>
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