import { getStats } from "@/lib/get-stats";
import { crearPaqueteria, editarPaqueteria, getListPaqueteria, InputPaqueteria, InputPaqueteriaDevolver } from "@/lib/paqueteria";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePaqueteria = (location:string, area:string, status:string, enableList:boolean, date1:string, date2:string, filterDate:string) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de Paquetes
    const {data: listPaqueteria ,isLoading:isLoadingListPaqueteria , error:errorListPaqueteria } = useQuery<any>({
        queryKey: ["getListPaqueteria", location, area , status, date1, date2, filterDate],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListPaqueteria(location, status, area, date1, date2, filterDate);
            const textMsj = errorMsj(data) 
            if (textMsj){
              toast.error(`Error al obtener lista de paquetes, Error: ${data.error}`);
              return []
            }else {
              return data ? data?.response?.data : [];
            }
        },
    });

     //Crear Paquetes
     const createPaqueteriaMutation = useMutation({
        mutationFn: async ({ data_paquete} : { data_paquete: InputPaqueteria }) => {
            const response = await crearPaqueteria(data_paquete);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear paqueteria, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListPaqueteria"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Paqueteria creado creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear paqueteria:", err);
          toast.error(err.message || "Hubo un error al crear paqueteria.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Editar Paquetes
     const editarPaqueteriaMutation = useMutation({
        mutationFn: async ({ data_paquete_actualizar, folio} : { data_paquete_actualizar: InputPaqueteria, folio:string }) => {
            const response = await editarPaqueteria(data_paquete_actualizar, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar paqueteria, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListPaqueteria"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Paqueteria editada correctamente.");
        },
        onError: (err) => {
          console.error("Error al editar el artículo perdido:", err);
          toast.error(err.message || "Hubo un error al editar el artículo perdido.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

       //Crear Devolucion de Paquetes
     const devolverPaqueteriaMutation = useMutation({
        mutationFn: async ({data_paquete_actualizar, folio} : {data_paquete_actualizar: InputPaqueteriaDevolver, folio:string}) => {
            const response = await editarPaqueteria(data_paquete_actualizar, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al devolver artículo, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListPaqueteria"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          queryClient.invalidateQueries({ queryKey: ["getStats"] });
          toast.success("Devolución registrada correctamente.");
        },
        onError: (err) => {
          console.error("Error al realizar la devolución:", err);
          toast.error(err.message || "Hubo un error al realizar la devolución.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      const { data: stats, isLoading: isStatsLoading, error: statsError,
      } = useQuery<any>({
        queryKey: ["getStatsArticulos", area, location],
        enabled:enableList,
        queryFn: async () => {
            const data = await getStats( area, location, "Articulos" );
            const responseData = data.response?.data || {};
            return responseData;
        },
      });

    return{
        //Lista de Paquetes
        listPaqueteria,
        isLoadingListPaqueteria,
        errorListPaqueteria,
        //Crear Paquetes
        createPaqueteriaMutation,
        isLoading,
        //Editar Paquetes
        editarPaqueteriaMutation,
        //Eliminar Paquetes
        devolverPaqueteriaMutation,
        //Stats Paquetes
        stats,
        isStatsLoading,
        statsError
    }
}