import { getStats } from "@/lib/get-stats";
import { crearIncidencia, deleteIncidencias, editarIncidencia, getCatIncidencias, getListIncidencias, InputIncidencia } from "@/lib/incidencias";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInciencias = (location:string, area:string, prioridades:string[], enabled:boolean, enabledIncidencias:boolean, dateFrom:string, dateTo:string, filterDate:string) => {
    const queryClient = useQueryClient();
    
    const { isLoading: loading, setLoading} = useShiftStore();
    //Obtener lista de Incidencias
    const {data: listIncidencias, isLoading:isLoadingListIncidencias, error:errorListIncidencias, refetch:refetchTableIncidencias } = useQuery<any>({
        queryKey: ["getListIncidencias",location, area, prioridades, dateFrom, dateTo, filterDate],
        enabled: enabled,
        queryFn: async () => {
            const data = await getListIncidencias(location, area, prioridades, dateFrom, dateTo, filterDate);
            return Array.isArray( data.response?.data) ?  data.response?.data: []; 
        },
        refetchOnWindowFocus: true,
        refetchInterval: 15000,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
    });

    //Obtener Catalogo de Incidencias
    const {data: catIncidencias, isLoading:isLoadingCatIncidencias, error:errorCatIncidencias} = useQuery<any>({
      queryKey: ["getCatIncidencias"],
      enabled:enabledIncidencias,
      queryFn: async () => {
          const data = await getCatIncidencias();
          return Array.isArray(data.response?.data) ? data.response?.data: []; 
      },
      refetchOnWindowFocus: true,
      refetchInterval: 15000,
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5,
    });

    //Crear Incidencia
    const createIncidenciaMutation = useMutation({
        mutationFn: async ({ data_incidencia} : { data_incidencia: InputIncidencia }) => {
            const response = await crearIncidencia(data_incidencia);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear incidencia, Error: ${textMsj?.text}`);
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

            if(hasError == 400 || hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar incidencia, Error: ${textMsj?.text}`);
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

      //Eliminar Incidencia
    const eliminarIncidenciaMutation = useMutation({
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
        queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
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

    const { data: stats, isLoading: isStatsLoading, error: statsError,
	} = useQuery<any>({
	queryKey: ["getStatsIncidencias", area, location],
	enabled:enabled,
	queryFn: async () => {
		const data = await getStats( area, location, "Incidencias" );
		const responseData = data.response?.data || {};
		return responseData;
	},
	refetchOnWindowFocus: true,
	refetchInterval: 60000,
	refetchOnReconnect: true,
	staleTime: 1000 * 60 * 5,
	});

  return {
    //Obtener Incidencias
    listIncidencias,
    isLoadingListIncidencias,
    loading,
    setLoading,
    errorListIncidencias,
    refetchTableIncidencias,
    catIncidencias,
    isLoadingCatIncidencias,
    errorCatIncidencias,
    //Crear Incidencia
    createIncidenciaMutation,
    //EditarIncidencia
    editarIncidenciaMutation,
    //Eliminar Incidencia
    eliminarIncidenciaMutation,
    //Stats Incidencias
    stats, 
    isStatsLoading,
    statsError
};
};
