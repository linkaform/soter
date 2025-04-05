import { getListBitacora } from "@/lib/bitacoras";
import { useQuery } from "@tanstack/react-query";

export const useGetListBitacora = (location:string, area:string, prioridades:string[], enabled:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListBitacora", location, area, prioridades], 
    enabled:enabled,
    queryFn: async () => {
        const data = await getListBitacora(location, area, prioridades); 
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
    refetch
  };
};
