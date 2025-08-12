import { getStats } from "@/lib/get-stats";
import { crearIncidencia, editarIncidencia, getListIncidencias, InputIncidencia } from "@/lib/incidencias";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInciencias = (location:string, area:string, prioridades:string[], dateFrom:string, dateTo:string, filterDate:string) => {
    const queryClient = useQueryClient();
    
    const { isLoading: loading, setLoading} = useShiftStore();
    //Obtener lista de Incidencias
    const {data: listIncidencias, isLoading:isLoadingListIncidencias, error:errorListIncidencias, refetch:refetchTableIncidencias } = useQuery<any>({
        queryKey: ["getListIncidencias",location, area, prioridades, dateFrom, dateTo, filterDate],
        enabled: location!=="",
        queryFn: async () => {
            const data = await getListIncidencias(location, area, prioridades, dateFrom, dateTo, filterDate);
            return Array.isArray( data.response?.data) ?  data.response?.data: []; 
        },
    });

    //Crear Incidencia
    const createIncidenciaMutation = useMutation({
        mutationFn: async ({ data_incidencia} : { data_incidencia: InputIncidencia }) => {
            const response = await crearIncidencia(data_incidencia);
            if(response.success === false){
                // const textMsj = errorMsj(response.error)
                throw new Error(`Error al crear incidencia, Error: ${response.error}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
          toast.success("Incidencia creada correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear incidencia:", err);
          toast.error(err.message || "Hubo un error al crear la incidencia.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Editar Incidencia
    const editarIncidenciaMutation = useMutation({
        mutationFn: async ({ data_incidencia, folio }: { data_incidencia: InputIncidencia, folio: string }) => {
            const response = await editarIncidencia(data_incidencia, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400 || hasError == 401|| hasError == 500){
                throw new Error(`Error al editar incidencia, Error: ${response?.response.data.json.error}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
          toast.success("Incidencia editada correctamente.");
        },
        onError: (err) => {
          console.error("Error al editar incidencia:", err);
          toast.error(err.message || "Hubo un error al editar la incidencia.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });



    const { data: stats, isLoading: isStatsLoading, error: statsError,
    } = useQuery<any>({
    queryKey: ["getStatsIncidencias", area, location],
    enabled:location!=="",
    queryFn: async () => {
      const data = await getStats( location, area, "Incidencias" );
      const responseData = data.response?.data || {};
      return responseData;
    },
	});

  return {
    //Obtener Incidencias
    listIncidencias,
    isLoadingListIncidencias,
    loading,
    setLoading,
    errorListIncidencias,
    refetchTableIncidencias,
    //Crear Incidencia
    createIncidenciaMutation,
    //EditarIncidencia
    editarIncidenciaMutation,
    //Stats Incidencias
    stats, 
    isStatsLoading,
    statsError
};
};
