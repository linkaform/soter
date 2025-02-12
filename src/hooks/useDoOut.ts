import { doOut } from "@/lib/do-out";
import { useQuery } from "@tanstack/react-query";

export const useDoOut = ( qr_code:string, location:string, area:string) => {
  const { data: data, isLoading, error, isFetching, refetch} = useQuery<any>({
    queryKey: ["doOut", location, area, qr_code], 
    enabled:false,
    queryFn: async () => {
        const data = await doOut(qr_code, location, area); 
        return data; 
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
