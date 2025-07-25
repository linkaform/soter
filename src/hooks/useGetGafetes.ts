import { getGafetes } from "@/lib/get-gafetes";
import { useQuery } from "@tanstack/react-query";

export const useGetGafetes = (location:string, area:string, status:string, enable:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getGafetes", location, area, status], 
    enabled:enable,
    queryFn: async () => {
        const data = await getGafetes(location, area , status); 
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
