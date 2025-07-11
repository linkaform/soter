import { crearNota, editarNota, getNotes, InputNote, UpdateNote, CloseNote, cerrarNota } from "@/lib/notes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { errorMsj } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export const useNotes = (enableGetNotes:boolean, area:string, location:string, pageIndex: number = 0, pageSize: number = 10, dateFrom: string = "", dateTo: string="", status: string = "abierto") => {
  const offset = pageIndex * pageSize
  const limit = pageSize
  const queryClient = useQueryClient();
  const [isLoadingNotes, setLoadingNotes] = useState(false);
  //Obtener lista de notas
  const { data, isLoading: isLoadingListNotes, error, isFetching, refetch } = useQuery<any, Error>({
    queryKey: ["getNotes", area, location, pageIndex, pageSize, dateFrom, dateTo, status], 
    queryFn: async () => {
      if (!area || !location) return {};
      const fetchedData = await getNotes(area, location, limit, offset, dateFrom, dateTo, status); 
      return fetchedData.response?.data ?? {};
    },
    enabled: !!area && !!location && enableGetNotes,
    placeholderData: {} as any,
    staleTime: 1000 * 60 * 5,
  });

  //Crear Nota
  const createNoteMutation = useMutation({
    mutationFn: async ({ location, area, data_notes} : { location: string, area: string, data_notes: InputNote }) => {
        const response = await crearNota(location, area, data_notes);
        const hasError= response.response.data.status_code

        if(hasError == 400|| hasError == 401){
            const textMsj = errorMsj(response.response.data) 
            throw new Error(`Error al crear nota, Error: ${textMsj?.text}`);
        }else{
            return response.response?.data
        }
    },
    onMutate: () => {
      setLoadingNotes(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'getShift'
      });
      queryClient.invalidateQueries({ queryKey: ['getStats'] });
      queryClient.invalidateQueries({ queryKey: ['getNotes'] });
      toast.success("Nota creada correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al crear nota:", err);
      toast.error(err.message || "Hubo un error al crear la nota.");

    },
    onSettled: () => {
      setLoadingNotes(false);
    },
  });

  //Editar Nota
  const editNoteMutation = useMutation({
    mutationFn: async ({ update_note} : { update_note: UpdateNote }) => {
        const response = await editarNota(update_note);
        const hasError= response.response.data.status_code

        if(hasError == 400|| hasError == 401){
            const textMsj = errorMsj(response.response.data) 
            throw new Error(`Error al editar nota, Error: ${textMsj?.text}`);
        }else{
            return response.response?.data
        }
    },
    onMutate: () => {
      setLoadingNotes(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'getShift'
      });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['getNotes'] });
      toast.success("Nota editada correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al editar nota:", err);
      toast.error(err.message || "Hubo un error al editar la nota.");

    },
    onSettled: () => {
      setLoadingNotes(false);
    },
  });

  //Cerrar Nota
  const closeNoteMutation = useMutation({
    mutationFn: async ({ close_note} : { close_note: CloseNote }) => {
        const response = await cerrarNota(close_note);
        const hasError= response.response.data.status_code

        if(hasError == 400|| hasError == 401){
            const textMsj = errorMsj(response.response.data|| response.error || "") 
            throw new Error(`Error al cerrar nota, Error: ${textMsj?.text}`);
        }else{
            return response.response?.data
        }
    },
    onMutate: () => {
      setLoadingNotes(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'getShift'
      });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['getNotes'] });
      toast.success("Nota cerrada correctamente.");
    },
    onError: (err: any) => {
      console.error("Error al cerrar nota:", err);
      toast.error(err.message || "Hubo un error al cerrar la nota.");

    },
    onSettled: () => {
      setLoadingNotes(false);
    },
  });


  return {
    data,
    isLoadingListNotes,
    createNoteMutation,
    editNoteMutation,
    closeNoteMutation,
    isLoadingNotes,
    error,
    isFetching,
    refetch,
  };
};


