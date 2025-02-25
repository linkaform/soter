import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Incidencia_record } from "../table/incidencias/incidencias-columns";

interface ViewPassModalProps {
  title: string;
  data:Incidencia_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewIncidencia: React.FC<ViewPassModalProps> = ({
  title,
  data,
  children,
}) => {
  return (
    // open={isSuccess} onOpenChange={setIsSuccess}
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="w-full ">
            <p className="font-bold ">Fecha y hora:</p>
            <p className="">{data?.fecha_hora_incidencia} </p>
          </div>

        <div className="flex flex-col space-y-5">
          <div className=" flex justify-between">
            <div className="w-full ">
              <p className="font-bold">Ubicación: </p>
              <p >{data?.ubicacion_incidencia} </p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Area : </p>
              <p className=" text-red-500"> {data?.area_incidencia}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full  ">
              <p className="font-bold">Incidencia : </p>
              <p className="w-full break-words">{data?.incidencia}</p>
            </div>                                                                                                              
            </div>

          <div className="flex justify-between">
            <div className="w-full  ">
              <p className="font-bold">Documentos : </p>
              {/* <p className="w-full break-words">{data?.documento_incidencia[0]?.file_name}</p> */}
            </div>

            <div className="w-full ">
              <p className="font-bold">Comentarios : </p>
              <p className="w-full break-words">{data?.comentario_incidencia} </p>
            </div>
          </div>
          <Separator className="my-4" />

          <div className="flex justify-between">
            {data?.evidencia_incidencia!== undefined && data?.evidencia_incidencia.length > 0 ?(
                <><div className="w-full ">
                    <p className="font-bold mb-3">Fotografia:</p>
                    <div className="w-full flex justify-center">
                        <Image
                        src={data?.evidencia_incidencia[0].file_url  } 
                        alt="Imagen"
                        width={150}
                        height={150}
                        className=" h-32 object-contain bg-gray-200 rounded-lg" 
                        />
                    </div>
                </div>
                </>
            ):null}


            {/* {data?.identificacion!== undefined && data?.identificacion.length > 0 ?(
                <><div className="w-full ">
                        <p className="font-bold mb-3">Identificacion:</p>
                        <div className="w-full flex justify-center">
                            <Image
                            src={data?.identificacion[0].file_url  } 
                            alt="Imagen"
                            width={150}
                            height={150}
                            className=" h-32 object-contain bg-gray-200 rounded-lg" 
                            />
                        </div>
                    </div>
                </>
            ):null} */}
          </div>
        </div>

        <div className="flex gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
