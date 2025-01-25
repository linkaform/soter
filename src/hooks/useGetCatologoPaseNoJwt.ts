/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogosPaseNoJwt } from "@/lib/get-catalogos_pase_no_jwt";
import { useQuery } from "@tanstack/react-query";

export const useGetCatalogoPaseNoJwt = (account_id:number, qr_code:string ) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["useGetCatalogoPaseNoJwt"], 
    queryFn: async () => {
        const data = await getCatalogosPaseNoJwt(account_id, qr_code); 
        if (!data.response || !data.response?.data ) {
          console.error("Error al cargar la información");
        }
        return data.response?.data;
    },

    staleTime: 1000 * 60 * 5,  // 5 minutos de datos frescos antes de ser considerados obsoletos
    cacheTime: 1000 * 60 * 10, // 10 minutos en caché
    refetchOnWindowFocus: true,  // No hacer refetch cuando la ventana vuelva a enfocarse
    refetchOnReconnect: true,
  
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
