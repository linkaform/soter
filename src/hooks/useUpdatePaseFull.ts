import { Access_pass_update, UpdatePase } from "@/lib/update-pass";
import { UpdatePaseFull } from "@/lib/update-pass-full";
import { useQuery } from "@tanstack/react-query";

export const useUpdatePaseFull = (access_pass: Access_pass_update|null, id: string, folio:string,location:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["UpdatePaseFull", access_pass, id, folio, location], // Agregamos los parámetros necesarios aquí
    enabled:false,
    queryFn: async () => {
      const data = await UpdatePaseFull({
        access_pass,
        id,
        folio,
        location
      });
      return data;
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

