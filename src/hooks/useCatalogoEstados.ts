import { getCatalogoEstados } from "@/lib/get-catalogos-estado";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoEstados = (account_id:number, isModalOpen:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoEstados"], 
    enabled: isModalOpen,
    queryFn: async () => {
        const data = await getCatalogoEstados(account_id); 
        return data.response?.data; 
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
    refetch,
  };
};
