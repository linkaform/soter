import { getVehiculos, getVehiculosParams } from "@/lib/get-vehiculos";
import { useQuery } from "@tanstack/react-query";

export const useGetVehiculos = ({account_id, tipo, marca , isModalOpen}: getVehiculosParams) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["useGetVehiculos", account_id,tipo,marca],
    enabled:isModalOpen,
    queryFn: async () => {
      const data = await getVehiculos({
        account_id,
        tipo,
        marca
      });
      
      return data.response?.data  || []
    },
    refetchOnWindowFocus: true,
    refetchInterval: 600000,
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