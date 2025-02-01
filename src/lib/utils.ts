import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Swal from 'sweetalert2'

const blue500="#2b7fff"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//Corta la primera letra y la convierte mayuscula
export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

//Convierte la primera letra en  mayuscula el resto minusculas
export function capitalizeOnlyFirstLetter(text:string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const formatFecha = (fecha: string | undefined) => {
  if (!fecha) return "";  // Si la fecha está vacía, no hacer nada
  return fecha.replace("T", " ");  // Reemplazar "T" por espacio
};

export function catalogoColores() {
  return  ["Amarillo", "Azul", "Beige", "Blanco", "Cafe", "Crema", "Dorado", "Gris", 
    "Morado", "Naranja","Negro", "Plateado", "Rojo", "Rosa", "Verde", "Violeta", "Otro"]
}

export function catalogoTipoEquipos() {
  return  ["Herramienta", "Computo", "Tablet", "Otra"];
}

export function base64ToFile(image: string, name:string){
  // Convertir base64 a ArrayBuffer
  const byteString = atob(image.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Crear un Blob a partir del ArrayBuffer
  const buffer = new Blob([ab], {
    type: 'image/jpeg', // Aquí puedes cambiar el tipo MIME según sea necesario
  });

  // Crear un archivo (File) a partir del Blob
  const file = new File([buffer], `${name}.jpg`, {
    type: 'image/jpeg', // Tipo MIME del archivo
  });

  return file;
}

export function fileToBase64(file:File):Promise<string | null>{
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      // Resolvemos la promesa con el resultado (base64)
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      // Si ocurre un error, rechazamos la promesa
      reject(error);
    };

    reader.readAsDataURL(file); // Inicia la lectura del archivo
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

export function sweetAlert(icon="success", title="Confirmación", text:string ,color=blue500){
  Swal.fire({
    icon: icon,
    title:title,
    text: text,
    confirmButtonColor:color,
  });
}