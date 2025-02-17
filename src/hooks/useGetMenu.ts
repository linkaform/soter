/* eslint-disable @typescript-eslint/no-explicit-any */
import { getMenu } from "@/lib/get-menu";
import { useQuery } from "@tanstack/react-query";

export const useGetMenu = () => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getMenu"], 
    queryFn: async () => {
        const data = await getMenu(); 
        if (!data.response || !data.response?.data || !data.response?.data.menus) {
          return ["pases"]
        }
        return data.response?.data.menus||null;
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


