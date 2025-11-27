import { updateSuplente } from "@/lib/start-shift";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateSuplenteTurnos = () => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();
		const updateSuplenteMutation = useMutation({
			mutationFn: async ({ nombre_suplente} : { nombre_suplente: string }) => {
				const response = await updateSuplente(nombre_suplente);
                const hasError = (!response?.success) || (response?.response?.data?.status_code === 400 )
                if (hasError) {
                    const textMsj = errorMsj(response)
                    throw new Error(`Error al crear seguimiento, Error: ${textMsj?.text}`);
                } else {
                    return response.response?.data
                }
			},
			onMutate: () => {
			    setLoading(true);
			},
			onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getListRondines"] });
                queryClient.invalidateQueries({ queryKey: ["getStatsRondines"] });
                toast.success("Nombre de suplente actualizado correctamente.");
			},
			onError: (err) => {
                console.error("Error al actualizar nombre de suplente", err);
                toast.error(err.message || "Hubo un error al actualizar nombre de suplente");
		
			},
			onSettled: () => {
			    setLoading(false);
			},
		});
    return{
        updateSuplenteMutation,
        isLoading,
    }
}