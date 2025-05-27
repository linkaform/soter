import { Imagen } from "./update-pass"

export interface Contacto {
  empresa: string | null
  fotografia: Imagen[]| null
  identificacion: Imagen[] | null
  nombre: string | null
  telefono: string| null
  email: string| null
  etsatus?:string
}

export const getUserContacts = async () => {
    const payload = {
      option: "get_user_contacts",
      script_name: "pase_de_acceso.py",
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
  