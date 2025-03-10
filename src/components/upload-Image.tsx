/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Imagen } from "@/lib/update-pass";
import { useUploadImage } from "@/hooks/useUploadImage";
import { Button } from "./ui/button";
import { Camera, Trash } from "lucide-react";
import Webcam from "react-webcam";
import { base64ToFile, fileToBase64, quitarAcentosYMinusculasYEspacios } from "@/lib/utils";
import Image from "next/image";

interface CalendarDaysProps {
  id: string;
  titulo: string; 
  setImg: Dispatch<SetStateAction<Imagen[]>>;
  showWebcamOption:boolean;
  facingMode: string
  setErrorImagen:Dispatch<SetStateAction<string>>;
//   imgArray:Imagen[];
//   showArray:boolean;
}


const LoadImage: React.FC<CalendarDaysProps>= ({id, titulo, setImg, showWebcamOption, facingMode,setErrorImagen})=> {
    const [selectedFile, setSelectedFile] = useState<File|null>(null);
    const [loading, setloading] = useState(false);
    const [loadingWebcam, setloadingWebcam] = useState(false);
    const [base64photo, setBase64Photo] = useState<string|"" >("")
    const [hideWebcam, setHideWebcam] = useState(true)
    const [hideButtonWebcam, setHideButtonWebcam] = useState(false)
    const { data, refetch, error} = useUploadImage(selectedFile);
    const webcamRef = useRef<Webcam | null>(null);
    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: facingMode
      };

    async function handleFileChange(event:any){
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const tipoMime = file.type;
            const extension = tipoMime.split('/')[1];
            const nuevoNombre = `${quitarAcentosYMinusculasYEspacios(id)}.${extension}`;
            const nuevoArchivo = new File([file], nuevoNombre, { type: file.type });
            setSelectedFile(nuevoArchivo)
            try {
              const base64 = await fileToBase64(file)||""; // Convertimos el archivo a base64
              setBase64Photo(base64); // Asignamos el valor base64 al estado
            } catch (error) {
              console.error('Error al convertir el archivo a base64:', error);
            }
            setHideWebcam(true)
            setHideButtonWebcam(true)
        }
    }

    function cleanPhoto(){
        setImg([])
        setBase64Photo("")
        setHideWebcam(true)
        setHideButtonWebcam(false)
        setloading(false)
        setErrorImagen("")
    }

    function takeAndSavePhoto(){
        const imageSrc = webcamRef.current?.getScreenshot() || "";
        setSelectedFile(base64ToFile(imageSrc, quitarAcentosYMinusculasYEspacios(id)))
        setBase64Photo(imageSrc)
        setHideWebcam(true)
        setHideButtonWebcam(true)   
    }

    useEffect(() => {
        setloading(true)
        if (selectedFile) {
            refetch(); 
        }
    }, [refetch, selectedFile]); 

    useEffect(()=>{
        if(data){
            if (data?.file_name?.includes(quitarAcentosYMinusculasYEspacios(id)) ) {
                setImg([data]); 
            }
        }
        setloading(false)
    }, [data])

    useEffect(()=>{
        setloading(false)
    }, [error])

    const handleUserMedia = () => {
        setloadingWebcam(false); 
      };

  return (
    <>
        <div className="grid   items-center gap-2">
            <div className="flex justify-start items-center">
                <Label htmlFor="picture" className="font-bold text-base">{titulo}</Label>
                    
                <div className="ml-3 flex justify-between gap-2">
                    <Button className="bg-yellow-500 rounded hover:bg-yellow-600 w-8 h-8"
                        onClick={cleanPhoto}>
                        <Trash  size={24} className="p-0 " />
                    </Button>
                    {showWebcamOption && !hideButtonWebcam ? (<>
                        {hideWebcam && 
                            <Button className="bg-blue-500 rounded hover:bg-blue-600 w-8 h-8"
                            onClick={() => {
                                setloadingWebcam(true)
                                setHideWebcam(false); 
                            }}>
                                <Camera  size={24} className="p-0" />
                            </Button>}
                        {!hideWebcam && !loadingWebcam?(
                            <>
                            <Button className="bg-green-600 rounded hover:bg-green-700 h-8"
                                onClick={takeAndSavePhoto}>
                                Tomar foto
                            </Button>
                            </>
                        ):null}
                    </>):null}
                </div>
            </div>

            {loading ? (<>
                <div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Cargando...</span>
                </div>

            </>): (<>
                { showWebcamOption && !hideWebcam ? (
                    <div>
                        {loadingWebcam? (<>
                            <div role="status">
                                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                            </div>
                        </>):null}
                        <Webcam 
                        ref={webcamRef}
                        audio={false} 
                        height={10} 
                        width={240} 
                        className="rounded" 
                        screenshotFormat="image/jpeg" 
                        mirrored={true} 
                        videoConstraints={videoConstraints}
                        onUserMediaError={handleUserMedia}
                        onUserMedia={handleUserMedia}/>
                        
                    </div>
                ):null}
                {base64photo && <Image width={280} height={280} src= {base64photo} alt={""}  className="h-44" />}
                {base64photo =="" &&
                    <>
                    <Input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    />
                </> }
            </>)}
        </div>
    </>
  );
};

export default LoadImage;
