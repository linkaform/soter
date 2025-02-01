export type data_correo={
    email_to: string,
    asunto: string,
    email_from: string,
    nombre: string,
    nombre_organizador: string,
    ubicacion: string,
    fecha: {desde: string, hasta: string},
    descripcion: string,
}
export const sendCorreo = async (account_id: number, envio: string[],data_for_msj:data_correo|null, folio:string) => {
    if(data_for_msj!==null){
    const payload = {
      script_name: "pase_de_acceso_use_api.py",
      option: "enviar_correo",
      envio:envio,
      account_id:account_id,
      data_msj: data_for_msj,
      folio:folio
    };
  
      const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json(); 
      return data 
  }else{
    return console.error("Se recibieron datos nulos en access_pass y/p enviar_pre_sms")
  }
}