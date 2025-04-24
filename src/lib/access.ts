import { Foto, Image } from "@/hooks/useSearchPass";

export const searchAccessPass = async (
  area: string,
  location: string,
  qr_code: string
) => {
  const payload = {
    script_name: "script_turnos.py",
    option: "search_access_pass",
    area,
    location,
    qr_code,
  };

  const userJwt = localStorage.getItem("access_token");

  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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

export const fetchTemporalPasses = async ({
  area = "Caseta Principal",
  location = "Planta Monterrey",
  inActive = "",
}) => {
  const payload = {
    caseta: area,
    inActive,
    location,
    option: "lista_pases",
    script_name: "script_turnos.py",
  };

  const userJwt = localStorage.getItem("access_token");

  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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

export const fetchPasesActivos = async ({
  area = "",
  location = "",
}) => {
  const payload = {
    caseta: area,
    location,
    option: "lista_pases",
    script_name: "script_turnos.py",
  };
  
  const userJwt = localStorage.getItem("access_token");
  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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


export interface RegisterIncomingProps {
  area?: string;
  location?: string;
  qr_code: string;
  comentario_acceso?: any[];
  comentario_pase?: any[];
  equipo?: any[];
  vehiculo?: any[];
  visita_a?: any[];
  gafete?: any;
}

export const registerIncoming = async (props: RegisterIncomingProps) => {
  const payload = {
    area: props.area || "Caseta Principal",
    location: props.location || "Planta Monterrey",
    qr_code: props.qr_code,
    comentario_acceso: props.comentario_acceso || [],
    comentario_pase: props.comentario_pase || [],
    equipo: props.equipo || [],
    vehiculo: props.vehiculo || [],
    gafete: props.gafete || {},
    visita_a: props.visita_a || [],
    option: "do_access",
    script_name: "script_turnos.py",
  };



        // Agregar el console.log antes de enviar la petición
        console.log("Payload enviado a registerIncoming:", payload)





  const userJwt = localStorage.getItem("access_token");
  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,    {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userJwt}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  return data;
};


export const exitRegister = async (
  area: string,
  location: string,
  qr_code: string,
  gafete_id?: ""
) => {
  const payload = {
    area,
    location,
    gafete_id,
    qr_code,
    option: "do_out",
    script_name: "script_turnos.py",
  };

  const userJwt = localStorage.getItem("access_token");

  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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

export const getAccessAssets = async (location: string) => {
  const payload = {
    location,
    option: "assets_access_pass",
    script_name: "script_turnos.py",
  };

  console.log("Payload enviado:", payload);

  const userJwt = localStorage.getItem("access_token");

  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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

export interface AccessPass {
  nombre: string;
  empresa: string;
  visita_a: string;
  perfil_pase?: string;
  foto: Foto | Image | undefined;
  identificacion: Foto | Image | undefined;
  email?: string;
  telefono?: string;
}

export const addNewVisit = async (
  location: string,
  access_pass: AccessPass
) => {
  const payload = {
    location,
    access_pass: {
      nombre: access_pass.nombre,
      empresa: access_pass.empresa,
      visita_a: [access_pass.visita_a],
      perfil_pase: access_pass.perfil_pase || "Visita general",
      foto: access_pass.foto || [],
      identificacion: access_pass.identificacion || [],
      email: access_pass.email || "",
      telefono: access_pass.telefono || "",
    },
    option: "create_access_pass",
    script_name: "pase_de_acceso.py",
  };

  const userJwt = localStorage.getItem("access_token");

  const response = await fetch(
    `https://app.linkaform.com/api/infosync/scripts/run/`,
    {
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