import { Imagen } from "./update-pass"

export interface InputPaqueteria {
    ubicacion_paqueteria:string,
    area_paqueteria: string,
    fotografia_paqueteria: Imagen[],
    descripcion_paqueteria: string,
    quien_recibe_paqueteria: string,
    guardado_en_paqueteria: string,
    fecha_recibido_paqueteria: string,
    fecha_entregado_paqueteria: string,
    estatus_paqueteria: string,
    entregado_a_paqueteria:string,
    proveedor:string
}

export interface InputPaqueteriaDevolver {
    estatus_paqueteria: string,
    fecha_recibido_paqueteria: Imagen[],
    entregado_a_paqueteria:string,
}
  
export const getListPaqueteria  = async (
    location:string,status:string, area:string) => {
    const payload = {
        location: location,
        area,
        status:status,
        option: "get_paquetes",
        script_name: "paqueteria.py",
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

export const crearPaqueteria  = async (data_paquete: InputPaqueteria  | null)=> {
    const payload = {
        data_paquete,
        option: "nuevo_paquete",
        script_name: "paqueteria.py",
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

export const editarPaqueteria  = async (data_paquete_actualizar: InputPaqueteria  | InputPaqueteriaDevolver, folio:string)=> {
    const payload = {
        option: "actualizar_paquete",
        script_name: "paqueteria.py",
        data_paquete_actualizar,
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