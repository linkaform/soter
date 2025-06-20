  export const getCatalogoEstados = async (account_id:number) => {
    const payload = {
        account_id,
        option: "catalago_estados",
        script_name: "pase_de_acceso_use_api.py",
    };
  
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