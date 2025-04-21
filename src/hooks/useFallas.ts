import { crearFalla, crearSeguimientoFalla, deleteFalla, InputFalla, inputSeguimientoFalla, updateFalla } from "@/lib/fallas";
import { getListFallas } from "@/lib/get-list-fallas";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFallas = (location:string, area:string,status:string, enableList:boolean, dateFrom:string, dateTo:string, filterDate:string) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de Fallas
    const {data: listFallas, isLoading:isLoadingListFallas, error:errorListFallas } = useQuery<any>({
        queryKey: ["getListFallas", area, location, status],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListFallas(location, area, status, dateFrom, dateTo, filterDate);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener catalogo de locations, Error: ${data.error}`);
            }else {
              return data.response?.data||[];
            }
        },
        refetchOnWindowFocus: true,
        refetchInterval: 15000,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
    });

     //Crear Falla
     const createFallaMutation = useMutation({
        mutationFn: async ({ data_failure} : { data_failure: InputFalla }) => {
            const response = await crearFalla(data_failure);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear falla, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListFallas"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsFallas"] });
          toast.success("Falla creada correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear falla:", err);
          toast.error(err.message || "Hubo un error al crear la falla.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Editar Falla
     const editarFallaMutation = useMutation({
        mutationFn: async ({ data_failure_update, folio} : { data_failure_update: InputFalla, folio:string }) => {
            const response = await updateFalla(data_failure_update, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar falla, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListFallas"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsFallas"] });
          toast.success("Falla creada correctamente.");
        },
        onError: (err) => {
          console.error("Error al editar falla:", err);
          toast.error(err.message || "Hubo un error al editar la falla.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Eliminar Falla
     const eliminarFallaMutation = useMutation({
        mutationFn: async ({folio} : {folio:string[] }) => {
            const response = await deleteFalla(folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al eliminar falla, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListFallas"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsFallas"] });
          toast.success("Falla eliminada correctamente.");
        },
        onError: (err) => {
          console.error("Error al eliminar falla:", err);
          toast.error(err.message || "Hubo un error al eliminar la falla.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

       //Crear Seguimiento
     const seguimientoFallaMutation = useMutation({
        mutationFn: async ({falla_grupo_seguimiento, folio} : {falla_grupo_seguimiento:inputSeguimientoFalla, folio:string, location:string, area:string, status:string }) => {
            const response = await crearSeguimientoFalla(falla_grupo_seguimiento, folio, location, area, status);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear seguimiento, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListFallas"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsFallas"] });
          toast.success("Seguimiento creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear seguimiento:", err);
          toast.error(err.message || "Hubo un error al crear el seguimiento.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

    return{
        //Lista de Fallas
        listFallas,
        isLoadingListFallas,
        errorListFallas,
        //Crear Falla
        createFallaMutation,
        isLoading,
        //Editar Falla
        editarFallaMutation,
        //Eliminar Falla
        eliminarFallaMutation,
        //Crear seguimiento
        seguimientoFallaMutation
    }
}