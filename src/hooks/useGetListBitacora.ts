/* eslint-disable @typescript-eslint/no-explicit-any */
import { getListBitacora } from "@/lib/get-list-bitacoras";
import { useQuery } from "@tanstack/react-query";

export const useGetListBitacora = (location:string, area:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListBitacora", location, area], 
    enabled:false,
    queryFn: async () => {
        const data = await getListBitacora(location, area ); 
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
