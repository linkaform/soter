import { useMutation, useQueryClient } from "@tanstack/react-query";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { useShiftStore } from "@/store/useShiftStore";
import { crearSeguimientoFalla } from "@/lib/fallas";

export const useSeguimientoFallas = () => {
    const queryClient = useQueryClient();
    const { setLoading } = useShiftStore();
  
    return useMutation({
        mutationFn: async ({ seguimientos_falla, folio, cerrar_falla }: { seguimientos_falla: any, folio: string, cerrar_falla?:string }) => {
            const response = await crearSeguimientoFalla(seguimientos_falla, folio, "", "", cerrar_falla =="si"?"resuelto":"abierto");
            const hasError = response.response.data.status_code
    
            if (hasError == 400 || hasError == 401) {
                const textMsj = errorMsj(response.response.data)
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
            console.error("Error al crear seguimiento:", err);
            toast.error(err.message || "Hubo un error al crear el seguimiento.",{
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
