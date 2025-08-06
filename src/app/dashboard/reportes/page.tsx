/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { AlertTriangle, TrendingUp } from "lucide-react";

const REPORTS = [
	{
		name: "Reporte de Fallas",
		path: "/dashboard/reportes/reporte_fallas",
		icon: <AlertTriangle className="w-8 h-8 text-yellow-500" />,
		description: "Consulta y gestiona las fallas reportadas en habitaciones por hotel.",
		enabled: true,
	},
	{
		name: "Reporte de Avances",
		path: "/dashboard/reportes/reporte_avances",
		icon: <TrendingUp className="w-8 h-8 text-yellow-500" />,
		description: "Consulta el avance de inspecciones y calificaciones por hotel.",
		enabled: true,
	},
	{
		name: " ",
		path: "#",
		description: "",
		enabled: false,
	},
];

const ReportsListPage = () => {
	return (
		<div className="h-screen mt-8 flex flex-col items-center">
			<h1 className="text-3xl font-bold mb-8">Reportes</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
				{REPORTS.map((report) =>
					report.enabled ? (
						<Link
							key={report.name}
							href={report.path}
							className="flex items-center gap-4 p-6 bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer border border-gray-200 hover:bg-gray-50"
						>
							<div>{report.icon}</div>
							<div>
								<div className="font-semibold text-lg">{report.name}</div>
								<div className="text-gray-500 text-sm">
									{report.description}
								</div>
							</div>
						</Link>
					) : (
						<div
							key={report.name}
							className="flex items-center gap-4 p-6 bg-gray-100 rounded-lg border border-gray-200 opacity-60 cursor-not-allowed"
						>
							<div>{report.icon}</div>
							<div>
								<div className="font-semibold text-lg text-gray-400">
									{report.name}
								</div>
								<div className="text-gray-400 text-sm">
									{report.description}
								</div>
							</div>
						</div>
					)
				)}
			</div>
		</div>
	);
};

export default ReportsListPage;