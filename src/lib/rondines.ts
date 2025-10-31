export interface InputCrearRondin {
    fecha_hora_programada_rondin: string,
    fecha_hora_inicio_rondin: string,
    fecha_hora_fin_rondin: string,
    estatus_recorrido: string,
    recorrido: string,
    areas_recorrido: string,
    incidencias: string,
    duracion_recorrido_minutos: string,
    motivo_cancelacion: string,
}

export interface InputCrearRondinCompleto{
    nombre_rondin: string,
    duracion_estimada:string,
    ubicacion: string,
    areas: string[],
    grupo_asignado: string,
    fecha_hora_programada: string,
    programar_anticipacion: string,
    cuanto_tiempo_de_anticipacio: string,
    cuanto_tiempo_de_anticipacion_expresado_en: string,
    tiempo_para_ejecutar_tarea: number,
    tiempo_para_ejecutar_tarea_expresado_en: string,
    la_tarea_es_de: string,
    se_repite_cada: string,
    sucede_cada: string,
    sucede_recurrencia: string[],
    en_que_minuto_sucede:string,
    cada_cuantos_minutos_se_repite:string,
    en_que_hora_sucede:string,
    cada_cuantas_horas_se_repite:string,
    que_dias_de_la_semana: string[],
    en_que_semana_sucede:string,
    que_dia_del_mes:string,
    cada_cuantos_dias_se_repite:string,
    en_que_mes:string,
    cada_cuantos_meses_se_repite:string,
    la_recurrencia_cuenta_con_fecha_final: string,
    fecha_final_recurrencia:string,
}

export interface InputEditarRondinCompleto{
    nombre_rondin?: string,
    duracion_estimada?:string,
    ubicacion?: string,
    areas?: string[],
    grupo_asignado?: string,
    fecha_hora_programada?: string,
    programar_anticipacion?: string,
    cuanto_tiempo_de_anticipacio?: string,
    cuanto_tiempo_de_anticipacion_expresado_en?: string,
    tiempo_para_ejecutar_tarea?: number,
    tiempo_para_ejecutar_tarea_expresado_en?: string,
    la_tarea_es_de?: string,
    se_repite_cada?: string,
    sucede_cada?: string,
    sucede_recurrencia?: string[],
    en_que_minuto_sucede?:string,
    cada_cuantos_minutos_se_repite?:string,
    en_que_hora_sucede?:string,
    cada_cuantas_horas_se_repite?:string,
    que_dias_de_la_semana?: string[],
    en_que_semana_sucede?:string,
    que_dia_del_mes?:string,
    cada_cuantos_dias_se_repite?:string,
    en_que_mes?:string,
    cada_cuantos_meses_se_repite?:string,
    la_recurrencia_cuenta_con_fecha_final?: string,
    fecha_final_recurrencia?:string,
}

export const getListRondin  = async (date1:string, date2:string, limit:number, offset:number ) => {
    const payload = {
        dateFom: date1,
        dateTo: date2,
        limit: limit,
        offset: offset,
        option: "get_rondines",
        script_name: "rondines.py",
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

  export const crearRondin = async (rondin_data: InputCrearRondinCompleto | null)=> {
    const payload = {
        rondin_data,
        option: "create_rondin",
        script_name: "rondines.py",
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

  export const editarRondin = async (folio:string ,rondin_data: InputEditarRondinCompleto | null)=> {
    const payload = {
        folio,
        rondin_data:rondin_data,
        option: "update_rondin",
        script_name: "rondines.py",
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

  export const deleteRondin= async (folio: string)=> {
    const payload = {
        folio,
        option: "delete_rondin",
        script_name: "rondines.py",
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

  export const catalogAreasRondin= async (ubicacion: string)=> {
    const payload = {
        ubicacion,
        option: "get_catalog_areas",
        script_name: "rondines.py",
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

  export const getRondinById= async (record_id: string)=> {
    const payload = {
        record_id,
        option: "get_rondin_by_id",
        script_name: "rondines.py",
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

export const getRondinesImages  = async (location: string, area: string, dateFrom:string, dateTo:string, limit:number, offset:number ) => {
    if (area == 'todas') area = '';
    const payload = {
        "ubicacion": location,
        area,
        "date_from": dateFrom,
        "date_to": dateTo,
        limit,
        offset,
        option: "get_rondines_images",
        script_name: "rondines.py",
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