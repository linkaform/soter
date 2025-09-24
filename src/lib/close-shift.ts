import { Imagen } from "./update-pass-full";


interface Props {
    area?: string;
    location?: string;
    checkin_id?: string
    fotografia?:Imagen[]
  }
  
  export const closeShift = async ({
    area = "Caseta Principal",
    location = "Planta Monterrey",
    checkin_id,
    fotografia
  }: Props) => {
    const payload = {
      area,
      location,
      checkin_id, 
      fotografia,
      option: "checkout",
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
  