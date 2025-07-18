import { getListFallas } from "@/lib/get-list-fallas";
import { useQuery } from "@tanstack/react-query";

export const useGetFallas= (location:string, area:string, status:string, dateFrom:string, dateTo:string, filterDate:string) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getListFallas", location, area, status, dateFrom, dateTo, filterDate], 
    queryFn: async () => {
        const data = await getListFallas(location, area , status,  dateFrom, dateTo, filterDate); 
        return Array.isArray(data.response?.data) ? data?.response?.data : []; 
    },
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch
  };
};
