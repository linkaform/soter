import { crearRondin, InputCrearRondinCompleto } from "@/lib/rondines";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRondines = () => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

     //Crear Rondin
     const createRondinMutation = useMutation({
        mutationFn: async ({ rondin_data} : { rondin_data: InputCrearRondinCompleto }) => {
            const response = await crearRondin(rondin_data);

            if(response.response.data.status =="error"){
                throw new Error(`Error al crear rondin Error: ${response.response.data.message }`);
            }else{
                return response.response?.data
            }
        },
        onMutate: () => {
          setLoading(true);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getListRondines"] });
          queryClient.invalidateQueries({ queryKey: ["getStatsRondines"] });
          toast.success("Rondin creado correctamente.");
        },
        onError: (err) => {
          console.error("Error al crear rondin", err);
          toast.error(err.message || "Hubo un error al crear rondin");
    
        },
        onSettled: () => {
          setLoading(false);
        },
      });


    return{
        createRondinMutation,
        isLoading,
    }
}