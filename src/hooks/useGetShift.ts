/* eslint-disable @typescript-eslint/no-explicit-any */
import { closeShift } from "@/lib/close-shift";
import { getShift } from "@/lib/get-shift";
import { startShift } from "@/lib/start-shift";
import { toast } from "sonner"; // Importar Sonner
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Imagen } from "@/lib/update-pass-full";
import { errorMsj } from "@/lib/utils";

export const useGetShift = (enableShift:boolean) => {
  const queryClient = useQueryClient();

  const {
    area,
    location,
    setLoading,
    isLoading: loading,
    setCheckin_id,
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
    queryKey: ["getShift", area, location],
    refetchOnWindowFocus: false,
    enabled: enableShift,
    queryFn: async () => {
      const data = await getShift({ area, location });
      const hasError = (!data?.success) || (data?.response?.data?.status_code === 400 )
      if (hasError) {
          const textMsj = errorMsj(data)
          toast.error(`Error al obtener load shift, Error: ${textMsj?.text}`);
      } else {
          setLocation(data.response?.data.location.name)
          setArea(data.response?.data.location.area)
          setTurno(data.response?.data.booth_status.status == "Abierta")
          return data.response?.data
      }
		}});

  const startShiftMutation = useMutation({
		mutationFn: async ({
		employee_list, fotografia, nombre_suplente, checkin_id
		}: {
		employee_list?: { user_id: number; name: string }[], fotografia:Imagen[], nombre_suplente:string, checkin_id?: string
		}) => {
		const response = await startShift({
			area,
			location,
			employee_list,
			fotografia,
			nombre_suplente,
			checkin_id
		});

		const hasError = (!response?.success) || (response?.response?.data?.status_code === 400 )
		if (hasError) {
			const textMsj = errorMsj(response)
			throw new Error(`Error al iniciar turno, Error: ${textMsj?.text}`);
		} else {
			return response.response?.data
		}
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
    mutationFn: async ({
      fotografia, checkin_id
    }: {
      fotografia:Imagen[], checkin_id?: string
    }) => {
      const response = await closeShift({ area, location, checkin_id , fotografia});
  		const hasError = (!response?.success) || (response?.response?.data?.status_code === 400 )
		if (hasError) {
			const textMsj = errorMsj(response)
			throw new Error(`Error al cerrar turno, Error: ${textMsj?.text}`);
		} else {
			return response.response?.data
		}
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
	  const hasError = (!response?.success) || (response?.response?.data?.status_code === 400 )
	  if (hasError) {
		  const textMsj = errorMsj(response)
		  throw new Error(`Error al forzar cierre de turno, Error: ${textMsj?.text}`);
	  } else {
		  return response.response?.data
	  }
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
