import { getCatalogoProveedores } from "@/lib/paqueteria";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCatalogoProveedores = (isModalOpen:boolean) => {
  const { data: dataProveedores, isLoading:isLoadingProveedores, error: errorProveedores } = useQuery<any>({
    queryKey: ["getCatalogoProveedores"], 
    enabled:isModalOpen,
    queryFn: async () => {
        const data = await getCatalogoProveedores(); 
        console.log("DSATASAA", data)
        
        const textMsj = errorMsj(data) 
      if(textMsj){
        toast.error(`Error al obtener catalogo de proveedores, Error: ${data.error}`)
        return []
      }else{
        return data ? data?.response?.data  : []
      }
    },
   
    refetchOnWindowFocus: true, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    dataProveedores,
    isLoadingProveedores,
    errorProveedores,
  };
};
