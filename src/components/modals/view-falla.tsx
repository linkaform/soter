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
import { Fallas_record } from "../table/incidencias/fallas/fallas-columns";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { capitalizeFirstLetter, formatDateToText } from "@/lib/utils";

interface ViewFallaModalProps {
  title: string;
  data:Fallas_record
  isSuccess: boolean;
  children: React.ReactNode;
}

export const ViewFalla: React.FC<ViewFallaModalProps> = ({
  title,
  data,
  children,
}) => {
  const seguimientos = data.falla_grupo_seguimiento || []
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between">
            <div className="w-full flex flex-col gap-3">
                <div className="w-full flex gap-2">
                  <p className="font-bold">Concepto: <span className="font-normal">{data?.falla}</span> </p>
                  
                </div>
                {data?.falla_objeto_afectado ? ( 
                  <div className="w-full flex gap-2">
                      <p className="font-bold">Subconcepto: <span className="font-normal">{data?.falla_objeto_afectado}</span></p>
                  </div>
                ):null}

                <div className="w-full flex gap-2">
                  <p className="font-bold">Fecha de la falla: <span className="font-normal">{formatDateToText(data?.falla_fecha_hora.slice(0, -3))}</span> </p>
                </div> 

                <div className="w-full flex gap-2">
                <p className="font-bold">Area : <span className="font-normal">{data?.falla_caseta}</span></p>
                </div>

                <div className="w-full flex gap-2">
                  <p className="font-bold">Ubicación:  <span className="font-normal">{data?.falla_ubicacion}</span></p>
                </div>

                <div className=" flex justify-between">
                    <div className="w-full flex gap-2">
                    <p className="font-bold">Estatus : 
                    {data?.falla_estatus =="abierto"?(<span className="text-green-600"> {capitalizeFirstLetter( data?.falla_estatus)}</span>):(
                      <span className="text-green-600"> {capitalizeFirstLetter( data?.falla_estatus)}</span>
                    )}
                    </p>
                    </div>
                </div>
                <Separator className="my-2 w-74 mr-5"/>
                <div className="w-full flex gap-2">
                <p className="font-bold">Comentario: <span className="font-normal">{data?.falla_comentarios}</span></p>
                </div> 

                <div className=" flex justify-between">
                    <div className="w-full flex gap-2">
                    <p className="font-bold">Reporta: <span className="font-normal">{data?.falla_reporta_nombre}</span></p>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <p className="font-bold mb-2">Evidencia: </p>
                <div className="flex justify-center">
                  <Carousel className="w-48 ">
                      <CarouselContent>
                          {data.falla_evidencia.map((a, index) => (
                          <CarouselItem key={index}>
                              <div className="p-1">
                              <Card>
                                  <CardContent className="flex aspect-square items-center justify-center p-6">
                                  {/* <span className="text-4xl font-semibold"> */}
                                      <Image
                                          width={280}
                                          height={280}
                                          src= {a.file_url || "/nouser.svg"}
                                          alt="Imagen"
                                          className="w-42 h-42 object-contain bg-gray-200 rounded-lg" 
                                      />
                                  {/* </span> */}
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
                <div className="mt-5">
                  <p className="font-bold">Documentos:</p>
                  {data?.falla_documento && data.falla_documento.length > 0 ? (
                      <ul>
                      {data.falla_documento.map((documento, index) => (
                          <li key={index}>
                          <a
                              href={documento.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                          >
                              {documento.file_name}
                          </a>
                          </li>
                      ))}
                      </ul>
                  ) : (
                      <p>No hay documentos disponibles</p>
                  )}
              </div>
            </div>
        </div>

        <Separator className="" />
        
        <div className="flex justify-between">
            <div className="w-full">
                <h1 className="font-bold text-xl">Información de la solucion </h1>
            </div>     
            <div className="w-full flex flex-col space-y-5">
                <div className=" flex justify-between">
                    <div className="w-full flex gap-2">
                    <p className="font-bold">Responsable: <span className="font-normal">{data?.falla_responsable_solucionar_nombre}</span></p>
                    </div>
                </div>
            </div>
        </div>

        {seguimientos.length>0 && (
          <div className="">
            <p className=" font-bold mb-2">Seguimientos:</p>
            <Accordion type="single" collapsible>
              {seguimientos.map((item, index) => (
                <AccordionItem key={index} value={`vehiculo-${index}`}>
                  <AccordionTrigger>{`${item['66f2dfb2c80d24e5e82332b4']}`}</AccordionTrigger>
                  <AccordionContent>
                    <p className="font-medium mb-1">
                      Accion realizada:{" "}
                      <span className="">{`${item['66f2dfb2c80d24e5e82332b4']}`|| "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Comentario	:{" "}
                      <span className="">{`${item['66f2dfb2c80d24e5e82332b3']}`|| "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Fecha de incio:{" "}
                      <span className="">{`${item['679a485c66c5d089fa6b8ef9']}`|| "N/A"}</span>
                    </p>
                    <p className="font-medium mb-1">
                      Fecha fin:{" "}
                      <span className="">{`${item['679a485c66c5d089fa6b8efa']}`|| "N/A"}</span>
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          )}

        <div className="flex  gap-1 my-5">
          <DialogClose asChild>
            <Button className="w-1/2 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>
          <Button className="w-1/2 h-12 bg-blue-500 hover:bg-blue-600 text-white">
              Cerrar falla
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
