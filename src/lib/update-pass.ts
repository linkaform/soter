import { Update_full_pass } from "@/hooks/usePaseEntrada"

export type Vehiculo ={
    tipo:string,
    marca:string,
    modelo:string,
    estado:string,
    placas:string,
    color:string
}

export type Equipo ={
    nombre:string,
    modelo:string,
    marca:string,
    color:string,
    tipo:string,
    serie:string ,
}

export type Imagen = {
    file_url:string,
    file_name:string
}

export type Access_pass_update = {
    grupo_vehiculos: Vehiculo[],
    grupo_equipos: Equipo[],
    status_pase: string,
    walkin_fotografia:Imagen[],
    walkin_identificacion: Imagen[],
    acepto_aviso_privacidad:string,
    acepto_aviso_datos_personales:string,
    conservar_datos_por:string

}
  interface updatePase {
    access_pass : Update_full_pass | Access_pass_update,
    id: string,
    account_id: number,
  }

  interface updatePaseEmailPhone {
    access_pass : mailPhone,
    id: string,
    account_id: number,
  }
  

  export type mailPhone = {
    email_pase?: string,
    telefono_pase?: string
}

  export const UpdatePase = async ({
    access_pass,
    id,
    account_id
  }: updatePase |updatePaseEmailPhone) => {
    const payload = {
        script_name: "pase_de_acceso_use_api.py",
        option: 'update_pass',
        access_pass: access_pass,
        folio:id,
        account_id
    };
  
    // if(access_pass.walkin_fotografia){
    //   if (access_pass.walkin_fotografia.length >0 )payload.access_pass.walkin_fotografia = access_pass.walkin_fotografia
    // }else{
    //   delete access_pass.walkin_fotografia
    // }
    // if(access_pass.walkin_identificacion){
    //   if(access_pass.walkin_identificacion.length>0)payload.access_pass.walkin_identificacion = access_pass.walkin_identificacion
    // }else{
    //   delete access_pass.walkin_identificacion
    // }

    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };