import { crearIncidenciaRondin, getListIncidenciasRondin } from "@/lib/create-incidencia-rondin";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIncidenciaRondin = () => {

    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();
        
    const {data: listIncidenciasRondin, isLoading:isLoadingListIncidencias} = useQuery<any>({
        queryKey: ["getListIncidencias",],
        enabled: true,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const data = await getListIncidenciasRondin("Planta Durango", "Planta Durango");
            return Array.isArray( data.response?.data) ?  data.response?.data: []; 
        },
    });


     const createIncidenciaMutation = useMutation({
        mutationFn: async ({ data_incidencia} : { data_incidencia:any }) => {
            const response = await crearIncidenciaRondin(data_incidencia);

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
        isLoadingListIncidencias,
        listIncidenciasRondin
    }
}