/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeShift } from "@/lib/close-shift";
import { getShift } from "@/lib/get-shift";
import { startShift } from "@/lib/start-shift";
import useAuthStore from "@/store/useAuthStore";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetShift = () => {


  const queryClient = useQueryClient();



  const { area, 
    location,
     setLoading, 
     isLoading: loading,
      setCheckin_id, 
      checkin_id, 
     } = useShiftStore();
  




     const { user } = useAuthStore();

     const {
       data: shift,
       isLoading,
       error,
       isFetching,
     } = useQuery<any>({
       queryKey: ["getShift", area, location],
       queryFn: async () => {
         const data = await getShift({ area, location });
     
         // Aplicar el filtro directamente a support_guards
         const filteredGuards = data.response?.data?.support_guards?.filter((guard: any) => {
           return guard.name !== user?.name; // Excluir al usuario actual
         });
     
         // Devolver los datos con los guardias filtrados
         return {
           ...data.response?.data,
           support_guards: filteredGuards,
         };
       },
       refetchOnWindowFocus: true,
       refetchInterval: 60000,
       refetchOnReconnect: true,
       staleTime: 1000 * 60 * 5,
     });


  

 const startShiftMutation = useMutation({
  mutationFn: async () => {
    const response = await startShift({ area, location });
    return response; 
  }, 

  onMutate: () => {
    setLoading(true); 
  },
  onSuccess: (response: any) => {


    const checkin_id = response?.response?.data?.json?.id; 
    if (checkin_id) {
      setCheckin_id(checkin_id); 

    }

      queryClient.invalidateQueries({ queryKey: ["getShift"] }); 
   },
  onError: (err) => {
    console.error("Error al iniciar turno:", err);
  },
  onSettled: () => {
    setLoading(false);
  },
});

  const closeShiftMutation = useMutation({
    mutationFn: () => closeShift({ area, location, checkin_id }),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {

    queryClient.invalidateQueries({ queryKey: ["getShift"] }); 
  },
    onError: (err) => {
      console.error("Error al cerrar turno:", err);
    },
    onSettled: () => {
      setLoading(false);
    },
  });


  return {
    shift,
    isLoading,
    loading,
    error,
    isFetching,
    startShiftMutation,
    closeShiftMutation,
  };
};
