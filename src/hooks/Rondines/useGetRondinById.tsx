import { getRondinById } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useGetRondinById= (record_id:string) => {

    //Obtener lista de Rondines
    const {data, isLoading:isLoadingRondin} = useQuery<any>({
        queryKey: ["getRondinById", record_id],
        enabled: record_id?true:false,
        queryFn: async () => {
            const data = await getRondinById(record_id);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener el rondin, Error: ${data.error}`);
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