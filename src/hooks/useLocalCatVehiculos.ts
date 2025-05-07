import { getCatalogVehiculos } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface getVehiculosParams {
  tipo: string;
  marca?: string;
  isModalOpen: boolean;
}

export const useGetLocalVehiculos = ({ tipo, marca, isModalOpen }: getVehiculosParams) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getCatalogVehiculos", tipo, marca],
    enabled: isModalOpen, 
    queryFn: () => {
      const data = getCatalogVehiculos({ tipo, marca });
      return data || [];
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