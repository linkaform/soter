import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Equipo_bitacora, Vehiculo_bitacora } from "@/components/table/bitacoras/bitacoras-columns"
import { Equipo, Vehiculo } from "./update-pass"
import { toast } from "sonner"


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

export function reemplazarGuionMinuscula(str:string) {
  return str.replace(/_/g, ' ').toLowerCase();
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

// export function sweetAlert(icon="success", title:string, text:string ,color=blue500){
//   Swal.fire({
//     icon: icon,
//     title:title,
//     text: text,
//     confirmButtonColor:color,
//   });
// }


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

export function errorMsj(data:any, title = "Error", type="warning"){
	if (data.hasOwnProperty("error")){
		let res=undefined
			const error= data.error
			if(error.hasOwnProperty('msg')){
				if(typeof error.msg ==='string'){
					res= {title: title, text: error.msg, type}
				}else{
					res= {title: error.msg.title, text: error.msg.msg, type:error.msg.type}
				}
			}else{
				res= {title: title, text: error, type: type}
			}
			return res
  	}
  	if (data.hasOwnProperty("json")){
      const errores=[]
      for(const err in data.json){
           if(data.json[err].hasOwnProperty('label')){
              errores.push(data.json[err].label+': '+data.json[err].msg[0]+" ")
          }else {
               const subData = data.json[err];
               if (typeof subData === 'object' && subData !== null) {
                   for (const subKey in subData) {
                       const subItem = subData[subKey];
                       if (subItem && subItem.hasOwnProperty('label') && subItem.hasOwnProperty('msg')) {
                           errores.push(subItem.label + ': ' + subItem.msg + " ");
                       }
                   }
               }
          }
      }
      return {title: title, text:errores.join(", "), type}
  	}
	if (data.response.data.hasOwnProperty("json")){
        const dataInner=data.response.data
        const errores=[]
        for(const err in dataInner.json){
            if(dataInner.json[err].hasOwnProperty('label') ){
                errores.push(dataInner.json[err].label+': '+dataInner.json[err].msg[0]+" ")
            }else {
                 const subData = dataInner.json[err];
                 if (typeof subData === 'object' && subData !== null) {
                     for (const subKey in subData) {
                      if(subKey!== "group"){
                        const subItem = subData[subKey];
                        for(const subSubKey in subItem){
                          if (typeof subItem[subSubKey] === 'object' && subItem[subSubKey] !== null) {
                            const subSubItem=subItem[subSubKey]
                            if (subSubItem.hasOwnProperty('label') && subSubItem.hasOwnProperty('msg')) {
                              errores.push(subSubItem.label + ': ' + subSubItem.msg[0] + " ");
                            }
                          }
                        }
                        
                      }
                     }
                 }
            }
        }
        return {title: title, text:errores.join(", "), type}
  	}
   if (typeof data ==='string'){
      return {title: title, text: data, type: type}
  	}
  return undefined
}

export const catalogoFechas = () => {
  return [
    {label:"Hoy", key:"today"},
    {label:"Ayer", key:"yesterday"},
    {label:"Esta semana", key:"this_week"},
    {label:"Semana pasada", key:"last_week"},
    {label:"Últimos 15 días", key:"last_fifteen_days"},
    {label:"Este mes", key:"this_month"},
    {label:"Mes pasado", key:"last_month"},
    {label:"Este año", key:"this_year"},
    // {label:"Últimos 30 días", key:""},
    {label:"Personalizado", key:"range"},
  ];
};

export function obtenerFechas(rango:string) {
  const hoy = new Date();

  switch (rango) {
    case "Hoy":
      return [hoy, hoy];

    case "Ayer":
      const ayer = new Date(hoy);
      ayer.setDate(hoy.getDate() - 1);
      return [ayer, ayer];

    case "Esta semana":
      const inicioSemana = new Date(hoy);
      inicioSemana.setDate(hoy.getDate() - hoy.getDay()); // Lunes de esta semana
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(inicioSemana.getDate() + 6); // Domingo de esta semana
      return [inicioSemana, finSemana];

    case "Semana pasada":
      const inicioSemanaPasada = new Date(hoy);
      inicioSemanaPasada.setDate(hoy.getDate() - hoy.getDay() - 7); // Lunes de la semana pasada
      const finSemanaPasada = new Date(inicioSemanaPasada);
      finSemanaPasada.setDate(inicioSemanaPasada.getDate() + 6); // Domingo de la semana pasada
      return [inicioSemanaPasada, finSemanaPasada];

    case "Este mes":
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // Primer día del mes
      const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0); // Último día del mes
      return [inicioMes, finMes];

    case "Mes pasado":
      const inicioMesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1); // Primer día del mes pasado
      const finMesPasado = new Date(hoy.getFullYear(), hoy.getMonth(), 0); // Último día del mes pasado
      return [inicioMesPasado, finMesPasado];

    case "Últimos 7 días":
      const hace7Dias = new Date(hoy);
      hace7Dias.setDate(hoy.getDate() - 7);
      return [hace7Dias, hoy];

    case "Últimos 30 días":
      const hace30Dias = new Date(hoy);
      hace30Dias.setDate(hoy.getDate() - 30);
      return [hace30Dias, hoy];

    case "Personalizado":
      // Aquí puedes dejar espacio para que el usuario ingrese un rango personalizado.
      return [null, null]; // Esto sería solo un ejemplo, ya que el rango sería proporcionado por el usuario.

    default:
      return [null, null];
  }
}



export const dateToString = (fecha:Date) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por eso se suma 1
  const day = String(fecha.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
  };


export function formatDateToText(dateString: string): string {
  const date = new Date(dateString);
  const hasSeconds = dateString.includes(':') && dateString.split(':').length === 3;
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  };
  if (hasSeconds) {
    options.second = '2-digit'; 
  }
  return date.toLocaleString('es-ES', options);
}

export function formatCurrency(number:number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(number);
}


type Column = {
  label: string; 
  key: string; 
};

export const downloadCSV = (data: any[], columns: Column[], fileName: string = 'data.csv') => {
  if(data.length > 0){
    console.log("DATAA", data)
    const header = columns.map(col => col.label);
    const rows = data.map(row => 
      columns.map(col => row[col.key]) 
    );
    const csvContent = [header, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("¡Archivo CSV descargado correctamente!")
  }else{
    toast.error("¡Seleciona al menos un registro para descargar!")
  }

};