export const crearIncidenciaRondin = async (rondin_data: any)=> {
    const payload = {
        rondin_data,
        option: "create_incidencia_by_rondin",
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
  
    const res = await response.json();
    return res;
  };
    
  export const getListIncidenciasRondin = async (ubicacion: string, area:string)=> {
    const payload = {
        ubicacion,
        area,
        option: "get_incidencias_rondines",
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
    
  export const getListBitacoraRondines = async (location: string, nombre_rondin?: string, year?:number ,month?:number)=> {
    const payload = {
        option: "get_bitacora_rondines",
        script_name: "rondines.py",
        ubicacion: location,
        nombre_rondin: nombre_rondin,
        year,
        month
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
    
  export const playOrPauseRondin = async (record_id: string,paused:boolean )=> {
    const payload = {
        record_id,
        paused,
        option: "pause_or_play_rondin",
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
  
    const res = await response.json();
    return res;
  };
  export const getCheckById = async (record_id:string)=> {
    const payload = {
        record_id,
        option: "get_check_by_id",
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