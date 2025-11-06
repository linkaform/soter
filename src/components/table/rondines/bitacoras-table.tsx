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
} from "lucide-react";

import { ViewDetalleArea } from "@/components/modals/rondines-detalle-area";
import { ViewRondinesDetallePerimetroExt } from "@/components/modals/rondines-inspeccion-perimetro-exterior";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetListBitacoraRondines } from "@/hooks/Rondines/useGetListBitacora";

const EstadoIcono = ({ estado }: { estado: string }) => {
  const baseClass = "w-5 h-5";
  switch (estado) {
    case "finalizado":
      return <CircleCheck className={`${baseClass} text-white bg-green-600 rounded-xl`} />;
    case "no_inspeccionada":
      return <CircleSlash className={`${baseClass} text-white bg-amber-500 rounded-xl`} />;
    case "cancelado":
      return <Ban className={`${baseClass} text-slate-400`} />;
    case "en progreso":
      return <CircleDashed strokeWidth={2.75} className={`${baseClass} text-blue-500 font-bold rounded-xl`} />;
    case "cerrado":
      return <CircleCheck className={`${baseClass} text-white bg-gray-500 rounded-xl`} />;
    case "incidencias":
      return <CircleAlert className={`${baseClass} text-white bg-red-500 rounded-xl`} />;
    case "programado":
      return <Calendar className={`${baseClass} text-white bg-purple-500 rounded-xl p-0.5`} />;
    default:
      return <Circle className={`${baseClass} text-slate-300`} />;
  }
};

type Estado = { dia: number; estado: string };

type Area = {
  nombre: string;
  estados: Estado[];
};

type Categoria = {
  titulo: string;
  resumen?: string[];
  areas: Area[];
};

type Rondin = {
  hora: string;
  categorias: Categoria[];
};

// interface ListProps {
// 	data: Rondin[];
// 	isLoading:boolean;
// }


export const RondinesBitacoraTable = () => {
	// const { listBitacoraRondines , isLoadingListBitacoraRondines} = useGetListBitacoraRondines()
	const { listBitacoraRondines:data, isLoadingListBitacoraRondines: isLoading } =
	useGetListBitacoraRondines() as {
		listBitacoraRondines?: Rondin[];
		isLoadingListBitacoraRondines: boolean;
	};

	const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);
	const [diaSelected, setDiaSelected] = useState(0);
	const [estatus, setEstatus] = useState("");
	const [modalOpenPerimetroExt, setModalOpenPerimetroExt] = useState(false);
	const [modalOpenArea, setModalOpenArea] = useState(false);
	const [selectedAreaData, setSelectedAreaData] = useState<any>(null);
	const [selectedRondin,setSelectedRondin] = useState<any>(null)
	const now = new Date();
	// const dias = useState<number>(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate())
	const [dias, setDias] = useState<number>(0);
	const nombreMes = now.toLocaleString("es-ES", { month: "long" });

	useEffect(() => {
		const now = new Date();
		const totalDias = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		setDias(totalDias);
	}, []);
	// function getDaysInMonth(filter: string) {
	// 	const now = new Date();
	// 	let targetDate = new Date(now);
	// 	filter = filter?.toLowerCase() || "";
	// 	if (filter === "last_week") {
	// 	  targetDate.setDate(now.getDate() - 7);
	// 	} else if (filter === "last_fifteen_days") {
	// 	  targetDate.setDate(now.getDate() - 15);
	// 	} else if (filter === "last_month") {
	// 	  targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	// 	}
	// 	return new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();
	//   }
	  
	//   useEffect(() => {
	// 	const totalDias = getDaysInMonth(dateFilter);
	// 	setDias(totalDias);
	//   }, [dateFilter]);
	  
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

	// function getMonth(filter: string) {
	// 	const now = new Date();
	// 	const monthNames = [
	// 	"Enero",
	// 	"Febrero",
	// 	"Marzo",
	// 	"Abril",
	// 	"Mayo",
	// 	"Junio",
	// 	"Julio",
	// 	"Agosto",
	// 	"Septiembre",
	// 	"Octubre",
	// 	"Noviembre",
	// 	"Diciembre",
	// 	];
	// 	const getMonthNameFromDate = (date: Date) => monthNames[date.getMonth()];

	// 	if (!filter) return getMonthNameFromDate(now);

	// 	filter = filter.toLowerCase();
	// 	if (filter === "last_week") {
	// 	const d = new Date();
	// 	d.setDate(now.getDate() - 7);
	// 	return getMonthNameFromDate(d);
	// 	} else if (filter === "last_fifteen_days") {
	// 	const d = new Date();
	// 	d.setDate(now.getDate() - 15);
	// 	return getMonthNameFromDate(d);
	// 	} else if (filter === "last_month") {
	// 	const d = new Date(now.getFullYear(), now.getMonth() - 1, 1);
	// 	return getMonthNameFromDate(d);
	// 	}
	// 	return getMonthNameFromDate(now);
	// }

  return (
    <div className="w-full">
	
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
			</div>
			<div className="text-2xl font-bold capitalize">{nombreMes}</div>
			<div className="flex w-full justify-end gap-3">
			<div className="flex items-center w-48 gap-2"> 
				{/* <Select value={dateFilter}  onValueChange={(value) => { 
					setDateFilter(value); 
					}}> 
				<SelectTrigger className="w-full">
				<SelectValue placeholder="Selecciona un filtro de fecha" />
				<CalendarDays diasDisponibles={""} />
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
				</Select> */}
			</div>
			</div>
			</div>

			<div className="overflow-auto flex-1 border rounded" style={{ maxHeight: "80vh" }}>


				{isLoading ? (
					<div className="flex justify-center place-items-center h-screen">
						<div className="w-24 h-24 border-8 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
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
						{data && data?.map(({ hora, categorias }) => (
						<React.Fragment key={hora}>
							<tr>
							<td className="border pl-2 font-bold">{hora}</td>
							{[...Array(dias)].map((_, i) => (
								<td
								key={i}
								className={`border ${sundaysIndexes.includes(i) ? "bg-blue-100" : ""}`}
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
									<td className="border text-sm flex p-2">
									<span className="mr-2">
										{isExpanded ? <CircleChevronUp size={20} /> : <CircleChevronDown size={20} />}
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
										className={`border ${isSunday ? "bg-blue-200/50" : "bg-transparent"}`}
										>
										<div className="flex justify-center items-center">
											{estadoDia && (
											<div
												onClick={(e) => {
												e.stopPropagation();
												setSelectedAreaData({ area: area, estadoDia });
												setDiaSelected(i+1);
												setModalOpenPerimetroExt(true);
												setEstatus(estadoDia);
								setSelectedRondin(categoria)
												}}
												className="cursor-pointer"
											>
												<EstadoIcono estado={estadoDia} />
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
