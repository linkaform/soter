import { getStats } from "@/lib/get-stats";
import { useQuery } from "@tanstack/react-query";

export const useGetStats = (enable:boolean, location:string, area:string, page:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getStats", location, area, page], 
    enabled:enable,
    queryFn: async () => {
        const data = await getStats(location, area, page); 
        return data.response?.data;
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


