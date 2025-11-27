import { crearIncidenciaRondin } from "@/lib/create-incidencia-rondin";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateIncidenciaRondin = () => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();
        const createIncidenciaMutation =useMutation({
            mutationFn: async (rondin_data: any) => {
                const response = await crearIncidenciaRondin(rondin_data);
        
                if(response.response.data.status =="error"){
                    throw new Error(`Error al crear rondin Error: ${response.response.data.message }`);
                }else{
                    return response.response?.data
                }
            },
            onMutate: () => {
                setLoading(true);
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["getListRondines"] });
                queryClient.invalidateQueries({ queryKey: ["getStatsRondines"] });
                toast.success("Incidencia creada correctamente.");
            },
            onError: (err) => {
                console.error("Error al crear incidencia rondin", err);
                toast.error(err.message || "Hubo un error al crear incidencia");
        
            },
            onSettled: () => {
                setLoading(false);
            },
            });
    
    return{
        createIncidenciaMutation,
        isLoading,
    }
}


