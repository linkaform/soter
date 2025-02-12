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
    walkin_identificacion: Imagen[]

}
  interface updatePase {
    access_pass : Access_pass_update |null,
    id: string,
    folio:string,
    location:string
  }
  
  export const UpdatePaseFull = async ({
    access_pass,
    id,
    folio,
    location
  }: updatePase) => {
    if(access_pass!==null){
    const payload = {
        script_name: "pase_de_acceso.py",
        option: 'update_full_pass',
        access_pass: access_pass,
        folio:folio,
        location,
        qr_code: id
    };
  
    if(access_pass.walkin_fotografia){
      if (access_pass.walkin_fotografia.length >0 )payload.access_pass.walkin_fotografia = access_pass.walkin_fotografia
    }else{
      delete access_pass.walkin_fotografia
    }
    if(access_pass.walkin_identificacion){
      if(access_pass.walkin_identificacion.length>0)payload.access_pass.walkin_identificacion = access_pass.walkin_identificacion
    }else{
      delete access_pass.walkin_identificacion
    }
    const userJwt = localStorage.getItem("access_token"); 
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userJwt}`,
        },
        body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  }
  };