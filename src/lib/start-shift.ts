
interface GetShiftParams {
    area?: string;
    location?: string;
  }
  
  export const startShift = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
  }: GetShiftParams = {}) => {
    const payload = {
      area,
      location,
      option: "checkin",
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
  