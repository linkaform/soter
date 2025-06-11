import { getCatIncidencias } from "@/lib/incidencias";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoInciencias = (enabledIncidencias:boolean, categoria:string, subCategoria:string) => {
    const {data: catIncidencias, isLoading:isLoadingCatIncidencias, error:errorCatIncidencias} = useQuery<any>({
      queryKey: ["getCatIncidencias", categoria, subCategoria],
      enabled:enabledIncidencias,
      queryFn: async () => {
          const data = await getCatIncidencias(categoria, subCategoria);
          return data.response?.data ? data.response?.data: []; 
      },
    });

    return {
        catIncidencias,
        isLoadingCatIncidencias,
        errorCatIncidencias,
    };
};
    