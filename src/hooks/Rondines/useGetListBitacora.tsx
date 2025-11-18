import { getListBitacoraRondines } from "@/lib/create-incidencia-rondin";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetListBitacoraRondines = (location: string) => {

    const {data: listBitacoraRondines, isLoading:isLoadingListBitacoraRondines, error:errorListBitacoraRondines} = useQuery<any>({
        queryKey: ["getListBitacoraRondines", location],
        queryFn: async () => {
            const data = await getListBitacoraRondines(location);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de Bitacora de Rondines, Error: ${data.error}`);
            }else {
              return Array.isArray(data.response?.data)? data.response?.data : [];
            }
        },
    });

    return{
        listBitacoraRondines,
        isLoadingListBitacoraRondines,
        errorListBitacoraRondines,
    }
}