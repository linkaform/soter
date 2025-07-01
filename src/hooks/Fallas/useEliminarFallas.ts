import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFalla } from "@/lib/fallas";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { useShiftStore } from "@/store/useShiftStore";

export const useEliminarFalla = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useShiftStore();

  return useMutation({
    mutationFn: async ({ folio }: { folio: string[] }) => {
      const response = await deleteFalla(folio);
      const hasError = response.response.data.status_code;

      if (hasError === 400 || hasError === 401) {
        const textMsj = errorMsj(response.response.data);
        throw new Error(`Error al eliminar falla, Error: ${textMsj?.text}`);
      } else {
        return response.response?.data;
      }
    },
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getListFallas"] });
      queryClient.invalidateQueries({ queryKey: ["getStatsFallas"] });
      toast.success("Falla eliminada correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al eliminar falla:", err);
      toast.error(err.message || "Hubo un error al eliminar la falla.");
    },
    onSettled: () => setLoading(false),
  });
};