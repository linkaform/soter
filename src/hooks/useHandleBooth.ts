/* eslint-disable @typescript-eslint/no-explicit-any */
import { changeBooth } from "@/lib/change-booth";
import { getBooths } from "@/lib/get-booths";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useHandleBooth = () => {
  
    const { setArea, setLocation, setLoading } = useShiftStore();





    const { data: booths, isLoading, error, isFetching } = useQuery<any[]>({
      queryKey: ["getBooths"], 
      queryFn: async () => {
        const data = await getBooths()
        return data.response?.data; 
      },
      refetchOnWindowFocus: false, 
      refetchInterval: 60000,
      refetchOnReconnect: true, 
      staleTime: 1000 * 60 * 5, 
    });




    const changeBoothMutation = useMutation({
      mutationFn: ({ area, location }: { area: string; location: string }) =>
        changeBooth({ area, location }),
      onMutate: () => {
        setLoading(true); // Activar loading global
      },
      onSuccess: (response, variables) => {
        if (response.success) {
          setArea(variables.area); 
          setLocation(variables.location); 
        }
        
      },
      onError: (error) => {
        console.error("Error al cambiar la caseta:", error);
      },
      onSettled: () => {
        setLoading(false); 
      },
    });
  
  
 
  
  
  return {
    /* Obtener Caseta */
    booths,
    isLoading,
    error,
    isFetching,

   /* Cambiar Caseta */
   changeBoothMutation
  };
};
