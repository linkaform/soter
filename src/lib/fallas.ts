import { Imagen } from "./update-pass"

export interface InputFalla {
    falla?:string,
    falla_caseta?: string,
    falla_comentarios?: string,
    falla_documento?: Imagen[],
    falla_estatus?: string,
    falla_evidencia?: Imagen[],
    falla_fecha_hora?: string,
    falla_objeto_afectado?: string,
    falla_reporta_nombre?: string,
    falla_responsable_solucionar_nombre?:string,
    falla_ubicacion?: string
}

  
export const getListFallas = async (
    location:string, area:string,status:string) => {
    const payload = {
        area:area,
        location: location,
        status:status,
        option: "get_failures",
        script_name: "fallas.py",
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

export const crearFalla = async (data_failure: InputFalla | null)=> {
    const payload = {
        data_failure:data_failure,
        option: "new_failure",
        script_name: "fallas.py",
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

export const updateFalla = async (data_failure_update: InputFalla | null, folio:string)=> {
    const payload = {
        option: "update_failure",
        script_name: "fallas.py",
        data_failure_update: data_failure_update,
        folio: folio
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  export const deleteFalla= async (folio: string[])=> {
    const payload = {
        folio,
        option: "delete_failure",
        script_name: "fallas.py",
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

  export interface inputSeguimientoFalla {
    falla_documento_solucion: Imagen[],
    falla_evidencia_solucion:Imagen[],
    // fechaFinFallaCompleta: string,
    fechaInicioFallaCompleta: string,
    falla_folio_accion_correctiva: string,
}

export const crearSeguimientoFalla = async (falla_grupo_seguimiento: inputSeguimientoFalla | null, folio:string, location:string, area:string, status:string)=> {
    const payload = {
        folio:folio,
        location,
        area,
        falla_grupo_seguimiento,
        status,
        option: "update_failure_seguimiento",
        script_name: "fallas.py",
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
      
  export const getCatalogoFallas = async (tipo:string) => {
    const payload = {
        tipo,
        option: "catalogo_fallas",
        script_name: "fallas.py",
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