export interface InputArticuloCon {
    status_concesion:string,
    ubicacion_concesion:string,
    solicita_concesion:string,
    persona_nombre_concesion:string,
    caseta_concesion:string,
    fecha_concesion:string,
    area_concesion:string,
    equipo_concesion:string,
    observacion_concesion:string,
}
export interface InputOutArticuloCon {
    fecha_devolucion_concesion:string,
    status_concesion:string
}


export const getListArticulosCon = async (location:string, area:string,status:string,date1:string, date2:string, filterDate:string) => {
    const payload = {
        dateFrom:date1,
        dateTo: date2, 
        filterDate,
        status:"",
        location:"",
        area:"",
        option: "get_articles",
        script_name: "articulos_consecionados.py",
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

export const getTipoConcesion = async (location:string, tipo:string) => {
    const payload = {
        location,
        tipo,
        option: "catalogo_tipo_concesion",
        script_name: "articulos_consecionados.py",
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

export const crearArticuloCon = async (data_article: InputArticuloCon | null)=> {
    const payload = {
        data_article,
        option: "new_article",
        script_name: "articulos_consecionados.py",
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

export const editarArticuloCon = async (data_article_update: InputArticuloCon | InputOutArticuloCon, folio:string)=> {
    const payload = {
        option: "update_article",
        script_name: "articulos_consecionados.py",
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
