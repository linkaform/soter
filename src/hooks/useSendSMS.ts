import { data_sms, sendSMS } from "@/lib/send-sms";
import { useQuery } from "@tanstack/react-query";

export const useSendSMS = (account_id: number, envio: string[],data_cel_msj:data_sms|null, folio:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["sendSMS", account_id, envio, data_cel_msj, folio],
    enabled:false,
    queryFn: async () => {
      const data = await sendSMS(
        account_id,
        envio,
        data_cel_msj,
        folio
      );
      return data ;
    },
    refetchOnWindowFocus: true,
    refetchInterval: 60000,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
