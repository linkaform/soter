import { Imagen } from "./update-pass"

export interface inputFalla {
    falla:string,
    falla_caseta: string,
    falla_comentarios: string,
    falla_documento: Imagen[],
    falla_estatus: string,
    falla_evidencia: Imagen[],
    falla_fecha_hora: string,
    falla_objeto_afectado: string,
    falla_reporta_nombre: string,
    falla_responsable_solucionar_nombre:string,
    falla_ubicacion: string

}

export const updateFalla = async (data_failure_update: inputFalla | null, folio:string)=> {
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 