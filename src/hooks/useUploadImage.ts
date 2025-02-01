/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadImage } from "@/lib/get-upload-image";
import { useQuery } from "@tanstack/react-query";

export const useUploadImage = (img:File|null) => {
  const { data: data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["uploadImage"], 
    queryFn: async () => {
            const data = await uploadImage(img); 
            return {file_name:data?.file_name, file_url:data?.file}; 
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
