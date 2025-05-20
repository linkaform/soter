import { Access_pass, enviar_pre_sms } from "@/hooks/useCreateAccessPass";
  
  interface CreatePase {
    access_pass : Access_pass|null,
    location: string,
    enviar_pre_sms: enviar_pre_sms|null,
  }
  
  export const createPase = async ({
    access_pass,
    location,
    enviar_pre_sms
  }: CreatePase) => {
    if(access_pass!==null && enviar_pre_sms!==null){
      const payload = {
        access_pass,
        location,
        enviar_pre_sms,
        option: "create_access_pass",
        script_name: "pase_de_acceso.py",
      };
    
      if(access_pass.telefono=="") payload.access_pass.telefono= access_pass.telefono
      if(access_pass.comentarios){
        if (access_pass.comentarios.length >0 )payload.access_pass.comentarios = access_pass.comentarios
      }else{
        delete access_pass.comentarios
      }
      if(access_pass.areas){
        if(access_pass.areas.length>0)payload.access_pass.areas = access_pass.areas
      }else{
        delete access_pass.areas
      }
      if(access_pass.tipo_visita_pase !== "")payload.access_pass.tipo_visita_pase= access_pass.tipo_visita_pase
      if(access_pass.fecha_desde_visita !== "")payload.access_pass.fecha_desde_visita= access_pass.fecha_desde_visita
      if(access_pass.fecha_desde_hasta!== "")payload.access_pass.fecha_desde_hasta= access_pass.fecha_desde_hasta
      if(access_pass.config_dia_de_acceso!== "")payload.access_pass.config_dia_de_acceso= access_pass.config_dia_de_acceso
      if(access_pass.config_dias_acceso){
        if(access_pass.config_dias_acceso?.length>0) payload.access_pass.config_dias_acceso = access_pass.config_dias_acceso
      }else{
        delete access_pass.config_dias_acceso
      }
         
      
      if(access_pass.enviar_correo_pre_registro){
        if(access_pass.enviar_correo_pre_registro?.length>0)access_pass.enviar_correo_pre_registro = payload.access_pass.enviar_correo_pre_registro
      }else{
        delete access_pass.enviar_correo_pre_registro
      }
  
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
    }else{
      return console.error("Se recibieron datos nulos en access_pass y/p enviar_pre_sms")
    }
    
  };