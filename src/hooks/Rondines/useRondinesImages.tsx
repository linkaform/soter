import { getRondinesImages } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useRondinesImages = (enable: boolean, location: string, area: string, dateFrom: string, dateTo: string, limit:number, offset: number) => {

    //Obtener lista de Rondines
    const {data, isLoading, error} = useQuery<any>({
        queryKey: ["getListRondines", location, area, dateFrom, dateTo, limit, offset],
        enabled: enable,
        queryFn: async () => {
            const data = await getRondinesImages(location, area, dateFrom, dateTo, limit, offset);
            const textMsj = errorMsj(data);
            if (textMsj){
              throw new Error (`Error al obtener las imagenes, Error: ${data.error}`);
            }else {
              return Array.isArray(data.response?.data)? data.response?.data : [];
            }
        },
    });

    return{
        data,
        isLoading,
        error
    }
}