import { NoteFile, NotePic } from "@/hooks/useGetNotes";

export const getNotes = async (area: string, location: string) => {
    const payload = {
      script_name: "notes.py",
      option: "get_notes",
      area,
      location,
    };
  
    const userJwt = localStorage.getItem("access_token");
  
      const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userJwt}`,
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json(); 
      return data 
     
  
  };






  export const closeNote = async (folio: string) => {


    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; 
    const localTime = new Date(now.getTime() - offset) 
  
    const formattedDate = localTime.toISOString().slice(0, 19).replace("T", " "); //

    const payload = {
      script_name: "notes.py",
      option: "update_note",
      folio,
      data_update: {
        note_status: "cerrado",
        note_close_date: formattedDate, 
      },
    };
  
  
       const userJwt = localStorage.getItem("access_token");
  
      const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
       "Content-Type": "application/json",
        "Authorization": `Bearer ${userJwt}`,
        },
       body: JSON.stringify(payload),
      });
  
      const data = await response.json();
    return data;
  
  };
  





  export interface CreateNoteParams {
    area: string;
    location: string;
    note: string;
    note_booth: string;
    note_comments?: string[]; // Lista de comentarios (opcional)
    note_file?: NoteFile[]; // Lista de archivos (opcional)
    note_pic?: NotePic[]; // Lista de imágenes (opcional)
  }

  
  export const createNote = async ({
    area,
    location,
    note,
    note_booth,
    note_comments = [],
    note_file = [],
    note_pic = [],
  }: CreateNoteParams): Promise<any> => {
    const payload = {
      script_name: "notes.py",
      option: "new_notes",
      area,
      location,
      data_notes: {
        note_status: "abierto",
        note,
        note_booth,
        note_comments,
        note_file,
        note_guard_close: "", 
        note_pic,
      },
    };
  
    console.log("🚀 Payload a enviar:", JSON.stringify(payload, null, 2)); 
  
    const userJwt = localStorage.getItem("access_token");
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userJwt}`,
        },
        body: JSON.stringify(payload),
      }
    );
  
    const data = await response.json();
    return data;
  };