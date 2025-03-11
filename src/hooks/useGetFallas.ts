import { getListFallas } from "@/lib/get-list-fallas";
import { useQuery } from "@tanstack/react-query";

export const useGetFallas= (location:string, area:string, status:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListFallas", location, area, status], 
    queryFn: async () => {
        const data = await getListFallas(location, area , status); 
        return data.response?.data||[]; 
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
