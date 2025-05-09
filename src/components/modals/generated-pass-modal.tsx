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

interface GeneratedPassModalProps {
  title: string;
  description: string;
  link:string;
  openGeneratedPass:boolean;
  setOpenGeneratedPass: Dispatch<SetStateAction<boolean>>;
}

export const GeneratedPassModal: React.FC<GeneratedPassModalProps> = ({
  title,
  description,
  link,
  openGeneratedPass,
  setOpenGeneratedPass
}) => {
  const router = useRouter(); 
  return (
    <Dialog open={openGeneratedPass} onOpenChange={setOpenGeneratedPass} >
      <DialogTrigger ></DialogTrigger>

      <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
            <CheckCircleIcon className=" h-6 w-6 text-green-500 ml-2 inline-block" />
          </DialogTitle>
        </DialogHeader>

          <div className="px-16">
            <p className="text-center">{description}</p>
          </div>

          <Separator />
          <div className=" flex justify-center m-3">
            <input
              className="text-gray-600 align-middle text-center w-1/2 "
              disabled={true}
              type="text"
              value= {link}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            navigator.clipboard.writeText(link).then(() => {
              toast("¡Enlace copiado!", {
                description:
                  "El enlace ha sido copiado correctamente al portapapeles.",
                action: {
                  label: "Abrir enlace",
                  onClick: () => window.open(link, "_blank"), // Abre el enlace en una nueva pestaña
                },
              });
            });
            router.push(`/`); 
          }}
        >
          <Copy className="mr-2" />
          Copiar Enlace
        </Button>
      </DialogContent>
    </Dialog>
  );
};
