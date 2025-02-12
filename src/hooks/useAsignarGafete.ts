import { asignarGafete, dataGafetParamas } from "@/lib/asignar-gafete";
import { useQuery } from "@tanstack/react-query";

export const useAsignarGafete = (data_gafete:dataGafetParamas |null, id_bitacora:string | null, tipo_movimiento:string| null) => {
  const { data: data, isLoading, error, isFetching, refetch} = useQuery<any>({
    queryKey: ["asignarGafete"], 
    enabled:false,
    queryFn: async () => {
        const data = await asignarGafete(data_gafete, id_bitacora, tipo_movimiento); 
        return data; 
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch
  };
};
