import { CheckCircleIcon, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface GeneratedPassModalProps {
  title: string;
  description: string;
  link: string;
  openGeneratedPass: boolean;
  setOpenGeneratedPass: Dispatch<SetStateAction<boolean>>;
}

export const GeneratedPassModal: React.FC<GeneratedPassModalProps> = ({
  title,
  description,
  link,
  openGeneratedPass,
  setOpenGeneratedPass,
}) => {
  const router = useRouter();

  if (!openGeneratedPass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="absolute inset-0"
        onClick={(e) => e.preventDefault()}
      />
      <div
        className="bg-white rounded-2xl max-w-xl w-full p-6 flex flex-col max-h-[90vh] overflow-y-auto z-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center flex-shrink-0 my-5">
          <h2 className="text-2xl font-bold inline-block">
            {title}
            <CheckCircleIcon className="h-6 w-6 text-green-500 ml-2 inline-block" />
          </h2>
        </div>

        <div className="px-16 text-center">
          <p>{description}</p>
        </div>

        <Separator className="my-3" />

        <div className="flex justify-center m-3">
          <input
            className="text-gray-600 text-center w-1/2"
            disabled
            type="text"
            value={link}
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
                  onClick: () => window.open(link, "_blank"),
                },
              });
            });
            setOpenGeneratedPass(false);
            router.push(`/dashboard/pases`);
            window.open(link, "_blank");
          }}
        >
          <Copy className="mr-2" />
          Copiar Enlace
        </Button>
      </div>
    </div>
  );
};
