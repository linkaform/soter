import { UpdateBitacora } from "@/lib/update-bitacora-entrada";
import { Equipo, Vehiculo } from "@/lib/update-pass-full";
import { errorMsj } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useUpdateBitacora = () => {
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState<boolean>()

  // const { data, isLoading, error, isFetching, refetch } = useQuery<any>({
  //   queryKey: ["UpdateBitacora", vehiculo, equipo, id],
  //   enabled:false,
  //   queryFn: async () => {
  //     const data = await UpdateBitacora({
  //       vehiculo,
  //       equipo,
  //       id,
  //     });
  //     return data.response?.data;
  //   },
  // });

  const updateBitacoraMutation = useMutation({
    mutationFn: async ({vehiculo, equipo, id } : { vehiculo?: Vehiculo, equipo?:Equipo, id:string }) => {
        const response =  await UpdateBitacora({vehiculo, equipo, id});
        const hasError= response.response.data.status_code
        if(hasError == 400|| hasError == 401){
            const textMsj = errorMsj(response.response.data) 
            throw new Error(`Error al actualizar vehiculos, Error: ${textMsj?.text}`);
        }else{
            return response.response?.data ?? []
        }
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getListBitacoras"] });
      queryClient.invalidateQueries({ queryKey: ["getStats"] });
      toast.success("Vehiculo actualizado correctamente.");
    },
    onError: (err) => {
      console.error("Error al actualizar vehiculos:", err);
      toast.error(err.message || "Hubo un error al actualizar vehiculos.");

    },
    onSettled: () => {
      setLoading(false);
    },
  });



  return {
    isLoading,
    updateBitacoraMutation,
  };
};

