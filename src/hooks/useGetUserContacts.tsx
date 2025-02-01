import { getUserContacts } from "@/lib/get-user-contacts";
import { useQuery } from "@tanstack/react-query";

export const useGetUserContacts= () => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["getUserContacts"], 
    queryFn: async () => {
        const data = await getUserContacts(); 
        if (!data.response || !data.response?.data) {
          console.error("Error al cargar los contactos");
        }
        return data.response?.data;
    },

    staleTime: 1000 * 60 * 5,  
    cacheTime: 1000 * 60 * 10, 
    refetchOnWindowFocus: true, 
    refetchOnReconnect: true,
  
  });

  return {
    data,
    isLoading,
    error,
    isFetching,
    refetch,
  };
};


