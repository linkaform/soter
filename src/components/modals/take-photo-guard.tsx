import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Imagen } from '@/lib/update-pass-full';
import LoadImage from '../upload-Image';
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";

interface TakeModalProps {
    title:string;
	descripcion:string;
    evidencia: Imagen[];
    setEvidencia: Dispatch<SetStateAction<Imagen[]>>;
	children: React.ReactNode;
  }
  
  export const TakePhotoGuard: React.FC<TakeModalProps> = ({
    title,
	descripcion,
    setEvidencia,
    evidencia,
	children
  }) => {


  return (
    <Dialog  modal>
		<DialogTrigger asChild>{children}</DialogTrigger>
		<DialogContent className="max-w-md overflow-y-auto max-h-[80vh] min-h-[50vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby="">
			<DialogHeader className="flex-shrink-0">
				<DialogTitle className="text-2xl text-center font-bold">
					{title}
				</DialogTitle>
			</DialogHeader>
		<DialogTitle></DialogTitle>
		<div>
		{descripcion}
		</div>
		<div className="flex flex-col ">
			<LoadImage
			id="evidencia" 
			titulo={"Fotografía"}
			setImg={setEvidencia}
			showWebcamOption={true}
			facingMode="environment"
			imgArray={evidencia}
			showArray={true}
			limit={1}
			showTakePhoto={false}
			/>
		</div>
		<div className="mt-auto">
			<DialogClose asChild>
				<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
				Cerrar
				</Button>
			</DialogClose>
		</div>
     	</DialogContent>
    </Dialog>
  );
};

export default TakePhotoGuard;