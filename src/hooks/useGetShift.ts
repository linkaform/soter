/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeShift } from "@/lib/close-shift";
import { getShift, getStats } from "@/lib/get-shift";
import { startShift } from "@/lib/start-shift";
import { toast } from "sonner"; // Importar Sonner

/* import useAuthStore from "@/store/useAuthStore";
 */
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";

export const useGetShift = () => {
  const queryClient = useQueryClient();



  const { userNameSoter } = useAuthStore();


  const {
    area,
    location,
    setLoading,
    isLoading: loading,
    setCheckin_id,
    checkin_id,
  } = useShiftStore();

  const {
    data: shift,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<any>({
    queryKey: ["getShift", area, location],
    queryFn: async () => {
      const data = await getShift({ area, location });

  
      const filteredGuards = data.response?.data?.support_guards?.filter((guard: any) => {
          return guard.name !== userNameSoter; 
        });
 
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
    mutationFn: async ({
      employee_list,
    }: {
      employee_list?: { user_id: number; name: string }[];
    }) => {
      const response = await startShift({
        area,
        location,
        employee_list,
      });

      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al Iniciar turno"
        );
      }

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

      queryClient.invalidateQueries({ queryKey: ["getGuardSupport"] });




      toast.success("Turno iniciado correctamente.");

    },
    onError: (err) => {
      console.error("Error al iniciar turno:", err);

      toast.error(err.message || "Hubo un error al iniciar el turno.");

    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const closeShiftMutation = useMutation({
    mutationFn: async () => {
      const response = await closeShift({ area, location, checkin_id });
  
      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al cerrar el turno"
        );
      }
  
      return response;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] });
  
      // ✅ Notificación de éxito
      toast.success("Turno cerrado correctamente.");
    },
    onError: (err) => {
      console.error("Error al cerrar turno:", err);
  
      // ❌ Notificación de error
      toast.error(err.message || "Hubo un error al cerrar el turno.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useQuery<any>({
    queryKey: ["getTurnStats", area, location],
    queryFn: async () => {
      const data = await getStats({ area, location });
      const responseData = data.response?.data || {};
      return responseData;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });

  return {
    // Turno
    shift,
    isLoading,
    loading,
    error,
    isFetching,
    startShiftMutation,
    closeShiftMutation,
    refetch,

    // Estadísticas
    stats,
    isStatsLoading,
    statsError,

    // Guardias iniciar turno
  };
};
