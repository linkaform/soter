import { getListIncidencias } from "@/lib/get-list-incidencias";
import { useQuery } from "@tanstack/react-query";

export const useGetIncidencias = (location:string, area:string, prioridades:string[]) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListIncidencias", location, area, prioridades], 
    queryFn: async () => {
        const data = await getListIncidencias(location, area , prioridades); 
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
