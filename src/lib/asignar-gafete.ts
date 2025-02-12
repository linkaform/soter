export type dataGafetParamas = {
    // status_gafete: "asignar_gafete",
    // ubicacion_gafete: string,
    // caseta_gafete: string,
    // visita_gafete: string,
    // id_gafete: string,
    // documento_gafete:string[],
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 