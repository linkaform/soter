import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { useShiftStore } from "@/store/useShiftStore";
import { deleteIncidencias } from "@/lib/incidencias";

export const useEliminarIncidencia = () => {
    const queryClient = useQueryClient();
    const { setLoading } = useShiftStore();
  
    return useMutation({
        mutationFn: async ({ folio }: { folio: string[] }) => {
            const response = await deleteIncidencias(folio);
            const hasError= response.response.data.status_code

            if(hasError == 400 || hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al eliminar incidencia, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
            queryClient.invalidateQueries({ queryKey: ["getStats"] });
            toast.success("Incidencia eliminada correctamente.");
        },
        onError: (err) => {
            console.error("Error al eliminar incidencia:", err);
            toast.error(err.message || "Hubo un error al eliminar la incidencia.");

        },
        onSettled: () => {
            setLoading(false);
        },
    });
}