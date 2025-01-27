/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkoutSupportGuards } from "@/lib/checkout-support-guards";
import { getSupportGuards } from "@/lib/get-support-guards";
import { updateSupportGuards } from "@/lib/update-support-guard";
import useAuthStore from "@/store/useAuthStore";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useGetSupportGuards = () => {
  
  const queryClient = useQueryClient();

  
  const { area, location, setLoading } = useShiftStore();







  const { user } = useAuthStore();

  const { data: supportGuards, isLoading, error, isFetching } = useQuery<any>({
    queryKey: ["getGuardSupport", area, location],
    queryFn: async () => {
      const response = await getSupportGuards({ area, location });
  
      // Aplicar el filtro directamente
      const filteredGuards = response?.response?.data?.guardia_de_apoyo?.filter((guard: any) => {
        return guard.name !== user?.name; // Excluir al usuario actual
      });
  
      // Devolver los datos filtrados
      return filteredGuards || [];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });



  const addSupportGuardMutation = useMutation({
    mutationFn: ({
      area,
      location,
      checkin_id,
      support_guards,
    }: {
      area: string;
      location: string;
      checkin_id?: string;
      support_guards: { user_id: number; name: string }[];
    }) =>
      updateSupportGuards({
        area,
        location,
        checkin_id,
        support_guards,
      }),
    onMutate: () => {
      setLoading(true); // Activar loading global
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] }); // Refrescar datos del turno
    },
    onError: (error) => {
      console.error("Error al cambiar la agregar el guardia a la caseta:", error);
    },
    onSettled: () => {
      setLoading(false); // Desactivar loading global
    },
  });



  const checkoutSupportGuardsMutation = useMutation({
    mutationFn: ({
      area,
      location,
      guards,
    }: {
      area: string;
      location: string;
      guards: number[];
    }) =>
      checkoutSupportGuards({
        area,
        location,
        guards,
      }),
    onMutate: () => {
      setLoading(true); // Activar loading global
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] }); 
      queryClient.invalidateQueries({ queryKey: ["getSupportGuards"] });

    },
    onError: (error) => {
      console.error("Error al realizar el checkout de los guardias:", error);
    },
    onSettled: () => {
      setLoading(false); // Desactivar loading global
    },
  });
  






  return {

    /* Obtener List de guardias */
    supportGuards,
    isLoading,
    error,
    isFetching,

    /* Actualizar Lists de guardias */
    addSupportGuardMutation,


    /* Salida de guardias de la caseta*/
    checkoutSupportGuardsMutation

  };
};
