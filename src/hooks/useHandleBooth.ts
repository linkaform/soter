/* eslint-disable @typescript-eslint/no-explicit-any */
import { changeBooth } from "@/lib/change-booth";
import { getBooths } from "@/lib/get-booths";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner"; // Importar Sonner



export const useHandleBooth = (enableGetBooths:boolean) => {
  
    const { setArea, setLocation, setLoading } = useShiftStore();

    const { data: booths, isLoading, error, isFetching } = useQuery<any[]>({
      queryKey: ["getBooths"], 
      enabled:enableGetBooths,
      queryFn: async () => {
        const data = await getBooths()
        return data.response?.data || []; 
      },
      // refetchOnWindowFocus: false, 
      // refetchInterval: 600000,
      // refetchOnReconnect: true, 
      // staleTime: 1000 * 60 * 5, 
    });



    const changeBoothMutation = useMutation({
      mutationFn: async ({ area, location }: { area: string; location: string }) => {
        const response = await changeBooth({ area, location });
    
        if (!response.success) {
          throw new Error(
            response.error?.msg?.msg || "Hubo un error al cambiar la caseta"
          );
        }
        return response;
      },
      onMutate: () => {
        setLoading(true); // Activar loading global
      },
      onSuccess: (response, variables) => {       
        // queryClient.invalidateQueries({ queryKey: ["getShift"] });
        if (response.success) {
          setArea(variables.area);
          setLocation(variables.location);
          console.log("location area",variables.area, variables.location)
          toast.success("Caseta cambiada correctamente.");
        }
      },
      onError: (error) => {
        console.error("Error al cambiar la caseta:", error);
    
        // ❌ Notificación de error
        toast.error(error.message || "Hubo un error al cambiar la caseta.");
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