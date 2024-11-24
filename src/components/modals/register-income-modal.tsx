import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Dispatch, SetStateAction } from "react";

import Image from "next/image";
import { QrCode } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface RegisterIncomeModalProps {
  title: string;
  data: {
    tipoPase: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    fotografia: string;
    identificacion: string;
    empresa: string;
    aQuienVisita: string;
    motivoVisita: string;
  };
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

export const RegisterIncomeModal: React.FC<RegisterIncomeModalProps> = ({
  title,
  data,
  isSuccess,
  setIsSuccess,
}) => {
  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <div className="flex justify-center my-5">
            <Image
              className="dark:invert"
              src="/logo.svg"
              alt="Next.js logo"
              width={150}
              height={50}
              priority
            />
          </div>

          <DialogTitle className="text-2xl font-bold my-5">{title}</DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="grid grid-cols-2 gap-5">
          <div className="w-full">
            <p>Tipo de pase</p>
            <p className="text-sm">Visita General</p>
          </div>

          <div className="">
            <p>Nombre Completo</p>
            <p className="text-sm">{data?.nombreCompleto}</p>
          </div>

          <div className="">
            <p>Email</p>
            <p className="text-sm">{data?.email}</p>
          </div>

          <div className="">
            <p>Telefono</p>
            <p className="text-sm">{data?.telefono}</p>
          </div>

          <div className="">
            <p>Empresa</p>
            <p className="text-sm">{data?.empresa}</p>
          </div>

          <div className="">
            <p>Visita a</p>
            <p className="text-sm">{data?.aQuienVisita}</p>
          </div>
        </div>

        <Separator />

        <div className="my-5">
          {/* Fotografía */}

          <div className="mb-4 flex space-x-4">
            <div className="w-full">
              <p className="">Fotografía</p>
            </div>

            <div className="w-full">
              <Image
                src="/image/registro.png"
                alt="Fotografía"
                width={100}
                height={100}
                className=""
              />
            </div>
          </div>

          {/* Identificación */}

          <div className="mb-4 flex space-x-4">
            <div className="w-full">
              <p className="">Identificación</p>
            </div>

            <div className="w-full">
              <Image
                src="/image/registro.png"
                alt="Identificación"
                width={100}
                height={100}
                className=""
              />
            </div>
          </div>

          <Separator />
        </div>

        <div className="">
          <p>Motivo de Visita</p>
          <p>{data?.motivoVisita}</p>
        </div>

        {/* Equipos */}

        <div className="">
          <p className="text-2xl font-bold">Equipos</p>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Equipo 1</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

            {/* Vehiculos */}

            <div className="">
          <p className="text-2xl font-bold">Vehiculos</p>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Vehiculo 1</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>


        <div className="flex gap-5 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white">
            <QrCode />
            Generar QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};