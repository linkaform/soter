import { getCheckById } from "@/lib/create-incidencia-rondin";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useCheckById= (record_id:string) => {

    const {data, isLoading:isLoadingRondin} = useQuery<any>({
        queryKey: ["getRondinById", record_id],
        enabled: record_id?true:false,
        queryFn: async () => {
            const data = await getCheckById(record_id);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener el area, Error: ${data.error}`);
            }else {
              return data.response?.data ??[];
            }
        },
    });

    return{
        data,
        isLoadingRondin,
    }
}