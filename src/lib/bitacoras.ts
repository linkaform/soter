export const getListBitacora = async (
    location:string, area:string,prioridades:string[], date1:string, date2:string) => {
    const payload = {
        dateFrom : date1, 
        dateTo : date2,
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

  export const doOut = async (qr_code:string, location:string, area:string)=> {
    const payload = {
        qr_code: qr_code,
        location:location,
        area:area,
        option: "do_out",
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

  export type dataGafetParamas = {
    locker_id:string,
    gafete_id:string,
    documento:string,
    status_gafete:string,
    ubicacion:string,
    area:string
  }

export const asignarGafete = async (data_gafete: dataGafetParamas | null, id_bitacora:string | null , tipo_movimiento:string | null)=> {
    const payload = {
        data_gafete: data_gafete,
        id_bitacora:id_bitacora,
        tipo_movimiento:tipo_movimiento,
        option: "assing_gafete",
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
       