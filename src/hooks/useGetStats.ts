import { getStats } from "@/lib/get-incidencias-stats";
import { useQuery } from "@tanstack/react-query";

export const useGetStats= (area:string, location:string, page:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getStats", area, location, page], 
    queryFn: async () => {
        const data = await getStats(area, location, page); 
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


