import { getPdf } from "@/lib/get-pdf";
import { useQuery } from "@tanstack/react-query";

export const useGetPdf = (account_id: number|null,qr_code:string, enable:boolean) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getPdf", account_id, qr_code],
    enabled:enable,
    queryFn: async () => {
      const data = await getPdf(
        account_id,
        qr_code
    );
      return data ;
    },
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
