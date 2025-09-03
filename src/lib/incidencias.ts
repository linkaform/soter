// import { Imagen } from "./update-pass";

import { Imagen } from "./update-pass-full";

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

  export const getCatIncidencias = async (categoria:string, subCategoria:string) => {
    const payload = {
        cat:categoria,
        sub_cat: subCategoria,
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
  
export interface Depositos {
    tipo_deposito: string,
    origen: string,
	cantidad: number
}

export interface AccionesTomadas {
    acciones_tomadas:string,
    llamo_a_policia:string
    autoridad:string,
    numero_folio_referencia:string,
    responsable:string
}
export interface PersonasInvolucradas {
    nombre_completo:string,
    rol:string,
    sexo:string,
    grupo_etario:string
    atencion_medica:string
    retenido:string
    comentarios:string
}

export interface Seguimientos {
    accion_correctiva_incidencia: "",
    incidencia_personas_involucradas: "",
    fecha_inicio_seg: "",
    incidencia_documento_solucion: [],
    incidencia_evidencia_solucion: []
}

export interface AfectacionPatrimonial{
    tipo_afectacion:string
    monto_estimado:string
    duracion_estimada:string
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

    // reporta_incidencia: string,
    // fecha_hora_incidencia:string,
    // ubicacion_incidencia:string,
    // area_incidencia: string,
    // incidencia:string,
    // comentario_incidencia: string,
    // tipo_dano_incidencia: string,
    // dano_incidencia:string,
    // evidencia_incidencia: any,
    // documento_incidencia:any,
    // prioridad_incidencia:string,
    // notificacion_incidencia:string,
    // datos_deposito_incidencia: any,
    // tags:string[],
    // categoria:string,
    // sub_categoria:string,
    // incidente:string,

    // nombre_completo_persona_extraviada?:string | undefined,
    // edad?:string | undefined,
    // color_piel?:string,
    // color_cabello?:string,
    // estatura_aproximada?:string,
    // descripcion_fisica_vestimenta?:string,
    // nombre_completo_responsable?:string,
    // parentesco?:string,
    // num_doc_identidad?:string,
    // telefono?:string,
    // info_coincide_con_videos?:string,
    // responsable_que_entrega?:string,
    // responsable_que_recibe?:string,

    // //Grupos repetitivos
    // afectacion_patrimonial_incidencia:AfectacionPatrimonial,
    // personas_involucradas_incidencia: PersonasInvolucradas,
    // acciones_tomadas_incidencia:AccionesTomadas,
    // seguimientos_incidencia:any,

    // //Robo de cableado
    // valor_estimado?:string,
    // pertenencias_sustraidas?:string,
    // //robo de vehiculo
    // placas?:string,
    // tipo?:string,
    // marca?:string,
    // modelo?:string,
    // color?:string,
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

export const crearSeguimientoIncidencia = async (seguimientos_incidencia: [], folio: string, cerrar_falla?:string) => {
    const payload = {
        seguimientos_incidencia,
        folio,
        cerrar_falla:cerrar_falla,
        option: "update_incidence_seguimiento",
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