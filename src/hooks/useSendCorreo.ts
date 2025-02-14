import { data_correo, sendCorreo } from "@/lib/send_correo";
import { useQuery } from "@tanstack/react-query";

export const useSendCorreo = (account_id: number, envio: string[],data_for_msj:data_correo|null , folio:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["sendCorreo", account_id, envio, data_for_msj, folio],
    enabled:false,
    queryFn: async () => {
      console.log("enviooo", envio)
      const data = await sendCorreo(
        account_id,
        envio,
        data_for_msj,
        folio
      );
      return data ;
    },
    // refetchOnWindowFocus: true,
    // refetchInterval: 60000,
    // refetchOnReconnect: true,
    // staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
