/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLocations } from "@/lib/get-locations";
import { useQuery } from "@tanstack/react-query";


export const useGetLocations = () => {
  
  

  const { data: locations, isLoading, error, isFetching } = useQuery<any[]>({
    queryKey: ["getLocations"], 
    queryFn: async () => {
      const data = await getLocations()
      return data.response?.data; 
    },
    retry: 3, 
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    locations,
    isLoading,
    error,
    isFetching
  };
};
