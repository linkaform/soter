
interface GetShiftParams {
    area?: string;
    location?: string;
  }
  
  export const getShift = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
  }: GetShiftParams = {}) => {
    const payload = {
      area,
      location,
      option: "load_shift",
      script_name: "script_turnos.py",
    };
  
    const userJwt = localStorage.getItem("access_token"); 
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };
  

  export const getStats = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
    page = "Turnos",
  }) => {


    const payload = {
      area,
      location,
      page,
      option: "get_stats",
      script_name: "get_stats.py",
    };
  
    const userJwt = localStorage.getItem("access_token"); 
  
    const response = await fetch(`https://app.linkaform.com/api/infosync/scripts/run/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userJwt}`,
      },
      body: JSON.stringify(payload),
    });
  
    const data = await response.json();
    return data;
  };
  