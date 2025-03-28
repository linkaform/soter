import { Imagen } from "./update-pass"

export interface InputArticuloPerdido {
    area_perdido:string,
    articulo_perdido: string,
    articulo_seleccion: string,
    color_perdido: string,
    comentario_perdido: string,
    date_hallazgo_perdido: string,
    descripcion: string,
    estatus_perdido: string,
    foto_perdido: Imagen[],
    locker_perdido:string,
    quien_entrega: string,
    quien_entrega_externo: string,
    quien_entrega_interno: string,
    tipo_articulo_perdido: string,
    ubicacion_perdido:string,
}

export interface InputDevolver {
    estatus_perdido: string,
    foto_recibe_perdido: Imagen[],
    identificacion_recibe_perdido:Imagen[],
    recibe_perdido: string,
    telefono_recibe_perdido	: string,
}
  
export const getListArticulosPerdidos = async (
    location:string,status:string) => {
    const payload = {
        location: location,
        status:status,
        option: "get_articles",
        script_name: "articulos_perdidos.py",
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
        script_name: "articulos_perdidos.py",
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

export const crearArticuloPerdido = async (data_article: InputArticuloPerdido | null)=> {
    const payload = {
        data_article,
        option: "nuevo_articulo",
        script_name: "articulos_perdidos.py",
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

export const editarArticuloPerdido = async (data_article_update: InputArticuloPerdido | InputDevolver, folio:string)=> {
    const payload = {
        option: "update_article",
        script_name: "articulos_perdidos.py",
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
//   export const devolverArticuloPerdido= async (data_article_update: InputDevolver, folio: string)=> {
//     const payload = {
//         folio,
//         data_article_update,
//         option: "update_articke",
//         script_name: "fallas.py",
//     };
  
//     const userJwt = localStorage.getItem("access_token"); 
//     const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${userJwt}`,
//         },
//         body: JSON.stringify(payload),
//     });
  
//     const data = await response.json();
//     return data;
//   };
