export type data_sms={
    mensaje: string,
    numero: string,
}
export const sendSMS= async (account_id: number, envio: string[],data_cel_msj:data_sms|null, folio:string) => {
  if(data_cel_msj!==null){
    const payload = {
      script_name: "pase_de_acceso_use_api.py",
      option: "enviar_msj",
      envio:envio,
      account_id:account_id,
      data_cel_msj: data_cel_msj,
      folio
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
  };