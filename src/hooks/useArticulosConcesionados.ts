import { crearArticuloCon, editarArticuloCon, getListArticulosCon, InputArticuloCon, InputOutArticuloCon } from "@/lib/articulos-concesionados";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useArticulosConcesionados = (enableList:boolean) => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

    //Obtener lista de ArtículosCon
    const {data: listArticulosCon, isLoading:isLoadingListArticulosCon, error:errorListArticulosCon } = useQuery<any>({
        queryKey: ["getListArticulosCon"],
        enabled:enableList,
        queryFn: async () => {
            const data = await getListArticulosCon();
            const textMsj = errorMsj(data) 
            if (textMsj){
              throw new Error (`Error al obtener lista de artículos concesionados, Error: ${data.error}`);
            }else {
              return data.response?.data||[];
            }
        },
        refetchOnWindowFocus: true,
        refetchInterval: 15000,
        refetchOnReconnect: true,
        staleTime: 1000 * 60 * 5,
    });

     //Crear ArtículoConcesionado
     const createArticulosConMutation = useMutation({
        mutationFn: async ({ data_article} : { data_article: InputArticuloCon }) => {
            const response = await crearArticuloCon(data_article);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al crear artículo concesionado, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListArticulosCon"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Artículo creado creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear el artículo concesionado:", err);
          toast.error(err.message || "Hubo un error al crear el artículo concesionado.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

      //Editar artículo concesionado
     const editarArticulosConMutation = useMutation({
        mutationFn: async ({ data_article_update, folio} : { data_article_update: InputArticuloCon | InputOutArticuloCon, folio:string }) => {
            const response = await editarArticuloCon(data_article_update, folio);
            const hasError= response.response.data.status_code

            if(hasError == 400|| hasError == 401){
                const textMsj = errorMsj(response.response.data) 
                throw new Error(`Error al editar artículo concesionado, Error: ${textMsj?.text}`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListArticulosCon"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsArticulos"] });
          toast.success("Artículo concesionado editado correctamente.");
        },
        onError: (err) => {
          console.error("Error al editar el artículo concesionado:", err);
          toast.error(err.message || "Hubo un error al editar el artículo concesionado.");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });

    return{
        //Lista de ArticulosCon
        listArticulosCon,
        isLoadingListArticulosCon,
        errorListArticulosCon,
        //Crear ArticulosCon
        createArticulosConMutation,
        isLoading,
        //Editar ArticulosCon
        editarArticulosConMutation,
    }
}