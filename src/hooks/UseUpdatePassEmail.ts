import { UpdatePase } from "@/lib/update-pass";
import { errorMsj } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useUpdatePassEmailPhone = () => {
    const [ isLoading, setLoading] =useState(false)
    const queryClient = useQueryClient();

    const updateDataMutation = useMutation({
    mutationFn: async ({
        access_pass, id, account_id
    }: { access_pass:any, id:string, account_id:number}) => {
        const response = await UpdatePase({
            access_pass,
            id,
            account_id,
          });
        const hasError= response.response.data.status_code
        if(hasError == 400|| hasError == 401){
            const textMsj = errorMsj(response.response.data) 
            throw new Error(`Error al actualizar, Error: ${textMsj?.text}`);
        }else{
            return response.response?.data
        }
    },
    onMutate: () => {
        setLoading(true);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getMyPases"] });
        toast.success(
            "Información agregada correctamente."
          );
    },
    onError: (err) => {
        toast.error(err.message || "Hubo un error al actualizar la información del pase.");

    },
    onSettled: () => {
        setLoading(false);
    },
    });

  return {
    updateDataMutation,
    isLoading
  };
};

