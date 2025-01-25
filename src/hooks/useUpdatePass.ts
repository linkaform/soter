import { Access_pass_update, UpdatePase } from "@/lib/update-pass";
import { useQuery } from "@tanstack/react-query";

export const useUpdateAccessPass = (access_pass: Access_pass_update, id: string, account_id:number) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["useUpdateAccessPass", access_pass, id, account_id], // Agregamos los parámetros necesarios aquí
    queryFn: async () => {
      const data = await UpdatePase({
        access_pass,
        id,
        account_id,
      });
      return data.response?.data.areas_by_location;
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

