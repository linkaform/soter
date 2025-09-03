export const getPdfIncidencias = async (qr_code:string, template_id:number|null, account_id:number) => {
    const payload = {
      script_name: "pase_de_acceso_use_api.py",
      option: "get_pdf",
      qr_code:qr_code,
      template_id,
      account_id
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
}