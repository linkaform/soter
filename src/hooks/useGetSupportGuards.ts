/* eslint-disable @typescript-eslint/no-explicit-any */
import { checkoutSupportGuards } from "@/lib/checkout-support-guards";
import { getSupportGuards } from "@/lib/get-support-guards";
import { updateSupportGuards } from "@/lib/update-support-guard";
import { toast } from "sonner"; // Importar Sonner

import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";

export const useGetSupportGuards = () => {
  const queryClient = useQueryClient();

  const { area, location, setLoading } = useShiftStore();

  const { userNameSoter } = useAuthStore();

  const {
    data: supportGuards,
    isLoading,
    error,
    isFetching,
  } = useQuery<any>({
    queryKey: ["getGuardSupport", area, location],
    queryFn: async () => {
      const response = await getSupportGuards({ area, location });

      // Aplicar el filtro directamente
      const filteredGuards = response?.response?.data?.guardia_de_apoyo?.filter(
        (guard: any) => {
          return guard.name !== userNameSoter;
        }
      );

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
    mutationFn: async ({
      area,
      location,
      checkin_id,
      support_guards,
    }: {
      area: string;
      location: string;
      checkin_id?: string;
      support_guards: { user_id: number; name: string }[];
    }) => {
      const response = await updateSupportGuards({
        area,
        location,
        checkin_id,
        support_guards,
      });
  
      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al agregar el guardia."
        );
      }
  
      return response;
    },
    onMutate: () => {
      setLoading(true); // Activar loading global
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] });
      queryClient.invalidateQueries({ queryKey: ["getGuardSupport"] });
  
      // ✅ Notificación de éxito
      toast.success("Guardia agregado correctamente.");
    },
    onError: (error) => {
      console.error("Error al agregar el guardia:", error);
  
      // ❌ Notificación de error
      toast.error(
        error.message || "Hubo un error al agregar el guardia a la caseta."
      );
    },
    onSettled: () => {
      setLoading(false); // Desactivar loading global
    },
  });
  
 
  const checkoutSupportGuardsMutation = useMutation({
    mutationFn: async ({
      area,
      location,
      guards,
    }: {
      area: string;
      location: string;
      guards: number[];
    }) => {
      const response = await checkoutSupportGuards({
        area,
        location,
        guards,
      });

      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg ||
            "Hubo un error al realizar el checkout de los guardias"
        );
      }

      return response;
    },
    onMutate: () => {
      setLoading(true); // Activar loading global
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] });
      queryClient.invalidateQueries({ queryKey: ["getGuardSupport"] });

      // ✅ Notificación de éxito
      toast.success("Checkout de guardias realizado correctamente.");
    },
    onError: (error) => {
      console.error("Error al realizar el checkout de los guardias:", error);

      // ❌ Notificación de error
      toast.error(
        error.message ||
          "Hubo un error al realizar el checkout de los guardias."
      );
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
    checkoutSupportGuardsMutation,
  };
};
