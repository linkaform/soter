/* eslint-disable @typescript-eslint/no-explicit-any */
import { getEntryPasses } from "@/lib/get-entry-passes";
import { useQuery } from "@tanstack/react-query";


export const useGetEntryPasses = () => {
  
  
  
  const area = "Caseta Principal"; 
  const location = "Planta Monterrey"; 

  const { data: passes, isLoading, error, isFetching } = useQuery<any[]>({
    queryKey: ["getPasses", area, location], 
    queryFn: async () => {
      const data = await getEntryPasses()
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
    passes,
    isLoading,
    error,
    isFetching
  };
};
