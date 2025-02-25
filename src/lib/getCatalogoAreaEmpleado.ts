export const getCatalogoAreaEmpleado = async () => {
    const payload = {
        option: "catalogo_area_empleado",
        script_name: "incidencias.py",
    };
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    console.log("que pasa", data)
    return data;
  };