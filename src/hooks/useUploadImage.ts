/* eslint-disable @typescript-eslint/no-explicit-any */
import { uploadImage } from "@/lib/get-upload-image";
import { Imagen } from "@/lib/update-pass";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export const useUploadImage = () => {
    const[isLoading, setLoading] = useState(false);
    const[response, setResponse] = useState<Imagen>();
    const queryClient = useQueryClient();

     //Subir Imagen
    const uploadImageMutation = useMutation({
      mutationFn: async ({ img } : { img: File | null}) => {
        console.log("IMGG", img)

          const response = await uploadImage(img);
          console.log("IMGG2", response)
          const data = {file_name:response?.file_name, file_url:response?.file}; 

          setResponse(data)
          return data;
      },
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getListIncidencias"] });
        queryClient.invalidateQueries({ queryKey: ["getStatsIncidencias"] });
        toast.success("Archivo subido correctamente.");
      },
      onError: (err) => {
        console.error("Error al subir archivo:", err);
        toast.error(err.message || "Hubo un error al subir el archivo.");
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  return {
    uploadImageMutation,
    response,
    isLoading,
  };
};
