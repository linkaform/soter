import { Imagen } from "./update-pass"

export interface InputArticuloConcesionados {
    area_Concesionados:string,
    articulo_Concesionados: string,
    articulo_seleccion: string,
    color_Concesionados: string,
    comentario_Concesionados: string,
    date_hallazgo_Concesionados: string,
    descripcion: string,
    estatus_Concesionados: string,
    foto_Concesionados: Imagen[],
    locker_Concesionados:string,
    quien_entrega: string,
    quien_entrega_externo: string,
    quien_entrega_interno: string,
    tipo_articulo_Concesionados: string,
    ubicacion_Concesionados:string,
}

export interface InputDevolver {
    estatus_Concesionados: string,
    foto_recibe_Concesionados: Imagen[],
    identificacion_recibe_Concesionados:string,
    recibe_Concesionados: string,
    telefono_recibe_Concesionados: string,
}
  
export const getListArticulosConcesionados = async (
    location:string,status:string) => {
    const payload = {
        location: location,
        status:status,
        option: "get_articles",
        script_name: "articulos_concesionadoss.py",
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

export const getTipoArticulo = async (tipo:string) => {
    const payload = {
        tipo,
        option: "catalogo_tipo_articulo",
        script_name: "articulos_concesionadoss.py",
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

export const crearArticuloConcesionados = async (data_article: InputArticuloConcesionados | null)=> {
    const payload = {
        data_article,
        option: "nuevo_articulo",
        script_name: "articulos_concesionadoss.py",
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

export const editarArticuloConcesionados = async (data_article_update: InputArticuloConcesionados | InputDevolver, folio:string)=> {
    const payload = {
        option: "update_article",
        script_name: "articulos_concesionadoss.py",
        data_article_update,
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