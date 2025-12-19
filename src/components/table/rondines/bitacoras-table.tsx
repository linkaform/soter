"use client"
import React, { useEffect, useState } from "react";
import {
  Circle,
  CircleCheck,
  Ban,
  CircleChevronDown,
  CircleChevronUp,
  CircleSlash,
  CircleAlert,
  Calendar,
  CalendarOff,
  ChevronRight,
  ChevronLeft,
  Search,
} from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetListBitacoraRondines } from "@/hooks/Rondines/useGetListBitacora";
import { CarruselDetalleArea } from "@/components/carrousel-detalle-area";
import { CarruselDetalleRondin } from "@/components/carrousel-detalle-rondin";

const ESTADOS_CONFIG: Record<string, { icon: React.ElementType; className: string }> = {
	finalizado: { icon: CircleCheck, className: "text-white bg-green-600 rounded-xl" },
	fuera_de_hora: { icon: CircleCheck, className: "text-white bg-pink-600 rounded-xl" },
	no_inspeccionada: { icon: CircleSlash, className: "text-white bg-amber-500 rounded-xl" },
	cancelado: { icon: Ban, className: "text-slate-400" },
	// en_progreso: { icon: CircleDashed, className: "text-blue-500 font-bold rounded-xl" },
	// cerrado: { icon: CircleCheck, className: "text-white bg-gray-500 rounded-xl" },
	incidencias: { icon: CircleAlert, className: "text-white bg-red-500 rounded-xl" },
	programado: { icon: Calendar, className: "text-white bg-purple-500 rounded-xl p-0.5" },
	no_aplica: { icon: CalendarOff, className: "text-white bg-gray-300 rounded-xl p-0.5" },
	// Duplicate key 'cancelado' removed, assuming the first one or a specific one is desired. 
	// The original code had two 'cancelado' cases. I'll keep the first one (Ban) as it seems more standard, 
	// but I'll add a 'cancelado_x' for the second one if needed or just merge.
	// Looking at the original code: 
	// case "cancelado": return <Ban ... />
	// case "cancelado": return <CircleX ... /> (lines 43-44)
	// The second one was unreachable. I will use the first one.
};

const EstadoIcono = ({ estado }: { estado: string }) => {
	const baseClass = "w-5 h-5";
	const config = ESTADOS_CONFIG[estado];

	if (config) {
		const Icon = config.icon;
		// Special case for strokeWidth if needed, or just pass it.
		// The original 'en_progreso' had strokeWidth={2.75}.
		const extraProps = estado === "en_progreso" ? { strokeWidth: 2.75 } : {};
		return <Icon {...extraProps} className={`${baseClass} ${config.className}`} />;
	}

	return <Circle className={`${baseClass} text-slate-300`} />;
};

type Estado = { dia: number; estado: string; record_id?: string };

type Area = {
	nombre: string;
	estados: Estado[];
};

type Bitacora = {
	dia: number;
	estado: string;
	record_id: string;
}

type Categoria = {
	titulo: string;
	resumen?: Bitacora[];
	areas: Area[];
};

type Rondin = {
	hora: string;
	categorias: Categoria[];
};

export const RondinesBitacoraTable = ({ showTabs , ubicacion, nombre_rondin}: { showTabs: boolean, ubicacion:any, nombre_rondin?: string }) => {
	

	const { listBitacoraRondines:data, isLoadingListBitacoraRondines: isLoading } =
	useGetListBitacoraRondines(ubicacion, nombre_rondin) as {
		listBitacoraRondines?: Rondin[];
		isLoadingListBitacoraRondines: boolean;
	};
	const [diaSelected, setDiaSelected] = useState(0);
	const [estatus, setEstatus] = useState("");
	// const [modalOpenPerimetroExt, setModalOpenPerimetroExt] = useState(false);
	const [selectedAreaIndex, setSelectedAreaIndex] = useState<number>(0);
	// const [selectedAreaData, setSelectedAreaData] = useState<any>(null);
	const [selectedRondin, setSelectedRondin] = useState<any>(null)
	const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [dias, setDias] = useState<number>(0);
	const [carruselOpen, setCarruselOpen] = useState(false);
	const [carruselOpenRondin, setCarruselOpenRondin] = useState(false);
	const [horaSeleccionada, setHoraSeleccionada] = useState("")
	const abrirCarrusel = () => setCarruselOpen(true);
	const abrirCarruselRondin = () => setCarruselOpenRondin(true);

	const [tags, setTags] = useState<string[]>([]);
	const [inputValue, setInputValue] = useState("");

	const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
	if (e.key === "Enter" && inputValue.trim()) {
		const newTag = inputValue.trim().toLowerCase();
		if (!tags.includes(newTag)) setTags(prev => [...prev, newTag]);
		setInputValue("");
		e.preventDefault();
	}
	};

	const handleRemoveTag = (tag: string) => {
		setTags(prev => prev.filter(t => t !== tag));
	  };

	const filteredData = React.useMemo(() => {
		if (!data || tags.length === 0) return data ?? [];
	  
		const newExpanded: string[] = [];
		const result = data
		  .map(rondin => {
			const categoriasFiltradas = rondin.categorias
			  .map(cat => {
				const catMatch = tags.some(tag => cat.titulo.toLowerCase().includes(tag));
				const areasFiltradas = cat.areas.filter(area =>
				  tags.some(tag => area.nombre.toLowerCase().includes(tag))
				);
	  
				if (catMatch || areasFiltradas.length > 0) {
				  newExpanded.push(`${rondin.hora}-${cat.titulo}`);
				}
	  
				if (catMatch || areasFiltradas.length > 0) {
				  return { ...cat, areas: areasFiltradas.length > 0 ? areasFiltradas : cat.areas };
				}
				return null;
			  })
			  .filter(Boolean) as Categoria[];
	  
			if (categoriasFiltradas.length > 0) {
			  return { ...rondin, categorias: categoriasFiltradas };
			}
			return null;
		  })
		  .filter(Boolean) as Rondin[];
	  
		setExpandedCategorias(prev => Array.from(new Set([...prev, ...newExpanded])));
	  
		return result;
	  }, [data, tags]);
	const [selectedEstados, setSelectedEstados] = useState<string[]>([]);

	const toggleEstadoFilter = (estado: string) => {
		setSelectedEstados((prev) =>
			prev.includes(estado)
				? prev.filter((e) => e !== estado)
				: [...prev, estado]
		);
	};

	useEffect(() => {
		const now = new Date();
		const totalDias = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		setDias(totalDias);
	}, []);

	const [currentDate, setCurrentDate] = useState(new Date());
	const [nombreMes, setNombreMes] = useState(
		currentDate.toLocaleString("es-ES", { month: "long" })
	);

	useEffect(() => {
		const totalDias = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0
		).getDate();
		setDias(totalDias);
		setNombreMes(
			currentDate.toLocaleString("es-ES", { month: "long" })
		);
	}, [currentDate]);

	const handlePrevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
		);
	};

	const handleNextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
		);
	};

	useEffect(() => {
		if (data) {
			setExpandedCategorias([]);
		}
	}, [data]);

	const toggleExpand = (key: string) => {
		setExpandedCategorias((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);
	};

	const sundaysIndexes = [...Array(dias)].reduce((acc, _, i) => {
		const date = new Date();
		date.setDate(i + 1);
		if (date.getDay() === 0) acc.push(i);
		return acc;
	}, [] as number[]);

	const renderArea = (area: Area, key: string, rondin: any, areaIndex: number) => (
		<tr key={key} className="bg-transparent">
		<td className="border p-2 pl-8">{area.nombre}</td>
		{[...Array(dias)].map((_, i) => {
			const estadoDia = area.estados.find((e) => e.dia === i + 1);
			const isSunday = sundaysIndexes.includes(i);
	
			return (
			<td
				key={i}
				className={`border pl-3 text-center cursor-pointer ${
				isSunday ? "bg-blue-100" : ""
				}`}
			>
				{estadoDia && (
				<div
					onClick={() => {
					// setSelectedAreaData({ area, estadoDia });
					abrirCarrusel();
					setDiaSelected(estadoDia.dia);
					setEstatus(estadoDia.estado);
					setSelectedRondin(rondin);
					setSelectedAreaIndex(areaIndex); 
					}}
				>
					<EstadoIcono estado={estadoDia.estado} />
				</div>
				)}
			</td>
			);
		})}
		</tr>
	);


	const toggleExpandAllForHora = (hora: string, categorias: Categoria[]) => {
		const allKeys = categorias.map(c => `${hora}-${c.titulo}`);
		const areAllExpanded = allKeys.every(key => expandedCategorias.includes(key));

		setExpandedCategorias(prev =>
			areAllExpanded
				? prev.filter(k => !allKeys.includes(k))
				: [...prev, ...allKeys.filter(k => !prev.includes(k))]
		);
	};


	useEffect(() => {
		if (selectedRondin) console.log("selectedRondin", selectedRondin.areas)
	}, [selectedRondin])

	return (
		<div >
			<div className="flex justify-between items-center my-2 ">
				<div className="flex w-full justify-start gap-4 ">
					{showTabs &&
						<div className="flex justify-center items-center">
							<TabsList className="bg-blue-500 text-white p-1 rounded-md ">
								<TabsTrigger value="Bitacora">Bitácora</TabsTrigger>
								<TabsTrigger value="Rondines">Rondines</TabsTrigger>
								<TabsTrigger value="Incidencias">Incidencias</TabsTrigger>
								<TabsTrigger value="Fotos">Fotos</TabsTrigger>
								<TabsTrigger value="Calendario">Calendario</TabsTrigger>
							</TabsList>
						</div>
					}
					<div className="flex gap-1 items-center">
						{/* <div className="flex w-full max-w-sm items-center space-x-2">
						<input
							type="text"
							placeholder="Buscar"
							value={globalFilter || ''}
							onChange={(e) => setGlobalFilter(e.target.value)}
							className="border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full" 
						/>
							<Search />
						</div> */}
					<div className="border p-2 rounded w-full">
					<div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap pr-1">
						
						{tags.map((tag, idx) => (
						<span
							key={idx}
							className="bg-blue-500 text-white px-2 py-0.5 rounded-full inline-flex items-center gap-1"
						>
							{tag}
							<button
							type="button"
							onClick={() => handleRemoveTag(tag)}
							className="ml-1 text-white font-bold"
							>
							×
							</button>
						</span>
						))}

						<div className="flex items-center">
						<input
							type="text"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleTagInputKeyDown}
							placeholder="Buscar"
							className="outline-none"
						/>
						</div>
					</div>
					</div>

						<Search />


						{/* <div className="flex w-full max-w-sm items-center space-x-2">
							<input
								type="text"
								placeholder="Buscar"
								value={globalFilter || ''}
								onChange={(e) => setGlobalFilter(e.target.value)}
								className="border border-gray-300 rounded-md p-2 placeholder-gray-600 w-full"
							/>
							<Search />
						</div> */}
					</div>
				</div>
				<div className="flex items-center gap-3 text-2xl font-bold capitalize select-none">
					<button
						onClick={handlePrevMonth}
						className="p-1 rounded-full hover:bg-gray-200 transition"
					>
						<ChevronLeft size={28} />
					</button>

					<span className="w-40 text-center">{nombreMes}</span>

					<button
						onClick={handleNextMonth}
						className="p-1 rounded-full hover:bg-gray-200 transition"
					>
						<ChevronRight size={28} />
					</button>
				</div>

				<div className="flex w-full justify-end gap-3">
					<div className="flex items-center gap-2 flex-wrap justify-end">
						{Object.entries(ESTADOS_CONFIG).map(([estado, config]) => {
							const Icon = config.icon;
							const isSelected = selectedEstados.includes(estado);
							return (
								<button
									key={estado}
									onClick={() => toggleEstadoFilter(estado)}
									className={`flex items-center gap-1 px-2 py-1 rounded-md border transition-all ${isSelected
										? "bg-blue-100 border-blue-500 ring-1 ring-blue-500"
										: "bg-white border-gray-200 hover:bg-gray-50"
										}`}
									title={estado.replace("_", " ")}
								>
									<Icon className={`w-4 h-4 ${config.className}`} />
									<span className="text-xs capitalize">{estado.replace("_", " ")}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="overflow-auto  rounded" style={{ maxHeight: "80vh" }}>
				{isLoading ? (
					<div>
						<div className="flex flex-col justify-start place-items-center mt-20">
							<div className="w-16 h-16 border-8  border-t-blue-500 rounded-full animate-spin"></div>
							<span className="text-gray-500">
								Cargando información...
							</span>
						</div>
					</div>
				) : (
					<table className="min-w-full border-collapse border">
						<thead className="sticky top-0 z-0 bg-white">
							<tr>
								<th className="border p-2 bg-white">Rondines</th>
								{[...Array(dias)].map((_, i) => {
									const date = new Date();
									date.setDate(i + 1);
									const diaSemana = date
										.toLocaleDateString("es-MX", { weekday: "short" })
										.slice(0, 2);
									const isSunday = date.getDay() === 0;

							return (
							<th
							key={`label-${i}`}
							className={`border p-1 text-center ${
								isSunday ? "bg-blue-100" : "bg-white"
							}`}
							>
							<div className="text-sm">{String(i + 1).padStart(2, "0")}</div>
							<div className="text-xs font-medium capitalize text-gray-600">
								{diaSemana}
							</div>
							</th>
							);
						})}
					</tr>
					</thead>

						<tbody>
							{filteredData &&
								filteredData
									.map((rondin) => {
										const matchHora = rondin.hora.toLowerCase().includes(globalFilter.toLowerCase());
										// Filtrar las categorías y áreas dentro del rondín
										const categoriasFiltradas = rondin.categorias
											.map((categoria) => {
												const matchCategoria = categoria.titulo
													.toLowerCase()
													.includes(globalFilter.toLowerCase());

												// Filter areas based on globalFilter AND selectedEstados
												const areasFiltradas = categoria.areas.filter((area) => {
													const matchesGlobal = area.nombre.toLowerCase().includes(globalFilter.toLowerCase());

													// If no states selected, match all states. Otherwise check if area has ANY of the selected states.
													const matchesEstado = selectedEstados.length === 0 || area.estados.some(e => selectedEstados.includes(e.estado));

													return matchesGlobal && matchesEstado;
												});

												// Check if the category itself has any matching states in its summary (resumen)
												// This is relevant if we want to show the category even if no areas match, 
												// but usually we want to show categories that have matching areas OR matching summary items.
												// Let's assume we want to show the category if it has matching areas OR if the category title matches AND there are some matching states in the summary?
												// Actually, the previous logic was: matchCategoria || areasFiltradas.length > 0

												// New logic:
												// We need to check if the category's summary (resumen) matches the selected states too.
												const matchesResumenEstado = selectedEstados.length === 0 || (categoria.resumen && categoria.resumen.some(r => selectedEstados.includes(r.estado)));

												// If the category matches the text filter, we still need to respect the state filter.
												// If selectedEstados is active, we only show things that match the state.

												// If areasFiltradas > 0, we definitely keep the category.
												// If areasFiltradas == 0, but matchCategoria is true... do we keep it? 
												// Only if it also matches the state filter (via resumen).

												if (areasFiltradas.length > 0) {
													return { ...categoria, areas: areasFiltradas };
												}

												if (matchCategoria && matchesResumenEstado) {
													return { ...categoria, areas: [] }; // Show category with no areas if it matches text & state
												}

												return null;
											})
											.filter((cat) => cat !== null) as Categoria[];

										// Logic to decide if we show the hour row
										// If we have matching categories, we show it.
										// If we have NO matching categories:
										//   - If we have an active state filter, we HIDE it (return null).
										//   - If we have NO active state filter, we respect the text search (matchHora).

										const hasActiveStateFilter = selectedEstados.length > 0;
										const shouldShowHour = categoriasFiltradas.length > 0 || (matchHora && !hasActiveStateFilter);

										if (shouldShowHour) {
											return { ...rondin, categorias: categoriasFiltradas };
										}

										return null;
									})
									.filter((r) => r !== null)
									.map(({ hora, categorias }) => (
										<React.Fragment key={hora}>
											<tr>
												<td className="font-bold flex items-center justify-start gap-2">
													<button
														className="ml-1 text-sm px-2 py-.5 bg-blue-500 text-white rounded hover:bg-blue-600"
														onClick={() => toggleExpandAllForHora(hora, categorias)}
													>
														{categorias.every((c) =>
															expandedCategorias.includes(`${hora}-${c.titulo}`)
														)
															? "-"
															: "+"}
													</button>
													{hora}
												</td>
												{[...Array(dias)].map((_, i) => (
													<td
														key={i}
														className={`border ${sundaysIndexes.includes(i) ? "bg-blue-100" : ""
															}`}
													></td>
												))}
											</tr>

								{categorias.map((categoria, index:number) => {
									const catKey = `${hora}-${categoria?.titulo}`;
									const isExpanded = expandedCategorias.includes(catKey);
									return (
										<React.Fragment key={catKey}>
											<tr
												className="cursor-pointer font-semibold text-sm bg-green-100"
												onClick={(e) => {
													e.stopPropagation();
													toggleExpand(catKey);
												}}
											>
															{/* {estadoDia && (
											<div
												onClick={(e) => {
												e.stopPropagation();
												setSelectedAreaData({ area: area, estadoDia });
												setDiaSelected(i+1);
												setModalOpenPerimetroExt(true);
												// REVISAR SI ESTO FUNCIONA BIEN
												setEstatus(estadoDia.estado);
												setSelectedRondin(categoria)
											}}
											className="cursor-pointer"
												// REVISAR SI ESTO FUNCIONA BIEN
											>
												<EstadoIcono estado={estadoDia.estado} />
											</div> */}
										<td className="border text-sm flex p-2">
											<span className="mr-2">
											{isExpanded ? (
												<CircleChevronUp size={20} />
											) : (
												<CircleChevronDown size={20} />
											)}
											</span>
											{categoria?.titulo}
										</td>
										{[...Array(dias)].map((_, i) => {
											const isSunday = sundaysIndexes.includes(i);
											const estadoDia = categoria?.resumen?.[i];
											// const area = categoria?.areas.find((a) =>
											// a.estados.some((e) => e.dia === i + 1)
											// );

											return (
												<td
													key={i}
													className={`border ${isSunday ? "bg-blue-200/50" : "bg-transparent"
														}`}
												>
													<div className="flex justify-center items-center">
														{estadoDia && (
															<div
																onClick={(e) => {
																console.log("RONDIN SELECIONADO", categoria, index)

																	e.stopPropagation();
																	setDiaSelected(i + 1);
																	abrirCarruselRondin();
																	setEstatus(estadoDia.estado);
																	setHoraSeleccionada(hora)
																	setSelectedRondin(categoria);
																	setSelectedAreaIndex(index); 
																}}
																className="cursor-pointer"
															>
																<EstadoIcono estado={estadoDia.estado} />
															</div>
														)}
													</div>
												</td>
											);
										})}
										</tr>

										{isExpanded &&
										categoria?.areas?.map?.((area, idx) =>
											renderArea(area, `${catKey}-area-${idx}`, categoria, idx)
										)}
									</React.Fragment>
									);
								})}
								</React.Fragment>
							))}
														
						</tbody>

					</table>
					)}

				{carruselOpenRondin && (
					<CarruselDetalleRondin
					rondinesHoraSeleccionada={ data?.find((h: { hora: string; }) => h.hora === horaSeleccionada)?.categorias ?? []}
					startIndex={selectedAreaIndex} 
					diaSelected={diaSelected}
					estatus={estatus}
					onClose={() => setCarruselOpenRondin(false)}
					/>
				)} 

				{carruselOpen && (
					<CarruselDetalleArea
						areas={selectedRondin?.areas ?? []}
						startIndex={selectedAreaIndex}
						diaSelected={diaSelected}
						rondin={selectedRondin?.name}
						estatus={estatus}
						selectedRondin={selectedRondin}
						onClose={() => setCarruselOpen(false)}
					/>
				)}
			</div>

		</div>
	);
};
