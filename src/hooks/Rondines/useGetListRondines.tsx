import { RondinResponse } from "@/components/table/rondines/table";
import { getListRondin } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetListRondines = (enableList:boolean, date1:string, date2:string, limit:number, offset:number) => {

    //Obtener lista de Rondines
    const {data: listRondines, isLoading:isLoadingListRondines, error:errorListRondines} = useQuery<RondinResponse>({
        queryKey: ["getListRondines", date1, date2, limit, offset],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListRondin(date1, date2, limit, offset);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de rondines, Error: ${data.error}`);
            }else {
              return Array.isArray(data.response?.data)? data.response?.data : [];
            }
        },
    });

    return{
        listRondines,
        isLoadingListRondines,
        errorListRondines,
    }
}