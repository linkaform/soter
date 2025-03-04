import { Imagen } from "./update-pass"

export interface inputSeguimientoFalla {
    falla_comentario_solucion:string,
    falla_documento_solucion: Imagen[],
    falla_evidencia_solucion:Imagen[],
    fechaFinFallaCompleta: string,
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
      