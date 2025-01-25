/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogoPasesArea } from "@/lib/get-catalogos-pase-area";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoPaseArea = (location:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogoPaseArea", location], 
    queryFn: async () => {
        const data = await getCatalogoPasesArea({ location }); 
        return data.response?.data.areas_by_location; 
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
