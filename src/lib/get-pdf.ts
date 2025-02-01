export const getPdf = async (account_id: number,qr_code:string|null) => {
    if(qr_code!==null){
    const payload = {
      script_name: "pase_de_acceso_use_api.py",
      option: "get_pdf",
      qr_code:qr_code,
      account_id:account_id,
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