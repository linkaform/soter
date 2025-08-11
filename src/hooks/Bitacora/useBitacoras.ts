import { Bitacora_record } from "@/components/table/bitacoras/bitacoras-columns";
import { getListBitacora } from "@/lib/bitacoras";
import { errorMsj } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export interface Data {
  total_records: number
  records: Bitacora_record[]
  actual_page: number
  total_pages: number
}

export const useBitacoras = (location:string, area:string,prioridades:string[], enableList:boolean, date1:string, date2:string, dateFilter:string) => {

    const {data: listBitacoras, isLoading:isLoadingListBitacoras, error:errorListBitacoras } = useQuery<any>({
        queryKey: ["getListBitacoras", area, location, prioridades, date1, date2, dateFilter],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListBitacora(location, area, prioridades, date1, date2, dateFilter);
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de bitacoras, Error: ${data.error}`);
            }else {
              	return  data?.response?.data ??[]
                // ?? {
                //   'total_records': 0,
                //   'records': [],
                //   'actual_page': 0,
                //   'total_pages': 0
                // };
            }
        },
    });

    return{
        //Lista de Bitacoras
        listBitacoras,
        isLoadingListBitacoras,
        errorListBitacoras,
    }
}