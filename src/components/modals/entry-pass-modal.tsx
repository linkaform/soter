import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import CalendarDays from "../calendar-days";
import { Dispatch, SetStateAction } from "react";
import { CalendarClock } from "lucide-react";

interface EntryPassModalProps {
  title: string;
  data: {
    tipoPase: string;
    estatus: string;
    nombreCompleto: string;
    email: string;
    telefono: string;
    areasAcceso: { area: string; comentarios: string }[];
    comentariosGenerales: { tipo: string; comentarios: string }[];
    fechaFija: string;
    fechaInicio: string;
    fechaHasta: string;
    diasSeleccionados: string[]; // Agregado para incluir los días seleccionados
  };
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

export const EntryPassModal: React.FC<EntryPassModalProps> = ({
  title,
  data,
  isSuccess,
  setIsSuccess,
}) => {
  const items = data?.fechaFija
    ? [
        {
          icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
          title: "Fecha y Hora de Visita",
          date: data?.fechaFija,
        },
      ]
    : [
        {
          icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
          title: "Fecha Inicio",
          date: data?.fechaInicio,
        },
        {
          icon: <CalendarClock className="w-6 h-6 text-gray-500" />,
          title: "Fecha Hasta",
          date: data?.fechaHasta,
        },
      ];

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="flex flex-col space-y-5">
          <p className="text-2xl font-bold">Sobre la visita</p>

          <div className="flex justify-between">
            <div className="w-full">
              <p>Tipo de pase</p>
              <p className="text-sm">Visita General</p>
            </div>

            <div className="w-full">
              <p>Estatus</p>
              <p className="text-sm text-red-500">Proceso</p>
            </div>
          </div>

          <div className="">
            <p>Nombre Completo</p>
            <p className="text-sm">{data?.nombreCompleto}</p>
          </div>

          <div className="flex justify-between">
            <div className="w-full">
              <p>Email</p>
              <p className="text-sm">{data?.email}</p>
            </div>

            <div className="w-full">
              <p>Teléfono</p>
              <p className="text-sm">{data?.telefono}</p>
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        {/* Áreas de acceso */}
        <div className="flex flex-col space-y-5">
          <p className="text-2xl font-bold">Áreas de acceso</p>
          {data?.areasAcceso.map((area, index) => (
            <div className="flex justify-between" key={index}>
              <div className="w-full">
                <p>Área</p>
                <p className="text-sm">{area?.area}</p>
              </div>

              <div className="w-full">
                <p>Comentarios</p>
                <p className="text-sm">{area?.comentarios}</p>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
        </div>

        {/* Comentarios/Instrucciones */}
        <div className="flex flex-col space-y-5">
          <p className="text-2xl font-bold">Comentarios/Instrucciones</p>
          {data?.comentariosGenerales.map((comentario, index) => (
            <div className="flex" key={index}>
              <div className="w-full">
                <p>Tipo</p>
                <p className="text-sm">{comentario?.tipo}</p>
              </div>

              <div className="w-full">
                <p>Comentarios</p>
                <p className="text-sm">{comentario?.comentarios}</p>
              </div>
            </div>
          ))}
          <Separator className="my-4" />
        </div>

        {/* Vigencia y Acceso */}

        <div className="flex flex-col space-y-5">
          <p className="text-2xl font-bold">Vigencia y acceso</p>

          <div className="max-w-[520px] space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-md p-3 border border-gray-200"
              >
                {/* Ícono */}
                <div className="flex-shrink-0 bg-gray-100 p-3 rounded-lg">
                  {item.icon}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <p className="font-medium text-gray-700">{item?.title}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                    {item?.date?.replace('T', ' ').slice(0, 16)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />
        </div>

         {/* Días Seleccionados */} 
         <div className="flex flex-col space-y-5">
         <CalendarDays />
         </div>

        <div className="flex gap-5 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>

          <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white">
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
