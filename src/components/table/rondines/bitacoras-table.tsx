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
  CircleDashed,
  CircleX,
  CalendarOff,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { ViewDetalleArea } from "@/components/modals/rondines-detalle-area";
import { ViewRondinesDetallePerimetroExt } from "@/components/modals/rondines-inspeccion-perimetro-exterior";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetListBitacoraRondines } from "@/hooks/Rondines/useGetListBitacora";
import { useShiftStore } from "@/store/useShiftStore";

const EstadoIcono = ({ estado }: { estado: string }) => {
  const baseClass = "w-5 h-5";
  switch (estado) {
    case "finalizado":
      return <CircleCheck className={`${baseClass} text-white bg-green-600 rounded-xl`} />;
    case "no_inspeccionada":
      return <CircleSlash className={`${baseClass} text-white bg-amber-500 rounded-xl`} />;
    case "cancelado":
      return <Ban className={`${baseClass} text-slate-400`} />;
    case "en_progreso":
      return <CircleDashed strokeWidth={2.75} className={`${baseClass} text-blue-500 font-bold rounded-xl`} />;
    case "cerrado":
      return <CircleCheck className={`${baseClass} text-white bg-gray-500 rounded-xl`} />;
    case "incidencias":
      return <CircleAlert className={`${baseClass} text-white bg-red-500 rounded-xl`} />;
    case "programado":
      return <Calendar className={`${baseClass} text-white bg-purple-500 rounded-xl p-0.5`} />;
	case "no_aplica":
      return <CalendarOff className={`${baseClass} text-white bg-gray-300 rounded-xl p-0.5`} />;
	case "cancelado":
      return <CircleX className={`${baseClass} text-white bg-gray-300 rounded-xl p-0.5`} />;
    default:
      return <Circle className={`${baseClass} text-slate-300`} />;
  }
};

type Estado = { dia: number; estado: string };

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

export const RondinesBitacoraTable = () => {
	const { location } = useShiftStore()
	const { listBitacoraRondines:data, isLoadingListBitacoraRondines: isLoading } =
	useGetListBitacoraRondines(location) as {
		listBitacoraRondines?: Rondin[];
		isLoadingListBitacoraRondines: boolean;
	};
	console.log("BITACORA",data)
	const [diaSelected, setDiaSelected] = useState(0);
	const [estatus, setEstatus] = useState("");
	const [modalOpenPerimetroExt, setModalOpenPerimetroExt] = useState(false);
	const [modalOpenArea, setModalOpenArea] = useState(false);
	const [selectedAreaData, setSelectedAreaData] = useState<any>(null);
	const [selectedRondin,setSelectedRondin] = useState<any>(null)
	const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);
	const [globalFilter, setGlobalFilter] = React.useState("");
	const [dias, setDias] = useState<number>(0);

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
		if(data){
			const allCategoriaKeys = data.flatMap((rondin: { categorias: { titulo: any; }[]; hora: any; }) =>
			rondin.categorias.map((categoria: { titulo: any; }) => `${rondin.hora}-${categoria.titulo}`)
			);
			setExpandedCategorias(allCategoriaKeys);
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
  
  const renderArea = (area: Area, key: string, rondin:any) => (
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
                  setSelectedAreaData({ area, estadoDia });
                  setModalOpenArea(true);
                  setDiaSelected(estadoDia.dia);
                  setEstatus(estadoDia.estado);
				  setSelectedRondin(rondin)
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
			? prev.filter(k => !allKeys.includes(k)) // colapsar todas
			: [...prev, ...allKeys.filter(k => !prev.includes(k))] // expandir todas
		);
	  };
	  
  return (
    <div >
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
					<div>
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
					<div className="flex items-center w-48 gap-2"> 
						
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
					<thead className="sticky top-0 z-10 bg-white">
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
						{data &&
							data
							.map((rondin) => {
								const matchHora = rondin.hora.toLowerCase().includes(globalFilter.toLowerCase());

								// Filtrar las categorías y áreas dentro del rondín
								const categoriasFiltradas = rondin.categorias
								.map((categoria) => {
									const matchCategoria = categoria.titulo
									.toLowerCase()
									.includes(globalFilter.toLowerCase());

									const areasFiltradas = categoria.areas.filter((area) =>
									area.nombre.toLowerCase().includes(globalFilter.toLowerCase())
									);

									if (matchCategoria || areasFiltradas.length > 0) {
									return { ...categoria, areas: areasFiltradas };
									}

									return null;
								})
								.filter((cat) => cat !== null) as Categoria[];

								if (matchHora || categoriasFiltradas.length > 0) {
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
										className={`border ${
										sundaysIndexes.includes(i) ? "bg-blue-100" : ""
										}`}
									></td>
									))}
								</tr>

								{categorias.map((categoria) => {
									const catKey = `${hora}-${categoria.titulo}`;
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
											{categoria.titulo}
										</td>
										{[...Array(dias)].map((_, i) => {
											const isSunday = sundaysIndexes.includes(i);
											const estadoDia = categoria.resumen?.[i];

											const area = categoria.areas.find((a) =>
											a.estados.some((e) => e.dia === i + 1)
											);

											return (
											<td
												key={i}
												className={`border ${
												isSunday ? "bg-blue-200/50" : "bg-transparent"
												}`}
											>
												<div className="flex justify-center items-center">
												{estadoDia && (
													<div
													onClick={(e) => {
														e.stopPropagation();
														setSelectedAreaData({ area: area, estadoDia });
														setDiaSelected(i + 1);
														setModalOpenPerimetroExt(true);
														setEstatus(estadoDia.estado);
														setSelectedRondin(categoria);
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
										categoria.areas.map((area, idx) =>
											renderArea(area, `${catKey}-area-${idx}`, categoria)
										)}
									</React.Fragment>
									);
								})}
								</React.Fragment>
							))}
						</tbody>

					</table>
					)}
				{modalOpenPerimetroExt && (
					<ViewRondinesDetallePerimetroExt
					title="Inspección del Perimetro Exterior"
					isSuccess={modalOpenPerimetroExt}
					setIsSuccess={setModalOpenPerimetroExt}
					estatus={estatus}
					diaSelected={diaSelected}
					selectedRondin={selectedRondin}
					areaSelected={selectedAreaData}
					>
					<div></div>
					</ViewRondinesDetallePerimetroExt>
				)}

				{modalOpenArea && (
					<ViewDetalleArea
					title="Detalle del Área"
					areaSelected={selectedAreaData}
					isSuccess={modalOpenArea}
					setIsSuccess={setModalOpenArea}
					diaSelected={diaSelected}
					selectedRondin={selectedRondin}
					rondin={"Rondin demo"}
					estatus={estatus}
					>
					<div></div>
					</ViewDetalleArea>
				)}
			</div>
	
    </div>
  );
};
