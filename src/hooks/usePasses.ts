import { useQuery } from "@tanstack/react-query";
import { useShiftStore } from "@/store/useShiftStore";
import { fetchPasesActivos } from "@/lib/access";

export const usePasses = (location: string) => {
  const { isLoading } = useShiftStore();

  const { data, isLoading: isLoadingPasses, error, isFetching, refetch } = useQuery<any>({
    enabled: !!location,
    queryKey: ['getActivePasses', location],
    queryFn: async () => {
      const data = await fetchPasesActivos({ location })
      return Array.isArray(data.response?.data) ? data?.response?.data : []
    },
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true
  })

  return {
    data,
    isLoadingPasses,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};
