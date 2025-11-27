import { crearIncidenciaRondin, getListIncidenciasRondin } from "@/lib/create-incidencia-rondin";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useIncidenciaRondin = (location:string, area:string) => {

    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();
        
    const {data: listIncidenciasRondin, isLoading:isLoadingListIncidencias} = useQuery<any>({
        queryKey: ["getListIncidenciasRondin",location, area],
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const data = await getListIncidenciasRondin(location, area);
            return data?.response?.data; 
        },
    });
   
      const playOrPauseRondinMutation =useMutation({
        mutationFn: async (rondin_data: any) => {
              const response = await crearIncidenciaRondin(rondin_data);
  
              if(response.response.data.status =="error"){
                  throw new Error(`Error al crear iniciar/pausar rondin, Error: ${response.response.data.message }`);
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
            toast.success("Acción realizada correctamente.");
          },
          onError: (err) => {
            console.error("Error al crear incidencia rondin", err);
            toast.error(err.message || "Hubo un error al iniciar/pausar rondin.");
      
          },
          onSettled: () => {
            setLoading(false);
          },
        });

        

    return{
        playOrPauseRondinMutation,
        isLoading,
        isLoadingListIncidencias,
        listIncidenciasRondin
    }
}