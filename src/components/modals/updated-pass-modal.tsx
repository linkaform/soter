import { CheckCircleIcon, Copy } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { Dispatch,SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

interface updatedPassModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
  openGeneratedPass:boolean;
  setOpenGeneratedPass: Dispatch<SetStateAction<boolean>>;
  qr:string;
}

export const UpdatedPassModal: React.FC<updatedPassModalProps> = ({
  title,
  description,
  children,
  openGeneratedPass,
  setOpenGeneratedPass,
  qr
}) => {
  const router = useRouter(); // Inicializamos el hook useRouter
  return (
    <Dialog open={openGeneratedPass} onOpenChange={setOpenGeneratedPass} >
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
            <CheckCircleIcon className=" h-6 w-6 text-green-500 ml-2 inline-block" />
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-16">
          <p className="text-center">{description}</p>
        </div>
        {qr ?(
                <>
                <div className="w-full ">
                        <div className="w-full flex justify-center">
                            <img
                            src={qr} // Asumiendo que data.imagenUrl contiene la URL de la imagen
                            alt="Imagen"
                            className="w-42 h-42 object-contain bg-gray-200 rounded-lg" // Clases de Tailwind para estilizar la imagen
                            />
                        </div>
                    </div>
                </>
            ):null}

        <Separator />
       <div className="flex flex-col justify-center items-center gap-3">
       <div className="flex items-center space-x-2">
        <Checkbox id="enviar_correo" />
        <label
            htmlFor="enviar_correo"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            Enviar correo
        </label>
        </div>
        
        <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
            Enviar sms
        </label>
        </div>
       </div>

        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
        //   onClick={() => {
            
        //     navigator.clipboard.writeText(link).then(() => {
        //       toast("¡Enlace copiado!", {
        //         description:
        //           "El enlace ha sido copiado correctamente al portapapeles.",
        //         action: {
        //           label: "Abrir enlace",
        //           onClick: () => window.open(link, "_blank"), // Abre el enlace en una nueva pestaña
        //         },
        //       });
        //     });
        //     router.push(`/`); 
        //   }}
        >
          Descargar PDF
        </Button>
      </DialogContent>
    </Dialog>
  );
};
