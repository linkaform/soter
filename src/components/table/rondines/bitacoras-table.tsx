import React, { useEffect, useState } from "react";

import { Circle, CircleCheck, Ban, CircleChevronDown, CircleChevronUp, CircleSlash, CircleAlert, Calendar, CircleDashed, CircleChevronRight, CircleChevronLeft } from "lucide-react";
import { ViewDetalleArea } from "@/components/modals/rondines-detalle-area";
import { ViewRondinesDetallePerimetroExt } from "@/components/modals/rondines-inspeccion-perimetro-exterior";

const EstadoIcono = ({ estado }: { estado: string }) => {
  const baseClass = "w-5 h-5"; // Tamaño común

  switch (estado) {
    case "finalizado":
      return <CircleCheck className={`${baseClass} text-white bg-green-600 rounded-xl`} />;
    case "no_inspeccionada":
      return <CircleSlash className={`${baseClass} text-white bg-amber-500 rounded-xl`} />;
    case "cancelado":
      return <Ban className={`${baseClass} text-slate-400`} />;
	case "rondin_progreso":
		return <CircleDashed className={`${baseClass} text-blue-500  rounded-xl`} />;
	case "cerrado":
		return <CircleCheck className={`${baseClass} text-white bg-gray-500  rounded-xl`} />;
	case "area_incidente":
		return <CircleAlert className={`${baseClass} text-white bg-red-500  rounded-xl`} />;
	case "rondin_programado":
		return <Calendar className={`${baseClass} text-white bg-purple-500  rounded-xl p-0.5`} />;
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
  resumen:string[];
  areas: Area[];
};

type Rondin = {
  hora: string;
  categorias: Categoria[];
};

type Props = {
  data: Rondin[];
  dateFilter:string
};

// export const RondinesBitacoraTable = ({ data ,dateFilter}: Props) => {
//   const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);


// 	useEffect(() => {
// 	const allCategoriaKeys = data.flatMap((rondin) =>
// 		rondin.categorias.map((categoria) => `${rondin.hora}-${categoria.titulo}`)
// 	);
// 	setExpandedCategorias(allCategoriaKeys);
// 	}, [data]);


//   const toggleExpand = (key: string) => {
//     setExpandedCategorias((prev) =>
//       prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
//     );
//   };
//   const [modalOpenPerimetroExt, setModalOpenPerimetroExt] = React.useState(false);
//   const [modalOpenArea, setModalOpenArea] = React.useState(false);
//   const [selectedAreaData, setSelectedAreaData] = React.useState<any>(null);
  
//   const renderArea = (area: Area, key: string) => {
// 	return (
// 	  <tr key={key} className="bg-white">
// 		<td className="border p-2 pl-8">{area.nombre}</td>
// 		{[...Array(31)].map((_, i) => {
// 		  const estadoDia = area.estados.find((e) => e.dia === i + 1);
  
// 		  return (
// 			<td key={i} className="border pl-3 text-center cursor-pointer">
// 			  {estadoDia ? (
// 				<div
// 				  onClick={() => {
// 					if (estadoDia.estado === "ok") {
// 					  	setSelectedAreaData({ area, estadoDia });
// 					  	setModalOpenArea(true);
// 					} else if (estadoDia.estado === "alert"||estadoDia.estado=="cancel" ||estadoDia.estado=="check" ) {
// 						setSelectedAreaData({ area, estadoDia });
// 					  	setModalOpenPerimetroExt(true);
// 					}
// 				  }}
// 				>
// 				  <EstadoIcono estado={estadoDia.estado} />
// 				</div>
// 			  ) : null}
// 			</td>
// 		  );
// 		})}
// 	  </tr>
// 	);
//   };
  
//   function getMonth(filter:string){
// 		console.log(filter);
// 		const now = new Date();
// 		const monthNames = [
// 		"Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
// 		"Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
// 		];
	
// 		const getMonthNameFromDate = (date: Date) => monthNames[date.getMonth()];
	
// 		if (!filter) {
// 		return getMonthNameFromDate(now);
// 		}
	
// 		filter = filter.toLowerCase();
	
// 		if (filter === "last_week") {
// 		const lastWeekDate = new Date();
// 		lastWeekDate.setDate(now.getDate() - 7);
// 		return getMonthNameFromDate(lastWeekDate);
	
// 		} else if (filter === "last_fifteen_days") {
// 		const last15DaysDate = new Date();
// 		last15DaysDate.setDate(now.getDate() - 15);
// 		return getMonthNameFromDate(last15DaysDate);
	
// 		} else if (filter === "last_month") {
// 		const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
// 		return getMonthNameFromDate(lastMonthDate);
	
// 		} else {
// 		return getMonthNameFromDate(now);
// 		}
//   }

//   return (
// 	<div>
// 		<div className="flex justify-center items-center font-bold text-2xl">
// 			<span>{getMonth(dateFilter)}</span>
// 		</div>
// 		<table className="min-w-full border-collapse border">
// 		<thead>
// 			<tr >
// 				<th className="border p-2">Rondines</th>
// 				{[...Array(31)].map((_, i) => {
// 				const date = new Date();
// 				date.setDate(i + 1);
// 				const diaSemana = date.toLocaleDateString("es-MX", {
// 					weekday: "short",
// 				}).slice(0, 2); // Ej: "lu", "ma", etc.

// 				return (
// 					<th key={`label-${i}`} className="border p-1 text-center">
// 					<div className="text-sm">{String(i + 1).padStart(2, "0")}</div>
// 					<div className="text-xs font-medium capitalize text-gray-600">{diaSemana}</div>
// 					</th>
// 				);
// 				})}
// 			</tr>
// 		</thead>
		
// 		<tbody>
// 			{data.map(({ hora, categorias }) => (
// 			<React.Fragment key={hora}>
// 				<tr>
// 					<td className="border pl-2 font-bold">{hora}</td>
// 					<td className="border" colSpan={31}></td>
// 				</tr>
				
// 				{categorias.map((categoria) => {
// 				const catKey = `${hora}-${categoria.titulo}`;
// 				const isExpanded = expandedCategorias.includes(catKey);

// 				return (
// 					<React.Fragment key={catKey}>
// 					<tr
// 						className="cursor-pointer bg-blue-50 hover:bg-blue-100 font-semibold text-sm"
// 						onClick={() => toggleExpand(catKey)}
// 						>
// 						<td className="border text-sm flex">
// 						<span className="mr-2 ">{isExpanded ? <CircleChevronUp size={20}/> :<CircleChevronDown size={20}/> }</span>
// 						{categoria.titulo}
// 						</td>
// 						<td className="border" colSpan={31}></td>
// 					</tr>

// 					{isExpanded &&
// 						categoria.areas.map((area, idx) => renderArea(area, `${catKey}-area-${idx}`))}
// 					</React.Fragment>
// 				);
// 				})}
// 			</React.Fragment>
// 			))}
// 		</tbody>
// 		</table>

// 		{modalOpenPerimetroExt && (
// 		<ViewRondinesDetallePerimetroExt
// 			title="Inspección del Perimetro Exterior"
// 			data={selectedAreaData}   // O adapta según lo que ViewDetalleArea necesite
// 			isSuccess={modalOpenPerimetroExt}
// 			setIsSuccess={setModalOpenPerimetroExt}>
// 			<div></div>
// 		</ViewRondinesDetallePerimetroExt>
// 		)}


// 		{modalOpenArea && (
// 		<ViewDetalleArea
// 			title="Detalle del Área"
// 			data={selectedAreaData}   // O adapta según lo que ViewDetalleArea necesite
// 			isSuccess={modalOpenArea}
// 			setIsSuccess={setModalOpenArea}>
// 			<div></div>
// 		</ViewDetalleArea>
// 		)}
// 	</div>
//   );
// };



const ROWS_PER_PAGE = 2; // Cambia según cuánto quieres mostrar por página

export const RondinesBitacoraTable = ({ data, dateFilter }: Props) => {
	const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);
	const [page, setPage] = useState(0);
	const [diaSelected, setDiaSelected] = useState(0)

	useEffect(() => {
	  const allCategoriaKeys = data.flatMap((rondin) =>
		rondin.categorias.map((categoria) => `${rondin.hora}-${categoria.titulo}`)
	  );
	  setExpandedCategorias(allCategoriaKeys);
	}, [data]);
  
	const toggleExpand = (key: string) => {
	  setExpandedCategorias((prev) =>
		prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
	  );
	};
  
	const [modalOpenPerimetroExt, setModalOpenPerimetroExt] = React.useState(false);
	const [modalOpenArea, setModalOpenArea] = React.useState(false);
	const [selectedAreaData, setSelectedAreaData] = React.useState<any>(null);
  
	const renderArea = (area: Area, key: string) => {
	  return (
		<tr key={key} className="bg-transparent">
		<td className="border p-2 pl-8">{area.nombre}</td>
		{[...Array(31)].map((_, i) => {
			const estadoDia = area.estados.find((e) => e.dia === i + 1);

			const isSunday = sundaysIndexes.includes(i);

			return (
			<td
				key={i}
				className={`border pl-3 text-center cursor-pointer  ${isSunday ? "bg-blue-100" : ""}`}
			>
				{estadoDia ? (
				<div
					
					onClick={() => {
						setSelectedAreaData({ area, estadoDia });
						setModalOpenArea(true);
						setDiaSelected(estadoDia.dia)
					}}
				>
					<EstadoIcono estado={estadoDia.estado} />
				</div>
				) : null}
			</td>
			);
		})}
		</tr>
	  );
	};
  
	function getMonth(filter: string) {
	  const now = new Date();
	  const monthNames = [
		"Enero",
		"Febrero",
		"Marzo",
		"Abril",
		"Mayo",
		"Junio",
		"Julio",
		"Agosto",
		"Septiembre",
		"Octubre",
		"Noviembre",
		"Diciembre",
	  ];
  
	  const getMonthNameFromDate = (date: Date) => monthNames[date.getMonth()];
  
	  if (!filter) {
		return getMonthNameFromDate(now);
	  }
  
	  filter = filter.toLowerCase();
  
	  if (filter === "last_week") {
		const lastWeekDate = new Date();
		lastWeekDate.setDate(now.getDate() - 7);
		return getMonthNameFromDate(lastWeekDate);
	  } else if (filter === "last_fifteen_days") {
		const last15DaysDate = new Date();
		last15DaysDate.setDate(now.getDate() - 15);
		return getMonthNameFromDate(last15DaysDate);
	  } else if (filter === "last_month") {
		const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		return getMonthNameFromDate(lastMonthDate);
	  } else {
		return getMonthNameFromDate(now);
	  }
	}
  
	// Paginación
	const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
	const startIndex = page * ROWS_PER_PAGE;
	const endIndex = Math.min(startIndex + ROWS_PER_PAGE, data.length);
	const pagedData = data.slice(startIndex, endIndex);
  
	const prevPage = () => setPage((p) => Math.max(p - 1, 0));
	const nextPage = () => setPage((p) => Math.min(p + 1, totalPages - 1));
  
	const sundaysIndexes = [...Array(31)].reduce((acc, _, i) => {
		const date = new Date();
		date.setDate(i + 1);
		if (date.getDay() === 0) acc.push(i);
		return acc;
	  }, [] as number[]);

	return (
	  <div className="flex flex-col max-h-screen p-1">
		<div className="text-center font-bold text-2xl">
		<span>{getMonth(dateFilter)}</span>
		</div>
  
		<div className="overflow-auto flex-1 border rounded" style={{ maxHeight: "80vh" }}>
		  <table className="min-w-full border-collapse border">
		  <thead>
			<tr>
				<th className="border p-2">Rondines</th>
				{[...Array(31)].map((_, i) => {
				const date = new Date();
				date.setDate(i + 1);
				const diaSemana = date
					.toLocaleDateString("es-MX", {
					weekday: "short",
					})
					.slice(0, 2); // Ej: "lu", "ma", etc.

				const isSunday = date.getDay() === 0;

				return (
					<th
					key={`label-${i}`}
					className={`border p-1 text-center ${isSunday ? "bg-blue-100" : ""}`}
					>
					<div className="text-sm">{String(i + 1).padStart(2, "0")}</div>
					<div className="text-xs font-medium capitalize text-gray-600">{diaSemana}</div>
					</th>
				);
				})}
			</tr>
			</thead>
  
			<tbody>
			  {pagedData.map(({ hora, categorias }) => (
				<React.Fragment key={hora}>
				  <tr>
					<td className="border pl-2 font-bold">{hora}</td>
					{[...Array(31)].map((_, i) => (
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
						  className="cursor-pointer font-semibold text-sm bg-green-100 "
						  onClick={(e) => {
							e.stopPropagation();
							toggleExpand(catKey)}}
						>
						  <td className="border text-sm flex p-2">
							<span className="mr-2 ">
							  {isExpanded ? (
								<CircleChevronUp size={20} />
							  ) : (
								<CircleChevronDown size={20} />
							  )}
							</span>
							{categoria.titulo}
						  </td>
						  {[...Array(31)].map((_, i) => {
							const isSunday = sundaysIndexes.includes(i);
							const estadoDia = categoria.resumen?.[i]; 

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
										  setModalOpenPerimetroExt(true);
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
						  categoria.areas.map((area, idx) => renderArea(area, `${catKey}-area-${idx}`))}
					  </React.Fragment>
					);
				  })}
				</React.Fragment>
			  ))}
			</tbody>
		  </table>
		</div>

		<div className="flex gap-2 items-end justify-end mt-2">
			<button
			  onClick={prevPage}
			  disabled={page === 0}
			  className="px-3 py-1 bg-none text-blue-600 rounded disabled:opacity-50"
			>
			 <CircleChevronLeft/>
			</button>
			<span>
			  Página {page + 1} de {totalPages}
			</span>
			<button
			  onClick={nextPage}
			  disabled={page === totalPages - 1}
			  className="px-3 py-1 bg-none text-blue-600 rounded disabled:opacity-50"
			>
			  <CircleChevronRight/>
			</button>
		  </div>
		{/* Modales */}
		{modalOpenPerimetroExt && (
		  <ViewRondinesDetallePerimetroExt
			title="Inspección del Perimetro Exterior"
			data={selectedAreaData}
			isSuccess={modalOpenPerimetroExt}
			setIsSuccess={setModalOpenPerimetroExt}
		  >
			<div></div>
		  </ViewRondinesDetallePerimetroExt>
		)}
  
		{modalOpenArea && (
		  <ViewDetalleArea
			title="Detalle del Área"
			data={selectedAreaData}
			isSuccess={modalOpenArea}
			setIsSuccess={setModalOpenArea}
			diaSelected={diaSelected}
			rondin={"Rondin demo"}
		  >
			<div></div>
		  </ViewDetalleArea>
		)}
	  </div>
	);
}