import { Imagen } from "./update-pass";

export const getListIncidencias = async (
    location:string, area:string,prioridades:string[], dateFrom:string, dateTo:string, filterDate:string) => {
    const payload = {
        dateFrom,
        dateTo,
        filterDate,
        area:area,
        location: location,
        prioridades:prioridades,
        option: "get_incidences",
        script_name: "incidencias.py",
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

  export const getCatIncidencias = async () => {
    const payload = {
        option: "catalogo_incidencias",
        script_name: "incidencias.py",
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
  
export interface AccionesTomadas {
    acciones_tomadas:string,
    responsable_accion:string
}
export interface PersonasInvolucradas {
    nombre_completo:string,
    tipo_persona:string
}
export interface Depositos {
    cantidad:number
    tipo_deposito:string
}

export interface InputIncidencia {
    reporta_incidencia: string,
    fecha_hora_incidencia:string,
    ubicacion_incidencia:string,
    area_incidencia: string,
    incidencia:string,
    comentario_incidencia: string,
    tipo_dano_incidencia?: string,
    dano_incidencia:string,
    personas_involucradas_incidencia: PersonasInvolucradas[],
    acciones_tomadas_incidencia: AccionesTomadas[],
    evidencia_incidencia:Imagen[],
    documento_incidencia:Imagen[],
    prioridad_incidencia:string,
    notificacion_incidencia:string,
    datos_deposito_incidencia?: Depositos[],
}

export const crearIncidencia = async (data_incidence: InputIncidencia | null)=> {
    const payload = {
        data_incidence,
        option: "nueva_incidencia",
        script_name: "incidencias.py",
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
    
  
  export const editarIncidencia = async (data_incidence_update: InputIncidencia | null, folio:string)=> {
    const payload = {
        data_incidence_update,
        folio,
        option: "update_incidence",
        script_name: "incidencias.py",
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
        
  export const deleteIncidencias= async (folio: string[])=> {
    const payload = {
        folio,
        option: "delete_incidence",
        script_name: "incidencias.py",
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