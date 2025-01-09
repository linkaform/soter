/* eslint-disable @typescript-eslint/no-explicit-any */
import { getShift } from "@/lib/get-shift";
import { useQuery } from "@tanstack/react-query";


export const useGetShift = () => {
  
  
  
  const area = "Caseta Principal"; 
  const location = "Planta Monterrey"; 

  const { data: shift, isLoading, error, isFetching } = useQuery<any>({
    queryKey: ["getShift", area, location], 
    queryFn: async () => {
        const data = await getShift({ area, location }); 
        return data.response?.data; 
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    shift,
    isLoading,
    error,
    isFetching
  };
};
