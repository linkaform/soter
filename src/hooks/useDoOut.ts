import { doOut } from "@/lib/bitacoras";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDoOut = ( qr_code:string, location:string, area:string) => {
  const queryClient = useQueryClient();
  const {isLoading, setLoading} = useShiftStore();
  
  const { data: data, error, isFetching, refetch} = useQuery<any>({
    queryKey: ["doOut", location, area, qr_code], 
    enabled:false,
    queryFn: async () => {
        const data = await doOut(qr_code, location, area); 
        return data; 
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

     //Crear Devolucion de Paquetes
    const doOutMutation = useMutation({
      mutationFn: async ({qr_code, location, area} : {qr_code: string, location:string, area:string}) => {
          const response = await doOut(qr_code, location , area);
          const hasError= response.error? response.error.status : undefined
          if(hasError == 400 || hasError == 401){
              const textMsj =response.error.msg.msg //errorMsj(response.response.data) 
              throw new Error(`Error al realizar la salida, Error: ${textMsj}`);
          }else{
              return response.response?.data
          }
      },
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getListBitacora"] });
        queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
        toast.success("Salida registrada correctamente.");
      },
      onError: (err) => {
        // console.error("Error al realizar la salida:", err);
        toast.error(err.message || "Hubo un error al realizar la salida.");
  
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
    doOutMutation
  };
};
