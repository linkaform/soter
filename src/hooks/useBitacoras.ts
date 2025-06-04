import { Bitacora_record } from "@/components/table/bitacoras/bitacoras-columns";
import { getListBitacora } from "@/lib/bitacoras";
import { crearFalla, InputFalla } from "@/lib/fallas";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useBitacoras = (location:string, area:string,prioridades:string[], enableList:boolean, date1:string, date2:string, dateFilter:string) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de Bitacoras
    const {data: listBitacoras, isLoading:isLoadingListBitacoras, error:errorListBitacoras } = useQuery<Bitacora_record[]>({
        queryKey: ["getListBitacoras", area, location, prioridades, date1, date2, dateFilter],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListBitacora(location, area, prioridades, date1, date2, dateFilter);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de bitacoras, Error: ${data.error}`);
            }else {
              	return Array.isArray(data?.response?.data) ? data?.response?.data : [];
            }
        },
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
                return response.response?.data ?? []
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListBitacoras"] });
          queryClient.invalidateQueries({ queryKey: ["getStats"] });
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

    return{
        //Lista de Bitacoras
        listBitacoras,
        isLoadingListBitacoras,
        errorListBitacoras,
        //Salida
        doOutMutation,
        isLoading,
      
    }
}