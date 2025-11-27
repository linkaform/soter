"use client";

import { Pencil, Trash } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { NombreSuplenteModal } from "./modals/nombre-suplente";
import { EliminarSuplenteModal } from "./modals/eliminar-suplente";
import { useUpdateSuplenteTurnos } from "@/hooks/Rondines/useUpdateSuplente";

interface SuplenteItemProps {
  nombreSuplente: string;
  setNombreSuplente: Dispatch<SetStateAction<string>>
}

export const SuplenteItem: React.FC<SuplenteItemProps> = ({
  nombreSuplente,
  setNombreSuplente,
}) => {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const {updateSuplenteMutation, isLoading} = useUpdateSuplenteTurnos();
  return (
    <div className="bg-[#F7F9FC] rounded-md p-3 mt-3">
      <p className="text-xs text-gray-500">Suplente</p>

      <div className="flex justify-between items-center mt-1">
        <p className="font-semibold">{nombreSuplente}</p>

        <div className="flex gap-3">
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setOpenEditModal(true)}
          >
            <Pencil size={18} />
          </button>

          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => setOpenDeleteModal(true)}
          >
            <Trash size={18} />
          </button>
        </div>
      </div>

      <NombreSuplenteModal
        title="Editar Suplente"
        nombreSuplente={nombreSuplente}
        setNombreSuplente={setNombreSuplente}
        onSuplenteConfirmado={() => setOpenEditModal(false)}
        open={openEditModal}
        setOpen={setOpenEditModal}
        mode={"edit"}
      />

      <EliminarSuplenteModal
              open={openDeleteModal}
              setOpen={setOpenDeleteModal}
              onDelete={() => {
                updateSuplenteMutation.mutate({ nombre_suplente:nombreSuplente },{
                    onSuccess: () => {
                        setOpenDeleteModal(false)
                    }
					})
				}}
			isLoading={isLoading}
			title={"Eliminar Suplente"}/>
    </div>
  );
};
