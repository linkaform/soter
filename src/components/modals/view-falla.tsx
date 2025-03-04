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

  // const keyToTextMap ={
  //   '66f2dfb2c80d24e5e82332b4': 'accion_ealizada',
  //   '66f2dfb2c80d24e5e82332b3': 'comentario',
  //   '679a485c66c5d089fa6b8ef9': 'fecha_inicio',
  //   '679a485c66c5d089fa6b8efa': 'fecha_fin',
    
  // };
  // function formatItemKeysToText(item:string) {
  //   const formattedItem = {};
  
  //   // Iteramos sobre las claves del objeto `item`
  //   for (const key in item) {
  //     // Verificamos si la clave existe en el mapa
  //     if (keyToTextMap[key]) {
  //       formattedItem[keyToTextMap[key]] = item[key];
  //     }
  //   }
  
  //   return formattedItem;
  // }
  return (
    <Dialog >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="flex ">
        <div className="w-full ">
            <p className="font-bold ">Concepto:</p>
            <p className="">{data?.falla} </p>
          </div>
          <div className="w-full ">
              <p className="font-bold">Ubicación: </p>
              <p >{data?.falla_ubicacion} </p>
            </div>
        </div>

        <div className="flex justify-between">
            <div className="w-full flex flex-col gap-3">
                <div className="w-full">
                <p className="font-bold">Area : </p>
                <p className=""> {data?.falla_caseta}</p>
                </div>
                
                <div className="w-full">
                <p className="font-bold">Comentario : </p>
                <p className="w-full break-words">{data?.falla_comentarios}</p>
                </div>   

                <div className="w-full">
                <p className="font-bold">Fecha de la falla : </p>
                <p className="w-full break-words">{data?.falla_fecha_hora} </p>
                </div>   
            </div>
            <div className="w-full">
                <div className="mx-auto max-w-xs">
                    <p className="font-bold mb-2">Evidencia : </p>
                    <Carousel className="w-48 max-w-xs">
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
            </div>
        </div>

            

        <div className="flex flex-col space-y-5">
          
          <div className="flex justify-between">
                                                                                                                   
            </div>

          <div className="flex justify-between">
            <div className="">
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
          <Separator className="my-4" />

            <div className="flex flex-col space-y-5">
                <div className=" flex justify-between">
                    <div className="w-full ">
                    <p className="font-bold">Estatus : </p>
                    <p className=""> {data?.falla_estatus}</p>
                    </div>
                </div>
                <div className=" flex justify-between">
                    <div className="w-full ">
                    <p className="font-bold">Reporta : </p>
                    <p className=""> {data?.falla_reporta_nombre}</p>
                    </div>
                </div>
            </div>
        </div>
        <Separator></Separator>
        
        <div className="flex justify-between">
            <div><h1 className="font-bold text-xl">Información de la solucion: </h1></div>     
            <div className="flex flex-col space-y-5">
                <div className=" flex justify-between">
                    <div className="w-full ">
                    <p className="font-bold">Responsable : </p>
                    <p className=""> {data?.falla_responsable_solucionar_nombre}</p>
                    </div>
                </div>
                
            </div>
        </div>

        <div className=" flex justify-between">
            <div className="w-full ">
            <p className="font-bold">Seguimientos : </p>
            <p className=""> </p>
            </div>
        </div>

        {seguimientos.length>0 && (
          <div className="">
            <p className="text-lg font-bold mb-2">Seguimientos:</p>
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
