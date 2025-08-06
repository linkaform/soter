/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GaugeChart from "../graphs/GaugeChart";
import StatCard from "../components/StatCard";
import { YearSelect } from "../components/YearSelect"
import { optionsCuatri, optionsCuatriDefecto } from '../data/consts'
import Multiselect from "multiselect-react-dropdown";
import { useGetHotelesAvances, useReportAvances } from "../hooks/useReportFallas";
import { formatNumber } from "../utils/formatNumber";

import {
	Bed,
	ChartLine,
	Check,
	Flag,
	Search,
	Hotel,
	Trophy,
	Eraser,
	Play,
	X,
} from "lucide-react";

const currentYear = new Date().getFullYear().toString();

const ReportsPage = () => {

	const [appliedCuatri, setAppliedCuatri] = useState<any>([]);
	const [selectedYear, setSelectedYear] = useState<string | null>(currentYear);
	const [selectedCuatri, setSelectedCuatri] = useState<any[]>([...optionsCuatriDefecto]);
	const [selectedHoteles, setSelectedHoteles] = useState<any[]>([]);
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
	const { reportAvances, isLoadingReportAvances, errorReportAvances, refetchReportAvances } = useReportAvances(filters);
	const { hotelesFallas, isLoadingHotelesFallas, errorHotelesFallas } = useGetHotelesAvances(true);
	const hoteles = hotelesFallas?.hoteles ?? [];
	const cards = reportAvances?.cards ?? {};
	const inspecciones = reportAvances?.total_inspecciones_y_remodeladas ?? {};
	const porcentaje = reportAvances?.porcentaje_inspecciones ?? 0;

	const stats = [
		{
			icon: <Search />,
			value: formatNumber(inspecciones?.habitaciones_inspeccionadas_unicas) ?? '0.0',
			label: 'Inspecciones realizadas'
		},
		{
			icon: <Hotel className="text-yellow-500" />,
			value: formatNumber(inspecciones?.total_inspecciones_completadas) ?? '0.0',
			label: 'Habitaciones inspeccionadas'
		},
		{
			icon: <Bed className="text-green-500" />,
			value: formatNumber(inspecciones?.total_habitaciones_remodeladas) ?? '0.0',
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
			value: (cards?.grade_max * 100).toString(),
			label: 'Calificacion maxima'
		},
		{
			icon: <Flag className="text-orange-600" />,
			value: (cards?.grade_min * 100).toString(),
			label: 'Calificacion minima'
		},
		{
			icon: <ChartLine className="text-black" />,
			value: (cards?.grade_avg * 100).toString(),
			label: 'Calificacion promedio'
		},
	]

	const handleGetReport = () => {
		setFilters({
			enabled: false,
			anio: selectedYear,
			cuatrimestres: selectedCuatri,
			hoteles: selectedHoteles
		});
		setAppliedCuatri(selectedCuatri);
		setAppliedCuatri(appliedCuatri);

		setTimeout(() => {
			refetchReportAvances();
		}, 100);
	}

	const handleClear = () => {
		setSelectedYear(null);
		setSelectedCuatri([]);
		setSelectedHoteles([]);
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


	if (isLoadingReportAvances || isLoadingHotelesFallas) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-2xl text-gray-500">Cargando reporte...</div>
			</div>
		);
	}
	if (errorReportAvances || errorHotelesFallas) {
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
					<h1 className="text-3xl font-semibold">Reporte de Avances</h1>
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
						<div>
							<div className="border p-4 h-full flex items-center rounded-lg">
								<GaugeChart porcentaje={porcentaje} />
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};


export default ReportsPage;