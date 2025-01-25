
export const getCatalogosPaseNoJwt = async (account_id:number, qr_code:string
) => {
    const payload = {
        account_id,
        qr_code,
        script_name: "pase_de_acceso_use_api.py",
        option: "catalogos_pase_no_jwt",
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
  };
