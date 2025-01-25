/* eslint-disable react/no-children-prop */
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Dispatch, SetStateAction, useState } from "react";
import { Loader2 } from "lucide-react";
import { Access_pass_update, Equipo, Imagen, UpdatePase, Vehiculo } from "@/lib/update-pass";
import { UpdatedPassModal } from "./updated-pass-modal";

type CustomAccessPass={
    grupo_equipos:Equipo[],
    grupo_vehiculos:Vehiculo[],
    walkin_fotografia: Imagen[],
    walkin_identificacion: Imagen[],
    status_pase: string,
    account_id: number,
    folio:string
    nombre:string,
    ubicacion:string,
    email:string,
    telefono:string
}

interface EntryPassModal2Props {
  title: string;
  data: {
    grupo_equipos:Equipo[],
    grupo_vehiculos:Vehiculo[],
    walkin_fotografia: Imagen[],
    walkin_identificacion: Imagen[],
    status_pase: string,
    account_id: number,
    folio:string
    nombre:string,
    ubicacion:string,
    email:string,
    telefono:string
  };
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
}

export const EntryPassModal2: React.FC<EntryPassModal2Props> = ({
  title,
  data,
  isSuccess,
  setIsSuccess,
}) => {
  console.log("ENTRANDO MOTAL CONFIRMACION", data);

  // Estado para manejar la respuesta de la API
  const [response, setResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openGeneratedPass, setOpenGeneratedPass] = useState<boolean>(false);

  const onSubmit = async () => {
    console.log("Datos en el Modal", data);
    const ap :Access_pass_update={
        grupo_vehiculos: data.grupo_vehiculos,
        grupo_equipos: data.grupo_equipos,
        status_pase: data.status_pase,
        walkin_fotografia:data.walkin_fotografia,
        walkin_identificacion:data.walkin_identificacion,
    }
    // Preparar los datos para el pase de acceso
    const accessPassData: CustomAccessPass = {
        grupo_vehiculos: data.grupo_vehiculos,
        grupo_equipos: data.grupo_equipos,
        status_pase: data.status_pase,
        walkin_fotografia:data.walkin_fotografia,
        walkin_identificacion:data.walkin_identificacion,
        account_id:data.account_id,
        folio:data.folio,
        nombre:data.nombre,
        ubicacion:data.ubicacion,
        email:data.email,
        telefono:data.telefono
    };

    try {
      setIsLoading(true);
      const apiResponse = await UpdatePase({ access_pass: ap, id:accessPassData.folio, account_id: accessPassData.account_id });
      console.log("RESPUESTA DEL API CREAR PASE", apiResponse);
      setResponse(apiResponse); // Guardar la respuesta en el estado
      setIsSuccess(true); // Marcar el éxito
      setOpenGeneratedPass(true)
    } catch (err) {
      console.error("Error al editar el pase:", err);
      setError("Error al crear el pase.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        {/* Sobre la visita */}
        <div className="w-full ">
            <p className="font-bold ">Nombre Completo : </p>
            <p className="">{data?.nombre} </p>
          </div>

        <div className="flex flex-col space-y-5">
          <div className=" flex justify-between">
            <div className="w-full ">
              <p className="font-bold">Tipo de pase : </p>
              <p >Visita General</p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Estatus : </p>
              <p className=" text-red-500"> Proceso</p>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="w-full  ">
              <p className="font-bold">Email : </p>
              <p className="w-full break-words">{data?.email}</p>
            </div>

            <div className="w-full ">
              <p className="font-bold">Teléfono : </p>
              <p className="text-sm">{data?.telefono}</p>
            </div>
          </div>


          <div className="flex justify-between">
            
            {data?.walkin_fotografia.length > 0 ?(
                <>
                <div className="w-full ">
                    <p className="font-bold">Fotografia:</p>
                    <div className="w-full flex justify-center">
                        <img
                        src={data?.walkin_fotografia[0].file_url  } // Asumiendo que data.imagenUrl contiene la URL de la imagen
                        alt="Imagen"
                        className="w-32 h-32 object-contain bg-gray-200 rounded-lg" // Clases de Tailwind para estilizar la imagen
                        />
                    </div>
                </div>
                </>
            ):null}


            {data?.walkin_identificacion.length > 0 ?(
                <>
                <div className="w-full ">
                        <p className="font-bold">Identificacion:</p>
                        <div className="w-full flex justify-center">
                            <img
                            src={data?.walkin_identificacion[0].file_url  } // Asumiendo que data.imagenUrl contiene la URL de la imagen
                            alt="Imagen"
                            className="w-32 h-32 object-contain bg-gray-200 rounded-lg" // Clases de Tailwind para estilizar la imagen
                            />
                        </div>
                    </div>
                </>
            ):null}
          </div>
          <Separator className="my-4" />
        </div>

        <div className="flex gap-5 my-5">
          <DialogClose asChild>
            <Button className="w-full h-12 bg-gray-100 hover:bg-gray-200 text-gray-700">
              Cancelar
            </Button>
          </DialogClose>


          {  response?.success ? ( 
            <UpdatedPassModal
              title="Pase de Entrada Generado "
              description={"El pase ha sido completado con éxito, selecciona una de las siguientes opciones."}
              openGeneratedPass={openGeneratedPass}
              setOpenGeneratedPass={setOpenGeneratedPass} children={undefined}
              qr={response?.json.qr_pase[0].file_url}
             />
          ):null}
            <Button className="w-full h-12  bg-blue-500 hover:bg-blue-600 text-white" type="submit" onClick={onSubmit}>
                {!isLoading ? ("Actualizar pase"):(<><Loader2 className="animate-spin"/>Actualizando pase...</>)}
                </Button>
           
        </div>
      </DialogContent>
    </Dialog>
  );
};
