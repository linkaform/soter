import { getUserContacts } from "@/lib/get-user-contacts";
import { useQuery } from "@tanstack/react-query";

export const useGetUserContacts= () => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getUserContacts"], 
    queryFn: async () => {
        const data = await getUserContacts(); 
        return data.response?.data;
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


