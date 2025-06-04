import { asignarGafete, dataGafetParamas } from "@/lib/bitacoras";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useAsignarGafete = () => {
	const [isLoading, setIsLoading] = useState(false)
	const queryClient = useQueryClient();

	const asignarGafeteMutation = useMutation({
	mutationFn: async ({ data_gafete, id_bitacora,tipo_movimiento } : { data_gafete: dataGafetParamas, id_bitacora:string, tipo_movimiento:string }) => {
		const response = await asignarGafete(data_gafete, id_bitacora, tipo_movimiento);
		if(!response.success){
			throw new Error(`Error al actualizar gafete, Error: ${response?.exception.error.msg[0]}`);
		}else{
			return response.response?.data
		}
	},
	onMutate: () => {
		setIsLoading(true);
	},
	onSuccess: () => {
		queryClient.invalidateQueries({ queryKey: ["getListBitacoras"] });
		queryClient.invalidateQueries({ queryKey: ["getStats"] });
		toast.success("Gafete actualizado correctamente.");
	},
	onError: (err) => {
		toast.error(err.message || "Hubo un error al asignar gafete.");

	},
	onSettled: () => {
		setIsLoading(false);
	},
	});

  return {
    isLoading,
	asignarGafeteMutation
  };
};
