import { asignarGafete, dataGafetParamas, getListBitacora } from "@/lib/bitacoras";
import { crearFalla, crearSeguimientoFalla, deleteFalla, InputFalla, inputSeguimientoFalla, updateFalla } from "@/lib/fallas";
import { getStats } from "@/lib/get-stats";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBitacoras = (location:string, area:string,prioridades:string[], enableList:boolean) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de Bitacoras
    const {data: listBitacoras, isLoading:isLoadingListBitacoras, error:errorListBitacoras } = useQuery<any>({
        queryKey: ["getListBitacoras", area, location, prioridades],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListBitacora(location, area, prioridades);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de bitacoras, Error: ${data.error}`);
            }else {
              return data.response?.data||[];
            }
        },
        refetchOnWindowFocus: true,
        refetchInterval: 15000,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
    });

     //Salida
     const doOutMutation = useMutation({
        mutationFn: async ({ data_failure} : { data_failure: InputFalla }) => {
            const response = await crearFalla(data_failure);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al realizar la salida, Error: ${textMsj?.text}`);
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
          toast.error(err.message || "Hubo un error al realizar la salida.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Asignar Gafete
     const asignarGafeteMutation = useMutation({
        mutationFn: async ({ data_gafete, id_bitacora,tipo_movimiento } : { data_gafete: dataGafetParamas, id_bitacora:string, tipo_movimiento:string }) => {
            const response = await asignarGafete(data_gafete, id_bitacora, tipo_movimiento);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al asignar gafete, Error: ${textMsj?.text}`);
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
          toast.success("Gafete asignado correctamente.");
        },
        onError: (err) => {
          console.error("Error al asignar gafete:", err);
          toast.error(err.message || "Hubo un error al asignar gafete.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

    const { data: stats, isLoading: isStatsLoading, error: statsError,
        } = useQuery<any>({
        queryKey: ["getStatsBitacoras", area, location],
        enabled:enableList,
        queryFn: async () => {
            const data = await getStats( area, location, "Bitacoras" );
            const responseData = data.response?.data || {};
            return responseData;
        },
        refetchOnWindowFocus: true,
        refetchInterval: 60000,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
    });

    return{
        //Lista de Bitacoras
        listBitacoras,
        isLoadingListBitacoras,
        errorListBitacoras,
        //Salida
        doOutMutation,
        isLoading,
        //Asignar Gafete
        asignarGafeteMutation,
        //Stats bitacoras
        stats,
        isStatsLoading,
        statsError
    }
}