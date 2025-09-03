import { getPdfIncidencias } from "@/lib/get-pdf-incidencias";
import { useQuery } from "@tanstack/react-query";

export const useGetPdfIncidencias = (qr_code: string, template_id:number|null, account_id:number) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getPdfIncidencias", qr_code, template_id, account_id],
    queryFn: async () => {
      const data = await getPdfIncidencias(qr_code, template_id, account_id);
      return data;
    },
    enabled: false, 
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};