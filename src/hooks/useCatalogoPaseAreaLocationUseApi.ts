/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCatalogoPasesAreaNoApi } from "@/lib/get-catalogos-pase-area";
import { getCatalogoPasesLocationNoApi } from "@/lib/get-catalogos-pase-location";
import { errorMsj } from "@/lib/utils";
import { useAreasLocationStore } from "@/store/useGetAreaLocationByUser";
import { useQuery } from "@tanstack/react-query";

export const useCatalogoPaseAreaLocationUseApi = (location:string, enableLocation:boolean, enableArea:boolean) => {
  const {
    setAreas,
    setLocations
  } = useAreasLocationStore();

  const { data: dataAreas, isLoading:isLoadingAreas, error:errorAreas, isFetching:isFetchingAreas, refetch:refetchAreas } = useQuery<any>({
    queryKey: ["getCatalogoPasesAreaNoApi", location], 
    enabled:enableArea,
    queryFn: async () => {
        const data = await getCatalogoPasesAreaNoApi(location); 
        const textMsj = errorMsj(data) 
        if (textMsj){
          throw new Error (`Error al obtener catalogo de areas, Error: ${data.error}`);
        }else {
          setAreas(data.response?.data.areas_by_location)
          return data.response?.data.areas_by_location
        }
    },
   
    refetchOnWindowFocus: true, 
    // refetchInterval: 60000,
    refetchOnReconnect: true, 
    // staleTime: 1000 * 60 * 5, 
  });

  const { data: dataLocations, isLoading:isLoadingLocations, error:errorLocations, isFetching:isFetchingLocations, refetch:refetchLocations } = useQuery<any>({
    queryKey: ["getCatalogoPasesLocationNoApi"], 
    enabled:enableLocation,
    queryFn: async () => {
        const data = await getCatalogoPasesLocationNoApi(); 

        const textMsj = errorMsj(data) 
        if (textMsj){
          throw new Error (`Error al obtener catalogo de locations, Error: ${data.error}`);
        }else {
          setLocations(data.response?.data.ubicaciones_user)
          return data.response?.data.ubicaciones_user
        }
    },
   
    refetchOnWindowFocus: true, 
    // refetchInterval: 60000,
    refetchOnReconnect: true, 
    // staleTime: 1000 * 60 * 5, 
  });

  return {
    //Area
    dataAreas,
    isLoadingAreas,
    errorAreas,
    isFetchingAreas,
    refetchAreas,
    //Locations
    dataLocations,
    isLoadingLocations,
    errorLocations,
    isFetchingLocations,
    refetchLocations,

  };
};
