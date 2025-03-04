import { useQuery } from "@tanstack/react-query";
import { errorMsj } from "@/lib/utils";
import { deleteFalla } from "@/lib/delete-fallas";

export const useDeleteFalla = (folio: string[]) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["deleteFalla", folio],
    enabled:false,
    queryFn: async () => {
        console.log("DENTROO")
      const data = await deleteFalla(folio);
      const textMsj = errorMsj(data)  
      if (textMsj?.text){
        throw new Error (`Error al eliminar falla, Error: ${textMsj.text}`);
      }else {
        return data.response?.data
      }
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
