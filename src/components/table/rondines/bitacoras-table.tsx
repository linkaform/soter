import React, { useEffect, useState } from "react";

import { Circle, CircleAlert, CircleCheck, Ban, CircleChevronDown, CircleChevronUp } from "lucide-react";
import { ViewDetalleArea } from "@/components/modals/rondines-detalle-area";
import { ViewRondinesDetallePerimetroExt } from "@/components/modals/rondines-inspeccion-perimetro-exterior";

const EstadoIcono = ({ estado }: { estado: string }) => {
  const baseClass = "w-5 h-5"; // Tamaño común

  switch (estado) {
    case "ok":
      return <CircleCheck className={`${baseClass} text-white bg-green-600 rounded-xl`} />;
    case "alert":
      return <CircleAlert className={`${baseClass} text-white bg-amber-500 rounded-xl`} />;
    case "cancel":
      return <Ban className={`${baseClass} text-slate-400`} />;
	case "check":
		return <CircleCheck className={`${baseClass} text-blue-500  rounded-xl`} />;
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
  areas: Area[];
};

type Rondin = {
  hora: string;
  categorias: Categoria[];
};

type Props = {
  data: Rondin[];
};

export const RondinesBitacoraTable = ({ data }: Props) => {
  const [expandedCategorias, setExpandedCategorias] = useState<string[]>([]);


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
	  <tr key={key} className="bg-white">
		<td className="border p-2 pl-8">{area.nombre}</td>
		{[...Array(31)].map((_, i) => {
		  const estadoDia = area.estados.find((e) => e.dia === i + 1);
  
		  return (
			<td key={i} className="border pl-3 text-center cursor-pointer">
			  {estadoDia ? (
				<div
				  onClick={() => {
					if (estadoDia.estado === "ok") {
					  	setSelectedAreaData({ area, estadoDia });
					  	setModalOpenArea(true);
					} else if (estadoDia.estado === "alert"||estadoDia.estado=="cancel" ||estadoDia.estado=="check" ) {
						setSelectedAreaData({ area, estadoDia });
					  	setModalOpenPerimetroExt(true);
					}
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
  
  return (
	<div>
		<table className="min-w-full border-collapse border">
		<thead>
			<tr >
				<th className="border p-2">Rondines</th>
				{[...Array(31)].map((_, i) => {
				const date = new Date();
				date.setDate(i + 1);
				const diaSemana = date.toLocaleDateString("es-MX", {
					weekday: "short",
				}).slice(0, 2); // Ej: "lu", "ma", etc.

				return (
					<th key={`label-${i}`} className="border p-1 text-center">
					<div className="text-sm">{String(i + 1).padStart(2, "0")}</div>
					<div className="text-xs font-medium capitalize text-gray-600">{diaSemana}</div>
					</th>
				);
				})}
			</tr>
		</thead>
		<tbody>
			{data.map(({ hora, categorias }) => (
			<React.Fragment key={hora}>
				<tr >
				<td className="border pl-2 font-bold">{hora}</td>
				<td className="border" colSpan={31}></td>
				</tr>

				{categorias.map((categoria) => {
				const catKey = `${hora}-${categoria.titulo}`;
				const isExpanded = expandedCategorias.includes(catKey);

				return (
					<React.Fragment key={catKey}>
					<tr
						className="cursor-pointer bg-blue-50 hover:bg-blue-100 font-semibold text-sm"
						onClick={() => toggleExpand(catKey)}
						>
						<td className="border text-sm flex">
						<span className="mr-2 ">{isExpanded ? <CircleChevronUp size={20}/> :<CircleChevronDown size={20}/> }</span>
						{categoria.titulo}
						</td>
						<td className="border" colSpan={31}></td>
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

		{modalOpenPerimetroExt && (
		<ViewRondinesDetallePerimetroExt
			title="Inspección del Perimetro Exterior"
			data={selectedAreaData}   // O adapta según lo que ViewDetalleArea necesite
			isSuccess={modalOpenPerimetroExt}
			setIsSuccess={setModalOpenPerimetroExt}>
			<div></div>
		</ViewRondinesDetallePerimetroExt>
		)}


		{modalOpenArea && (
		<ViewDetalleArea
			title="Detalle del Área"
			data={selectedAreaData}   // O adapta según lo que ViewDetalleArea necesite
			isSuccess={modalOpenArea}
			setIsSuccess={setModalOpenArea}>
			<div></div>
		</ViewDetalleArea>
		)}
	</div>
  );
};
