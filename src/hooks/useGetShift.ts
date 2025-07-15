/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeShift } from "@/lib/close-shift";
import { getShift } from "@/lib/get-shift";
import { startShift } from "@/lib/start-shift";
import { toast } from "sonner"; // Importar Sonner
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/useAuthStore";

export const useGetShift = (enableShift:boolean) => {
  const queryClient = useQueryClient();

  const { userNameSoter } = useAuthStore();

  const {
    area,
    location,
    setLoading,
    isLoading: loading,
    setCheckin_id,
    checkin_id,
    setArea,
    setLocation,
    setTurno,
  } = useShiftStore();

  const {
    data: shift,
    isLoading,
    error,
    isFetching,
    refetch,
  } = useQuery<any>({
    queryKey: ["getShift"],
    enabled: enableShift,
    queryFn: async () => {
      	const data = await getShift({ area, location });
		if(!data.success){
			throw new Error(data.error?.exception?.msg[0] || "Hubo un error al obtener load shift");
		}else{
			const filteredGuards = data.response?.data?.support_guards?.filter((guard: any) => {
				return guard.name !== userNameSoter; });
			setArea(data.response?.data?.location?.area ?? "")
			setLocation(data.response?.data?.location?.name ?? "")
			setTurno(data?.response.data?.guard?.status_turn=="Turno Abierto" ? true:false)
			return {...data.response?.data,support_guards: filteredGuards,}
		}
    },
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
      setArea(area)
      setLocation(location)
      setTurno(true)
      toast.success("Turno iniciado correctamente.");

    },
    onError: (err) => {
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
      setTurno(false)
      toast.success("Turno cerrado correctamente.");
    },
    onError: (err) => {
      toast.error(err.message || "Hubo un error al cerrar el turno.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });


  const forceCloseShift = useMutation({
    mutationFn: async ({ area, location , checkin_id}: { area: string; location: string, checkin_id:string }) => {
      const response = await closeShift({ area, location, checkin_id });
  
      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al forzar el cierre del turno."
        );
      }
  
      return response;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getShift"] });
      setTurno(false)
      toast.success("El cierre forzado se ejecutó con éxito.");
    },
    onError: (err) => {
      toast.error(err.message || "Hubo un error al cerrar el turno.");
    },
    onSettled: () => {
      setLoading(false);
    },
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
    forceCloseShift
  };
};
