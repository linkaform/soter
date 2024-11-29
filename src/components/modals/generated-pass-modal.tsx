import { Copy } from "lucide-react";
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

interface GeneratedPassModalProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const GeneratedPassModal: React.FC<GeneratedPassModalProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="px-16">
          <p className="text-center">{description}</p>
        </div>

        <Separator />

        <Button
          variant="link"
          className="text-blue-600 hover:text-blue-800"
          onClick={() => {
            const link = "https://srv.linkaform.com/solucion_accesos/pase.html";
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
          }}
        >
          <Copy className="mr-2" />
          Copy Link
        </Button>
      </DialogContent>
    </Dialog>
  );
};
