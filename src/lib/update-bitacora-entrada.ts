import { Equipo_bitacora, Vehiculo_bitacora } from "@/components/table/bitacoras/bitacoras-columns";
import { Equipo, Imagen, Vehiculo } from "./update-pass";

export type Access_pass_update_full = {
    equipo: Vehiculo_bitacora[],
    vehiculo: Equipo_bitacora[],
    status_pase: string,
    walkin_fotografia:Imagen[],
    walkin_identificacion: Imagen[]

}
  interface updatePase {
    equipo? : Equipo_bitacora[]| Equipo[]| null,
    vehiculo? : Vehiculo_bitacora[]| Vehiculo[]| null,
    id: string,
  }
  
  interface Payload {
    option: string;
    script_name: string;
    record_id: string;
    equipo?: Equipo_bitacora[]| Equipo[]| null;  
    vehiculo?: Vehiculo_bitacora[]| Vehiculo[]| null; 
  }

  export const UpdateBitacora = async ({
    equipo,
    vehiculo,
    id,
  }: updatePase) => {
    if(equipo || vehiculo){
    const payload : Payload = {
        option: "update_bitacora_entrada_many",
        script_name:"script_turnos.py",
        record_id: id,
    };

    if(equipo){
      payload.equipo= equipo
    }

    if(vehiculo){
      payload.vehiculo= vehiculo
    }
    
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
  }
  };