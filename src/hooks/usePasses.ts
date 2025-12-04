import { useQuery } from "@tanstack/react-query";
import { fetchPasesActivos } from "@/lib/access";

export const usePasses = (location: string | null) => {

  const {
    data,
    isLoading: isLoadingPasses,
    error,
    isFetching,
    refetch,
  } = useQuery<any>({
    enabled: !!location, 
    queryKey: ["getActivePasses", location],
    queryFn: async () => {
      if (!location) return []; 
      const data = await fetchPasesActivos({ location });
      return Array.isArray(data.response?.data)
        ? data.response.data
        : [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnReconnect: true,
  });

  return {
    data,
    isLoadingPasses,
    error,
    isFetching,
    refetch,
  };
};
