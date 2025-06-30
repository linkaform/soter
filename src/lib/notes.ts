import { toast } from "sonner";

export interface InputNote {
  note: string;
  note_booth: string;
  note_comments: string[];
  note_file: NoteFile[];
  note_guard_close: string;
  note_pic: NotePic[];
  note_status: string;
}

export interface NoteFile {
  file_name: string;
  file_url: string;
}

export interface NotePic {
  file_name: string;
  file_url: string;
}

export interface NoteUpdated {
  note: string;
  note_comments: string[];
  note_file: NoteFile[];
  note_pic: NotePic[];
}

export interface NoteClose {
  note_close_date: string;
  note_status: string;
}

export interface UpdateNote {
  folio: string;
  data_update: NoteUpdated;
}

export interface CloseNote {
  folio: string;
  data_update: NoteClose;
}


export const getNotes = async (area: string, location: string, limit: number = 10, offset: number = 0, dateFrom: string = "", dateTo: string = "", status: string = "abierto") => {
  const payload = {
    script_name: "notes.py",
    option: "get_notes",
    area,
    location,
    limit,
    offset,
    dateFrom,
    dateTo,
    status
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

export const crearNota = async (location: string, area: string, data_notes: InputNote | null) => {
  const payload = {
    data_notes: data_notes,
    option: "new_notes",
    script_name: "notes.py",
    location,
    area
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

export const editarNota = async (update_note: UpdateNote | null) => {
  if (!update_note) {
    throw new Error("update_note cannot be null");
  }
  const { folio, data_update } = update_note;
  const payload = {
    folio,
    data_update,
    option: "update_note",
    script_name: "notes.py",
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


export const cerrarNota = async (close_note: CloseNote | null) => {
  if (!close_note) {
    throw new Error("close_note cannot be null");
  }
  const { folio, data_update } = close_note;
  const payload = {
    folio,
    data_update,
    option: "update_note",
    script_name: "notes.py",
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


export const sendSmsOrEmail = async (folio: string, envio: string[]) => {
  toast.loading("Enviando pase...", {
    style: {
      background: "#000",
      color: "#fff",
      border: 'none'
    },
  });

  try {
    const payload = {
      option: "enviar_correo",
      script_name: "pase_de_acceso_use_api.py",
      folio,
      envio,
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

    toast.dismiss();
    toast.success("Pase enviado correctamente.", {
      style: {
        background: "#000",
        color: "#fff",
        border: 'none'
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    toast.dismiss();
    toast.error(`${error}` || "Hubo un error al enviar el pase.", {
      style: {
        background: "#000",
        color: "#fff",
        border: 'none'
      },
    });
    console.error("Error al ejecutar el script:", error);
    throw error;
  }
}