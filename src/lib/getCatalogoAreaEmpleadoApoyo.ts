export const getCatalogoAreaEmpleadoApoyo = async () => {
    const payload = {
        option: "catalogo_area_empleado_apoyo",
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