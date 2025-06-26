import { crearArticuloPerdido, editarArticuloPerdido, getListArticulosPerdidos, InputArticuloPerdido, InputDevolver } from "@/lib/articulos-perdidos";
import { getStats } from "@/lib/get-stats";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useArticulosPerdidos = (location:string, area:string, status:string, enableList:boolean, date1:string, date2:string, filterDate:string ) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de ArtículosPerdidos
    const {data: listArticulosPerdidos, isLoading:isLoadingListArticulosPerdidos, error:errorListArticulosPerdidos, refetch } = useQuery<any>({
        queryKey: ["getListArticulosPerdidos", location, status, date1, date2, filterDate],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListArticulosPerdidos(location, status, date1, date2, filterDate);
            const textMsj = errorMsj(data) 
            if (textMsj){
              toast.error(`Error al obtener lista de artículos perdidos, Error: ${data.error}`);
              return []
            }else {
              return Array.isArray(data?.response?.data) ? data?.response?.data : [];
            }
        },
       
    });

     //Crear ArtículoPerdido
     const createArticulosPerdidosMutation = useMutation({
        mutationFn: async ({ data_article} : { data_article: InputArticuloPerdido }) => {
            const response = await crearArticuloPerdido(data_article);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear artículo perdido, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListArticulosPerdidos"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Artículo creado creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear el artículo perdido:", err);
          toast.error(err.message || "Hubo un error al crear el artículo perdido.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Editar artículo perdido
     const editarArticulosPerdidosMutation = useMutation({
        mutationFn: async ({ data_article_update, folio} : { data_article_update: InputArticuloPerdido, folio:string }) => {
            const response = await editarArticuloPerdido(data_article_update, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar artículo perdido, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListArticulosPerdidos"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          refetch()
          toast.success("Artículo perdido editado correctamente.");
        },
        onError: (err) => {
          console.error("Error al editar el artículo perdido:", err);
          toast.error(err.message || "Hubo un error al editar el artículo perdido.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

       //Crear Devolucion
     const devolverArticulosPerdidosMutation = useMutation({
        mutationFn: async ({data_article_update, folio} : {data_article_update: InputDevolver, folio:string, location:string, area:string, status:string }) => {
            const response = await editarArticuloPerdido(data_article_update, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al devolver artículo, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListArticulosPerdidos"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Devolución registrada correctamente.");
        },
        onError: (err) => {
          console.error("Error al realizar la devolución:", err);
          toast.error(err.message || "Hubo un error al realizar la devolución.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      const { data: stats, isLoading: isStatsLoading, error: statsError,
      } = useQuery<any>({
        queryKey: ["getStatsArticulos", area, location],
        enabled:enableList,
        queryFn: async () => {
            const data = await getStats( area, location, "Articulos" );
            const responseData = data.response?.data || {};
            return responseData;
        },
      });

    return{
        //Lista de ArticulosPerdidos
        listArticulosPerdidos,
        isLoadingListArticulosPerdidos,
        errorListArticulosPerdidos,
        //Crear ArticulosPerdidos
        createArticulosPerdidosMutation,
        isLoading,
        //Editar ArticulosPerdidos
        editarArticulosPerdidosMutation,
        //Eliminar ArticulosPerdidos
        devolverArticulosPerdidosMutation,
        //Stats Articulos
        stats,
        isStatsLoading,
        statsError
    }
}