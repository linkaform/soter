import { getStats } from "@/lib/get-stats";
import { useQuery } from "@tanstack/react-query";

export const useGetStats = (area:string, location:string, page:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getStats", area, location, page], 
    queryFn: async () => {
        const data = await getStats(area, location, page); 
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


