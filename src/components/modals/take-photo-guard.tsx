import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Imagen } from '@/lib/update-pass-full';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { useUploadImage } from "@/hooks/useUploadImage";
import Webcam from "react-webcam";
import { Camera, Loader2 } from "lucide-react";
import { base64ToFile, quitarAcentosYMinusculasYEspacios } from "@/lib/utils";
import Image from "next/image";


interface TakeModalProps {
    title:string;
	descripcion:string;
    evidencia: Imagen[];
    setEvidencia: Dispatch<SetStateAction<Imagen[]>>;
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	// children: React.ReactNode;
  }
  
  export const TakePhotoGuard: React.FC<TakeModalProps> = ({
    title,
	descripcion,
    setEvidencia,
    evidencia,
	open,
	setOpen
	// children
  }) => {
	const [loadingWebcam, setloadingWebcam] = useState(false);
    const [hideWebcam, setHideWebcam] = useState(false)
    const { uploadImageMutation, response, isLoading} = useUploadImage();
	// const [open, setOpen] = useState(false)

    const webcamRef = useRef<Webcam | null>(null);
    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: 'user'
      };

	  useEffect(() => {
		if (open) {
			setloadingWebcam(true);
			setHideWebcam(false);
			setEvidencia([]);
		}
	}, [open, setEvidencia]);

	const handleUserMedia = () => {
	setloadingWebcam(false); 
	};

	function takeAndSavePhoto(){
		const id= "evidencia"
        const imageSrc = webcamRef.current?.getScreenshot() || "";
        const base64 =base64ToFile(imageSrc, quitarAcentosYMinusculasYEspacios(id));
        const tipoMime = base64.type;
        const extension = tipoMime.split('/')[1];
        const nuevoNombre = `${quitarAcentosYMinusculasYEspacios(id)}.${extension}`;
        const nuevoArchivo = new File([base64], nuevoNombre, { type: base64.type });
        uploadImageMutation.mutate({img:nuevoArchivo})


        if(hideWebcam===false && evidencia.length<1 ){
            setHideWebcam(true)
        }else{
            setHideWebcam(true)
        }
    }

	useEffect(()=>{
		if(response){
			setEvidencia([response])
			setTimeout(() => {
				setHideWebcam(true)
				setloadingWebcam(false);
				setOpen(false)
			}, 2000);
		}
	},[response, setOpen, setEvidencia])
	
  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
		{/* <DialogTrigger asChild>{children}</DialogTrigger> */}
		<DialogContent className="max-w-md min-h-[600px] max-h-[90vh] flex flex-col overflow-hidden justify-between" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
			<DialogHeader className="flex-shrink-0">
				<DialogTitle className="text-2xl text-center font-bold">
					{title}
				</DialogTitle>
			</DialogHeader>
		<div>
		{descripcion}
		</div>
		{!hideWebcam ? (
			<div className="flex justify-center items-center h-[350px]">
				{loadingWebcam? (<>
					<div role="status" >
						<svg aria-hidden="true" className="w-8  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
							<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
						</svg>
					</div>
				</>):null}
				<Webcam 
				tabIndex={-1}
				ref={webcamRef}
				audio={false} 
				height={350} 
				width={350} 
				className="rounded-lg" 
				screenshotFormat="image/jpeg" 
				mirrored={false} 
				videoConstraints={videoConstraints}
				onUserMediaError={handleUserMedia}
				onUserMedia={handleUserMedia}/>			
			</div>
		):null}

			{evidencia?.length > 0 && (
			<div className="flex justify-center items-center h-[350px]">
				<Image width={300} height={300} alt=""
				src={evidencia[0]?.file_url}
				className="rounded-lg w-[300px] h-[300px] object-cover"
				/>
			</div>)}

	
		<div className="flex gap-4 mt-auto">
			<DialogClose asChild>
				<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
				Cerrar
				</Button>
			</DialogClose>

			<Button
			type="submit"
			className="w-full  bg-blue-500 hover:bg-blue-600 text-white "  onClick={takeAndSavePhoto} disabled={isLoading || evidencia.length>0 || loadingWebcam }>
			 {loadingWebcam ? (
					<>
					<Loader2 className="animate-spin" /> Cargando cámara...
					</>
				) : isLoading ? (
					<>
					<Loader2 className="animate-spin" /> Guardando imagen...
					</>
				) : evidencia.length > 0 ? (
					<>
					<Camera /> Imagen guardada
					</>
				) : (
					<>
					<Camera /> Tomar fotografía
					</>
			)}
			</Button>

		</div>
     	</DialogContent>
    </Dialog>
  );
};

export default TakePhotoGuard;