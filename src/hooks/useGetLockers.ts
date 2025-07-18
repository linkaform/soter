import { getLockers } from "@/lib/get-lockers";
import { useQuery } from "@tanstack/react-query";

export const useGetLockers = (location:string, area:string, status:string, enable:boolean) => {
  const { data: data, isLoading, error, isFetching, refetch} = useQuery<any>({
    queryKey: ["getLockers", location, area, status], 
    enabled:enable,
    queryFn: async () => {
        const data = await getLockers(location, area , status); 
        return data.response?.data ??[]; 
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
