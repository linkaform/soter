import { Imagen } from "./update-pass-full";

interface GetShiftParams {
  area?: string;
  location?: string;
  employee_list?: { user_id: number; name: string }[]; 
  fotografia?:Imagen[];
}

  export const startShift = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
    employee_list = [],
    fotografia= []

  }: GetShiftParams = {}) => {
    const payload = {
      area,
      location,
      option: "checkin",
      script_name: "script_turnos.py",
      employee_list: employee_list ?? [],
      fotografia
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
  

