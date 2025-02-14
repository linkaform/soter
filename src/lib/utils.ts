import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Swal from 'sweetalert2'
import { Equipo_bitacora, Vehiculo_bitacora } from "@/components/table/bitacoras/bitacoras-columns"
import { Equipo, Vehiculo } from "./update-pass"

const blue500="#2b7fff"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export function capitalizeOnlyFirstLetter(text:string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const formatFecha = (fecha: string | undefined) => {
  if (!fecha) return "";  
  return fecha.replace("T", " "); 
};

export function catalogoColores() {
  return  ["Amarillo", "Azul", "Beige", "Blanco", "Cafe", "Crema", "Dorado", "Gris", 
    "Morado", "Naranja","Negro", "Plateado", "Rojo", "Rosa", "Verde", "Violeta", "Otro"]
}

export function catalogoTipoEquipos() {
  return  ["Herramienta", "Computo", "Tablet", "Otra"];
}

export function base64ToFile(image: string, name:string){
  const byteString = atob(image.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const buffer = new Blob([ab], {
    type: 'image/jpeg', 
  });

  const file = new File([buffer], `${name}.jpg`, {
    type: 'image/jpeg',
  });

  return file;
}

export function fileToBase64(file:File):Promise<string | null>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file); 
  });
}

export function quitarAcentosYMinusculasYEspacios(str: string) {
  const noAcentos = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const lower = noAcentos.toLowerCase();
  const sinEspacios = lower.replace(/\s+/g, '_');
  return sinEspacios;
}

export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
  const day = date.getDate().toString().padStart(2, '0'); 
  const hours = date.getHours().toString().padStart(2, '0'); 
  const minutes = date.getMinutes().toString().padStart(2, '0'); 
  const seconds = date.getSeconds().toString().padStart(2, '0'); 
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export function capitalizeOnlyFirstLetterDelete_(text: string) {
  const textWithSpaces = text.replace(/_/g, ' ');
  return textWithSpaces.charAt(0).toUpperCase() + textWithSpaces.slice(1).toLowerCase();
}

export function sweetAlert(icon="success", title:string, text:string ,color=blue500){
  Swal.fire({
    icon: icon,
    title:title,
    text: text,
    confirmButtonColor:color,
  });
}


export function replaceNullsInArrayDynamic(arr: any[]): any[] {
  return arr.map(obj => {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] === null) {
        newObj[key] = ""; 
      } else {
        newObj[key] = obj[key]; 
      }
    }
    return newObj;
  });
}

export function formatVehiculos(arr: Vehiculo_bitacora[]): Vehiculo[] {
  return arr.map(item => ({
    tipo: item.tipo, 
    marca: item.marca_vehiculo, 
    modelo: item.modelo_vehiculo, 
    estado: item.nombre_estado, 
    placas: item.placas, 
    color: item.color
  }));
}

export function formatEquipos(arr: Equipo_bitacora[]): Equipo[] {
  return arr.map(item => ({
    color: item.color_articulo, 
    serie: item.numero_serie, 
    modelo: item.modelo_articulo, 
    marca: item.marca_articulo, 
    tipo: item.tipo_equipo, 
    nombre: item.nombre_articulo
  }));
}

export function formatVehiculosToBitacora(arr: Vehiculo []): Vehiculo_bitacora[] {
  return arr.map(item => ({
    tipo: item.tipo, 
    marca_vehiculo: item.marca, 
    modelo_vehiculo: item.modelo, 
    nombre_estado: item.estado, 
    placas: item.placas, 
    color: item.color
  }));
}

export function formatEquiposToBitacora(arr:Equipo[]): Equipo_bitacora[] {
  return arr.map(item => ({
    color_articulo: item.color, 
    numero_serie: item.serie, 
    modelo_articulo: item.modelo, 
    marca_articulo: item.marca, 
    tipo_equipo: item.tipo, 
    nombre_articulo: item.nombre
  }));
}




export function errorAlert(data:any, title = "Error", type="warning"){
  if(data.hasOwnProperty("json")){
    const errores=[]
      for(const err in data.json){
           if(data.json[err].hasOwnProperty('label')){
              errores.push(data.json[err].label+': '+data.json[err].msg+" ")
          }else {
              for (const subKey in err as unknown as { [key: string]: any }){
                  for(const subKey2 in data.json[err][subKey]){
                      errores.push(data.json[err][subKey][subKey2].label+': '+data.json[err][subKey][subKey2].msg+" ")
                  }
              }
          }
      }
      Swal.fire({
          title: title,
          text: errores.flat(),
          type: "warning"
      });
  }else if (data.hasOwnProperty("error")){
    const error= data.error
      if(error.hasOwnProperty('msg')){
          if(typeof error.msg ==='string'){
              Swal.fire({
                  title: title,
                  text: error.msg,
                  type: "warning"
              });
          }else{
              Swal.fire({
                  title: error.msg.title,
                  text: error.msg.msg,
                  type: error.msg.type
              });
          }
      }else{
          Swal.fire({
              title: title,
              text: error,
              type: type
          });
      }
  }else if (typeof data ==='string'){
      Swal.fire({
          title: title,
          text: data,
          type: type
      });
  }
}


export function renameKeyTipoComentario(array:any) {
  return array.map((item: { [x: string]: any; tipo_de_comentario: any }) => {
    // Crear una copia del objeto con el key renombrado
    const { tipo_de_comentario, ...rest } = item;
    return {
      ...rest,
      tipo_comentario: tipo_de_comentario, // Renombrar la clave
    };
  });
}

