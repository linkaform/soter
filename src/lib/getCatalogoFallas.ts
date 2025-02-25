export const getCatalogoFallas = async () => {
    const payload = {
        option: "catalogo_fallas",
        script_name: "fallas.py",
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