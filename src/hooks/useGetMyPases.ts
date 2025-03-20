/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyPases } from "@/lib/get-my-pases";
import { useQuery } from "@tanstack/react-query";

export const useGetMyPases = () => {
  
  const tab = "Todos"; 

  const { data: data, isLoading, error, isFetching } = useQuery<any>({
    queryKey: ["getMyPases", tab], 
    queryFn: async () => {
        const data = await getMyPases({ tab }); 
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
    isFetching
  };
};
