/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/lib/get-login";
import { getUsers } from "@/lib/get-users";
import { useQuery } from "@tanstack/react-query";


export const useGetUsers = () => {


   
  
  

  const { data: users, isLoading, error, isFetching } = useQuery<User[]>({
    queryKey: ["getUsers"], 
    queryFn: async () => {
      const data = await getUsers()
      return data.response?.data; 
    },
    retry: 3, 
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    users,
    isLoading,
    error,
    isFetching
  };
};
