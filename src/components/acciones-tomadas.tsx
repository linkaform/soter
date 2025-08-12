/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useState } from "react";
import { AccionesTomadas } from "@/lib/incidencias";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AccionesTomadasModal } from "./modals/add-acciones-tomadas";

interface PersonasInvolucradasListProps {
    accionesTomadas: AccionesTomadas[];
    setAccionesTomadas: Dispatch<SetStateAction<AccionesTomadas[]>>
}

const SeccionAccionesTomadas:React.FC<PersonasInvolucradasListProps> = ({ accionesTomadas, setAccionesTomadas})=> {
	const [openAccionesTomadasModal, setOpenAccionesTomadasModal] = useState(false);
	const [accionesTomadasSeleccion, setAccionesTomadasSeleccion] = useState([]);
	const [editarAccionesTomadas, setEditarAccionesTomadas] = useState(false)
	const [indiceSeleccionado, setIndiceSeleccionado]= useState<number | null>(null)

	const handleEditAccionesTomadas = (item: any, index: number) => {
		console.log(item, index)
		setAccionesTomadasSeleccion(item);
		setIndiceSeleccionado(index);
		setEditarAccionesTomadas(true)
		setOpenAccionesTomadasModal(true);
	};
	
	const handleDeleteAccionesTomadas  = (index: number) => {
		const nuevaspersonasInvolucradas = [...accionesTomadas];
		nuevaspersonasInvolucradas.splice(index, 1);
		setAccionesTomadas(nuevaspersonasInvolucradas);
		toast.success("Seguimiento eliminado correctamente.")
	};

    return (
    <div >
		<div className="mt-3 flex justify-between">
			<div className="text-lg font-bold">Acciones Tomadas</div>
			<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-md p-2 px-4 text-center text-sm" onClick={()=>{setOpenAccionesTomadasModal(!openAccionesTomadasModal);
				setEditarAccionesTomadas(false)
			}}>
				Agregar 
			</div>
		</div>

		<AccionesTomadasModal
			title="Acciones Tomadas"
			isSuccess={openAccionesTomadasModal}
			setIsSuccess={setOpenAccionesTomadasModal}
			accionesTomadasSeleccion={accionesTomadasSeleccion}
			setAccionesTomadas={setAccionesTomadas}
			setEditarAccionesTomadas={setEditarAccionesTomadas}
			editarAccionesTomadas={editarAccionesTomadas}
			indice={indiceSeleccionado}
			>
			<div></div>
		</AccionesTomadasModal>

		{accionesTomadas && accionesTomadas.length > 0 ? (
		<table className="min-w-full table-auto mb-5 border">
			<thead>
			<tr className="bg-gray-100">
				<th className="px-4 py-2 text-left border-b border-gray-300">Acciones Tomadas</th>
				<th className="px-4 py-2 text-left border-b border-gray-300">Llamado a la Policía</th>
				<th className="px-4 py-2 text-left border-b border-gray-300">Autoridad</th>
				<th className="px-4 py-2 text-left border-b border-gray-300">No. Folio</th>
				<th className="px-4 py-2 text-left border-b border-gray-300">Responsable</th>
				<th className="px-4 py-2 text-left border-b border-gray-300"></th>
			</tr>
			</thead>
			<tbody>
			{accionesTomadas.map((item, index) => (
				<tr key={index} className="border-t border-gray-200">
				<td className="px-4 py-2">{item.acciones_tomadas}</td>
				<td className="px-4 py-2">{item.llamo_a_policia}</td>
				<td className="px-4 py-2">{item.autoridad}</td>
				<td className="px-4 py-2">{item.numero_folio_referencia}</td>
				<td className="px-4 py-2">{item.responsable}</td>
				<td className="px-4 py-2">
					<div className="flex items-center justify-center gap-2">
					<div
						title="Editar"
						className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
						onClick={() => handleEditAccionesTomadas(item, index)}
					>
						<Edit />
					</div>
					<div
						title="Borrar"
						className="hover:cursor-pointer text-red-500 hover:text-red-600"
						onClick={() => handleDeleteAccionesTomadas(index)}
					>
						<Trash2 />
					</div>
					</div>
				</td>
				</tr>
			))}
			</tbody>
		</table>
		) : (
		<div className="mt-3">
			<div className="text-center text-gray-500 mb-4">No hay acciones tomadas.</div>
		</div>
		)}

    </div>
  );
};

export default SeccionAccionesTomadas;