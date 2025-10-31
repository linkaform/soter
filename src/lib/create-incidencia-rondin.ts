export const crearIncidenciaRondin = async (data_incidence: any)=> {
    const payload = {
        data_incidence,
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
  
    const data = await response.json();
    return data;
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
    
  