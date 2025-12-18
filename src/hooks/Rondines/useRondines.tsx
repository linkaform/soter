import { crearRondin } from "@/lib/rondines";
import { errorMsj } from "@/lib/utils";
import { useShiftStore } from "@/store/useShiftStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRondines = () => {
    const queryClient = useQueryClient();
    const {isLoading, setLoading} = useShiftStore();

		const createRondinMutation = useMutation({
			mutationFn: async ({ rondin_data} : { rondin_data: any }) => {
				const response = await crearRondin(rondin_data);
				const hasError = (!response?.success) || (response?.response?.data?.status_code === 400 )
				if (hasError) {
					const textMsj = errorMsj(response)
					throw new Error(`Error al crear seguimiento, Error: ${textMsj?.text}`);
				} else {
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
			toast.error(err.message || "Hubo un error al crear rondin");
		
			},
			onSettled: () => {
			setLoading(false);
			},
		});

		// const updateRondinMutation = useMutation({
		// 	mutationFn: async ({ rondin_id, rondin_data} : {rondin_id:string, rondin_data: any }) => {
		// 		console.log("rondin_id", rondin_id)
		// 		const response = await crearRondin(rondin_data);

		// 		if(response.response.data.status =="error"){
		// 			throw new Error(`Error al actualizar rondin Error: ${response.response.data.message }`);
		// 		}else{
		// 			return response.response?.data
		// 		}
		// 	},
		// 	onMutate: () => {
		// 	setLoading(true);
		// 	},
		// 	onSuccess: () => {
		// 	queryClient.invalidateQueries({ queryKey: ["getListRondines"] });
		// 	queryClient.invalidateQueries({ queryKey: ["getStatsRondines"] });
		// 	toast.success("Rondin actualizado correctamente.");
		// 	},
		// 	onError: (err) => {
		// 	console.error("Error al crear rondin", err);
		// 	toast.error(err.message || "Hubo un error al actualizar rondin");
		
		// 	},
		// 	onSettled: () => {
		// 	setLoading(false);
		// 	},
		// });


    return{
        createRondinMutation,
		// updateRondinMutation,
        isLoading,
    }
}