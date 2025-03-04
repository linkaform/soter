import { useQuery } from "@tanstack/react-query";
import { crearSeguimientoFalla, inputSeguimientoFalla } from "@/lib/create-seguimiento-falla";
import { errorMsj } from "@/lib/utils";

export const useCreateSeguimientoFalla = (location: string, falla_grupo_seguimiento: inputSeguimientoFalla | null, folio: string, area:string,status:string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
    queryKey: ["crearSeguimientoFalla", location, falla_grupo_seguimiento, area, folio,status], // Agregamos los parámetros necesarios aquí
    enabled:false,
    queryFn: async () => {
      console.log("DENTOR D ELA PETICION",falla_grupo_seguimiento, folio)
      const data = await crearSeguimientoFalla(
        falla_grupo_seguimiento,
        folio,
        location,
        area,
        status
      );
      const textMsj = errorMsj(data)  //COMO MANDAR LOS MSJS POR MEDIO DE ERROR
      if (textMsj?.text){
        throw new Error (`Error al obtener actualizar seguimiento de falla, Error: ${textMsj.text}`);
      }else {
        return data.response?.data
      }
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
