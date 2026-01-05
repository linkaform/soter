import { getBitacoraById } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useBitacoraById= (record_id:string) => {

    const {data, isLoading:isLoadingRondin} = useQuery<any>({
        queryKey: ["getBitacoraById", record_id],
        enabled: record_id?true:false,
        queryFn: async () => {
            const data = await getBitacoraById(record_id);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener la botacora, Error: ${data.error}`);
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