import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useShiftStore } from "@/store/useShiftStore";
import { deleteRondin } from "@/lib/rondines";

export const useEliminarRondin = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useShiftStore();

  return useMutation({
    mutationFn: async ({ folio }: { folio: string }) => {
      const response = await deleteRondin(folio);
      const hasError = response.success;

      if (!hasError) {
        throw new Error(`Error al eliminar rondin`);
      } else {
        return response.response?.data;
      }
    },
    onMutate: () => setLoading(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getListRondines"] });
      queryClient.invalidateQueries({ queryKey: ["getStatsRondines"] });
      toast.success("Rondin eliminado correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al eliminar rondin:", err);
      toast.error(err.message || "Hubo un error al eliminar el rondin.");
    },
    onSettled: () => setLoading(false),
  });
};