export const getCatalogoFallas = async (tipo:string) => {
    const payload = {
        tipo,
        option: "catalogo_fallas",
        script_name: "fallas.py",
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