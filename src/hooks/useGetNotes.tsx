import { getNotes } from "@/lib/get-notes";
import { useShiftStore } from "@/store/useShiftStore";
import { useQuery } from "@tanstack/react-query";

interface NoteComment {
  note_comments: string | string[];
}

interface NoteFile {
  file_name: string;
  file_url: string;
}

interface NotePic {
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



    const { area, location } = useShiftStore();

  const { data: listnotes, isLoading, error } = useQuery<Note[]>({
    queryKey: ["getNotes", area, location], 
    queryFn: async () => {
      const data = await getNotes(area, location);
      return data.response?.data; 
    },
    retry: 3, 
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), 
    refetchOnWindowFocus: false, 
    refetchInterval: 60000,
    refetchOnReconnect: true, 
    staleTime: 1000 * 60 * 5, 
  });

  return {
    listnotes,
    isLoading,
    error,
  };
};
