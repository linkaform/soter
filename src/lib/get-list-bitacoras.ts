  export const getListBitacora = async (
    location:string, area:string,prioridades:string[]) => {
    const payload = {
        area:area,
        location: location,
        prioridades:prioridades,
        option: "list_bitacora",
        script_name: "script_turnos.py",
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
  