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
import { capitalizeFirstLetter, formatDateToText } from "@/lib/utils";
import { Articulo_con_record } from "../table/articulos/concecionados/concecionados-columns";

interface ViewArtModalProps {
  title: string;
  data:Articulo_con_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewArticuloCon: React.FC<ViewArtModalProps> = ({
  title,
  data,
  children,
}) => {
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between">
            <div className="w-full flex flex-col gap-3">
                <div className="w-full flex gap-2">
                  <p className="font-bold ">Folio: </p>
                  <p  className="font-bold text-blue-500">{data?.folio} </p>
                </div>
                {data?.solicita_concesion ? ( 
                  <div className="w-full flex gap-2">
                      <p className="font-bold">Solicita: <span className="font-normal">{data?.solicita_concesion}</span></p>
                  </div>
                ):null}

                <div className="w-full flex gap-2">
                  <p className="font-bold">Persona: <span className="font-normal">{data?.persona_nombre_concesion}</span> </p>
                </div>

                <div className="w-full flex gap-2">
                  <p className="font-bold">Ubicacion: <span className="font-normal">{data?.ubicacion_concesion}</span> </p>
                </div> 

                <div className="w-full flex gap-2">
                <p className="font-bold">Area : <span className="font-normal">{data?.caseta_concesion}</span></p>
                </div>

                <div className=" flex justify-between">
                    <div className="w-full flex gap-2">
                    <p className="font-bold">Estatus : 
                  { data?.status_concesion !=="abierto" ? (<span className="text-green-600"> {capitalizeFirstLetter( data?.status_concesion)}</span>):(
                      <span className="text-red-600"> {capitalizeFirstLetter( data?.status_concesion)}</span>
                    )}
                    </p>
                    </div>
                </div>

                <div className="w-full flex gap-2">
                <p className="font-bold">Observaciones: <span className="font-normal">{data?.observacion_concesion}</span></p>
                </div> 

                <Separator className="my-2 w-74 mr-5"/>
               

                <div className="w-full flex gap-2">
                  <p className="font-bold">Fecha de la concesion: 
                    <span className="font-normal">{formatDateToText(data?.fecha_concesion.slice(0, -3))}</span> </p>
                </div> 

                <div className="w-full flex gap-2">
                <p className="font-bold">Fecha Devolucion Concesion: 
                    <span className="font-normal">{data?.fecha_devolucion_concesion ? formatDateToText(data?.fecha_devolucion_concesion.slice(0, -3)):""}</span> </p>
                </div>

            </div>
            {/* <div className="w-full flex flex-col">
                <p className="font-bold mb-2">Evidencia: </p>
                <div className="flex justify-center">
                  <Carousel className="w-36 ">
                      <CarouselContent>
                          {data.foto_perdido.map((a, index) => (
                          <CarouselItem key={index}>
                              <div className="p-1">
                              <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-0">
                                      <Image
                                          width={280}
                                          height={280}
                                          src= {a.file_url || "/nouser.svg"}
                                          alt="Imagen"
                                          className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
                                      />
                                  </CardContent>
                              </Card>
                              </div>
                          </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                  </Carousel>
                </div>
            </div> */}
        </div>

        {/* <Separator className="" /> */}
            {/* <div className="w-full flex gap-2">
                <h1 className="font-bold text-xl">Información de la Entrega </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="w-full flex gap-2">
                    <p className="font-bold">Recibe: <span className="font-normal">{data?.recibe_perdido}</span> </p>
                </div>
                
                <div className="w-full flex gap-2">
                    <p className="font-bold">Fecha de la entrega: <span className="font-normal">{data?.date_entrega_perdido ? formatDateToText(data?.date_entrega_perdido.slice(0, -3)):""}</span> </p>
                </div>

                <div className="w-full flex gap-2">
                    <p className="font-bold">Interno: <span className="font-normal">{data?.quien_entrega_interno}</span></p>
                </div>

                <div className="w-full flex gap-2">
                    <p className="font-bold">Externo: <span className="font-normal">{data?.quien_entrega_externo}</span></p>
                </div>

                <div className="w-full flex gap-2">
                    <p className="font-bold">Area de resguardo: <span className="font-normal">{data?.locker_perdido}</span></p>
                </div>
            </div>
           */}

        <div className="flex gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-1/2 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cerrar
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
