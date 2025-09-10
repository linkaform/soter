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
            queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
            queryClient.invalidateQueries({ queryKey: ["getStats"] });
            toast.success("Incidencia eliminada correctamente.");
        },
        onError: (err) => {
            toast.error(err.message || "Hubo un error al eliminar la incidencia.",{
                style: {
                    background: "#dc2626",
                    color: "#fff",
                    border: 'none'
                },
            })

        },
        onSettled: () => {
            setLoading(false);
        },
    });
}