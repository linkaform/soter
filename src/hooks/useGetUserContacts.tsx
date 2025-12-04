import { getUserContacts } from "@/lib/get-user-contacts";
import { useQuery } from "@tanstack/react-query";

export const useGetUserContacts= (enabled=true) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any[]>({
    queryKey: ["getUserContacts"], 
    queryFn: async () => {
        if (!enabled) return []; 
        const data = await getUserContacts(); 
        return data.response?.data;
    },
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};


