/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useState } from "react";
import { PersonasInvolucradas } from "@/lib/incidencias";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PersonasInvolucradasModal } from "./modals/add-personas-involucradas";

interface PersonasInvolucradasListProps {
    personasInvolucradas: PersonasInvolucradas[];
    setPersonasInvolucradas: Dispatch<SetStateAction<PersonasInvolucradas[]>>
}

const SeccionPersonasInvolucradas:React.FC<PersonasInvolucradasListProps> = ({ personasInvolucradas, setPersonasInvolucradas})=> {
	const [openPersonasInvolucradasModal, setOpenPersonasInvolucradasModal] = useState(false);
	const [personasInvolucradasSeleccion, setPersonasInvolucradasSeleccion] = useState([]);
	const [editarPersonasInvolucradas, setEditarPersonasInvolucradas] = useState(false)
	const [indiceSeleccionado, setIndiceSeleccionado]= useState<number | null>(null)


	const handleEditPersonasInvolucradas = (item: any, index: number) => {
		console.log(item, index)
		setPersonasInvolucradasSeleccion(item);
		setIndiceSeleccionado(index);
		setEditarPersonasInvolucradas(true)
		setOpenPersonasInvolucradasModal(true); 
	};
	
	const handleDeletePersonasInvolucradas  = (index: number) => {
		const nuevaspersonasInvolucradas = [...personasInvolucradas];
		nuevaspersonasInvolucradas.splice(index, 1);
		setPersonasInvolucradas(nuevaspersonasInvolucradas);
		toast.success("Seguimiento eliminado correctamente.")
	  };

    return (
    <div >
		<div className="mt-3 flex justify-between">
			<div className="text-lg font-bold">Personas involucradas</div>
			<div className="cursor-pointer  bg-blue-500 hover:bg-blue-600 text-white mr-5 rounded-md p-2 px-4 text-center text-sm" onClick={()=>{setOpenPersonasInvolucradasModal(!openPersonasInvolucradasModal);
				setEditarPersonasInvolucradas(false)
			}}>
				Agregar 
			</div>
		</div>

		<PersonasInvolucradasModal
			title="Personas Involucradas"
			isSuccess={openPersonasInvolucradasModal}
			setIsSuccess={setOpenPersonasInvolucradasModal}
			personasInvolucradasSeleccion={personasInvolucradasSeleccion}
			setPersonasInvolucradas={setPersonasInvolucradas}
			setEditarPersonasInvolucradas={setEditarPersonasInvolucradas}
			editarPersonasInvolucradas={editarPersonasInvolucradas}
			indice={indiceSeleccionado}
			setPersonasInvolucradasSeleccion={setPersonasInvolucradasSeleccion}
			>
			<div></div>
		</PersonasInvolucradasModal>
			
			
			<table className="min-w-full table-auto mb-5 border">
				<thead>
				<tr className="bg-gray-100">
					<th className="px-4 py-2 text-left border-b border-gray-300">Nombre completo</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Rol</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Sexo</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Grupo Etario</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Atención Médica</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Retenido</th>
					<th className="px-4 py-2 text-left border-b border-gray-300">Comentarios / Observaciones</th>
					<th className="px-4 py-2 text-left border-b border-gray-300"></th>
				</tr>
				</thead>
				<tbody>
					{personasInvolucradas && personasInvolucradas.length > 0 ? (
						personasInvolucradas.map((item, index) => (
						<tr key={index} className="border-t border-gray-200">
							<td className="px-4 py-2">{item.nombre_completo}</td>
							<td className="px-4 py-2">{item.rol}</td>
							<td className="px-4 py-2">{item.sexo}</td>
							<td className="px-4 py-2">{item.grupo_etario}</td>
							<td className="px-4 py-2">{item.atencion_medica}</td>
							<td className="px-4 py-2">{item.retenido}</td>
							<td className="px-4 py-2 capitalize">{item.comentarios || "N/A"}</td>
							<td className="px-4 py-2">
							<div className="flex items-center justify-center gap-2">
								<div
								title="Editar"
								className="hover:cursor-pointer text-blue-500 hover:text-blue-600"
								onClick={() => handleEditPersonasInvolucradas(item, index)}
								>
								<Edit />
								</div>
								<div
								title="Borrar"
								className="hover:cursor-pointer text-red-500 hover:text-red-600"
								onClick={() => handleDeletePersonasInvolucradas(index)}
								>
								<Trash2 />
								</div>
							</div>
							</td>
						</tr>
						))
					) : (
						<tr>
						<td colSpan={8} className="text-center text-gray-500 py-4">
							No hay personas involucradas.
						</td>
						</tr>
					)}
					</tbody>
			</table>
			

		</div>
	);
};

export default SeccionPersonasInvolucradas;