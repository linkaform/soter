import { getListBitacora } from "@/lib/bitacoras";
import { useQuery } from "@tanstack/react-query";

export const useGetListBitacora = (location:string, area:string, prioridades:string[], enabled:boolean, date1:string, date2:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListBitacora", location, area, prioridades, date1,date2], 
    enabled:enabled,
    queryFn: async () => {
        const data = await getListBitacora(location, area, prioridades, date1,date2); 
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
