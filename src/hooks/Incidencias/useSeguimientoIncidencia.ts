import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { useShiftStore } from "@/store/useShiftStore";
import { crearSeguimientoIncidencia } from "@/lib/incidencias";

export const useSeguimientoIncidencia = () => {
    const queryClient = useQueryClient();
    const { setLoading } = useShiftStore();
  
    return useMutation({
        mutationFn: async ({ seguimientos_incidencia, folio, estatus }: { seguimientos_incidencia: any, folio: string,estatus:string}) => {
            const response = await crearSeguimientoIncidencia(seguimientos_incidencia, folio, estatus);
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
            queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
            toast.success("Seguimiento creado correctamente.");
        },
        onError: (err) => {
            toast.error(err.message || "Hubo un error al crear el seguimiento." ,{
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
