import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useShiftStore } from "@/store/useShiftStore";
import { closeNote, createNote, CreateNoteParams, getNotes } from "@/lib/get-notes";
import { toast } from "sonner";

export interface NoteComment {
  note_comments: string | string[];
}

export interface NoteFile {
  file_name: string;
  file_url: string;
}

export interface NotePic {
  file_name: string;
  file_url: string;
}



export interface Note {
  _id: string;
  created_by_email: string;
  created_by_id: number;
  created_by_name: string;
  folio: string;
  note: string;
  note_comments: NoteComment[];
  note_file: NoteFile[];
  note_open_date: string;
  note_pic: NotePic[];
  note_status: string;
}

export const useGetNotes = () => {


  const queryClient = useQueryClient();



  const { area, location, setLoading} = useShiftStore()
  
  

  const { data: listnotes, isLoading, error } = useQuery<Note[]>({
    queryKey: ["getNotes", area, location], 
    queryFn: async () => {
      const data = await getNotes(area, location);
      return data.response?.data || []; 
    },
    retry: 3, 
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    refetchOnWindowFocus: false, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });




  const closeNoteMutation = useMutation({
    mutationFn: async (folio: string) => {
      const response = await closeNote(folio);
  
      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al cerrar el turno"
        );
      }
  
      return response;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotes"] });
  
      // ✅ Notificación de éxito
      toast.success("Nota cerrado correctamente.");
    },
    onError: (err) => {
      console.error("Error al cerrar la nota:", err);
  
      // ❌ Notificación de error
      toast.error(err.message || "Hubo un error al cerrar el nota.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });


  

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: CreateNoteParams) => {
      const response = await createNote(noteData);
  
      if (!response.success) {
        throw new Error(
          response.error?.msg?.msg || "Hubo un error al crear la nota"
        );
      }
  
      return response;
    },
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getNotes"] });
  
      // ✅ Notificación de éxito
      toast.success("Nota creada correctamente.");
    },
    onError: (err) => {
      console.error("Error al crear la nota:", err);
  
      // ❌ Notificación de error
      toast.error(err.message || "Hubo un error al crear la nota.");
    },
    onSettled: () => {
      setLoading(false);
    },
  });





  return {
    listnotes,
    isLoading,
    error,


  /* crear nota */

  createNoteMutation,


    /* cerrar nota */
    closeNoteMutation
  };





};

