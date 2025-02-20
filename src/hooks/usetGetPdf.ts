import { getPdf } from "@/lib/get-pdf";
import { useQuery } from "@tanstack/react-query";

export const useGetPdf = (account_id: number|null,qr_code:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getPdf", account_id, qr_code],
    enabled:false,
    queryFn: async () => {
      const data = await getPdf(
        account_id,
        qr_code
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
