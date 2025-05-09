/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMyPases } from "@/lib/get-my-pases";
import { useQuery } from "@tanstack/react-query";

export const useGetMyPases = () => {
  
  const tab = "Todos"; 

  const { data: data, isLoading, error, isFetching } = useQuery<any>({
    queryKey: ["getMyPases"], 
    queryFn: async () => {
        const data = await getMyPases({ tab }); 
        return data.response?.data; 
    },
  });

  return {
    data,
    isLoading,
    error,
    isFetching
  };
};
