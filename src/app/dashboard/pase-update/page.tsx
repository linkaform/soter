"use client";

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";

import { useGetCatalogoPaseNoJwt } from "@/hooks/useGetCatologoPaseNoJwt";
import VehicleList from "@/components/vehicle-list";
import { Equipo, Imagen, Vehiculo } from "@/lib/update-pass";
import EquipoList from "@/components/equipo-list";
import { EntryPassModal2 } from "@/components/modals/add-pass-modal-2";
import LoadImage from "@/components/upload-Image";
import { Car, Laptop } from "lucide-react";

export const grupoEquipos = z.array(
  z.object({
    nombre: z.string().optional(),
    modelo: z.string().optional(),
    marca: z.string().optional(),
    color: z.string().optional(),
    tipo: z.string().optional(),
    serie: z.string().optional() ,
  })
).optional();

export const grupoVehiculos = z.array(
  z.object({
    tipo: z.string().optional(),
    marca: z.string().optional(),
    modelo: z.string().optional(),
    estado: z.string().optional(),
    placas: z.string().optional(),
    color: z.string().optional()
  })
).optional();

export const valImagen = z.array(
  z.object({
    file_url: z.string().optional(),
    file_name: z.string().optional(),
  })
).optional();

export const formSchema = z
    .object({
    grupo_equipos:grupoEquipos,
    grupo_vehiculos:grupoVehiculos,
    walkin_fotografia: valImagen,
    walkin_identificacion: valImagen,
    status_pase: z.string().optional(),
    folio: z.string().optional(),
    account_id: z.number().optional(),
    nombre:z.string().optional(),
    ubicacion:z.string().optional(),
    email:z.string().optional(),
    telefono:z.string().optional()
  })

export default function PaseUpdate () {
    const userIdSoter = parseInt(localStorage.getItem("userId_soter") || "0", 10);

    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    const id = urlParams.get('id') ?? ''; 
    const docs = urlParams.get('docs') !== null ? urlParams.get('docs') :'' ;
    let account_id = parseInt(urlParams.get('user') ?? '') || 0;
    if(account_id== null){
        account_id= userIdSoter
    }
    const showIneIden= docs?.split("-")

    const { data: dataCatalogos, isLoading: loadingDataCatalogos } = useGetCatalogoPaseNoJwt(account_id, id);

    const [agregarEquiposActive, setAgregarEquiposActive] = useState(false);
    const [agregarVehiculosActive, setAgregarVehiculosActive] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [modalData, setModalData] = useState<any>(null);

    const [vehicles, setVehicles] = useState<Vehiculo[]>([]);
    const [equipos, setEquipos] = useState<Equipo[]>([]);
    const [fotografia, setFotografia] = useState<Imagen[] | "">([])
    const [identificacion, setIdentificacion] = useState<Imagen[] | "">([])


    const [errorFotografia, setErrorFotografia] = useState("")
    const [errorIdentificacion, setErrorIdentificacion] = useState("")

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        grupo_vehiculos:[],
        grupo_equipos:[],
        status_pase:'Activo',
        walkin_fotografia:[],
        walkin_identificacion:[],
        folio: "",
        account_id: 0,
        nombre:"",
        ubicacion:"",
        email:"",
        telefono:""
    }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
    const formattedData = {
        grupo_vehiculos: vehicles,
        grupo_equipos: equipos,
        status_pase: data.status_pase,
        walkin_fotografia:fotografia,
        walkin_identificacion:identificacion,
        folio: id,
        account_id: account_id,
        nombre:dataCatalogos?.pass_selected.nombre,
        ubicacion:dataCatalogos?.pass_selected.ubicacion,
        email:dataCatalogos?.pass_selected.email,
        telefono:dataCatalogos?.pass_selected.telefono
    };
    if (showIneIden?.includes("foto") && fotografia.length<=0) {
        setErrorFotografia("Este campo es requerido.");
    }else{
      setErrorFotografia("-")
    }

    if (showIneIden?.includes("iden") && identificacion.length<=0) {
        setErrorIdentificacion("Este campo es requerido.")
    }else{
      setErrorIdentificacion("-")
    }
    
    setModalData(formattedData);
    };

    useEffect(()=>{
      if (errorFotografia === "-" && errorIdentificacion === "-") {
        setIsSuccess(true); 
    } else {
        setIsSuccess(false); 
    }
    },[errorFotografia,errorIdentificacion ])

    const handleCheckboxChange = (name:string) => {
    if (name === "agregar-equipos") {
        setAgregarEquiposActive(!agregarEquiposActive);
    } else if (name === "agregar-vehiculos") {
        setAgregarVehiculosActive(!agregarVehiculosActive);
    }
    };
    if(loadingDataCatalogos){
      return(
        <div className="flex justify-center items-center mt-10">
          <div role="status">
            <span className="font-bold text-3xl text-slate-800">Cargando tu pase de entrada...</span>
              <div className="flex justify-center items-center">
              <svg aria-hidden="true" className="mt-10 w-20 h-20 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>

              </div>
          </div>
        </div>
      )
    }

    const closeModal = () => {
      setErrorFotografia("")
      setErrorIdentificacion("")
      setIsSuccess(false);  // Reinicia el estado para que el modal no se quede abierto.
    };
return (

    <div className="p-8">
      {dataCatalogos?.pass_selected.estatus == "proceso" ? (
        <>
        <EntryPassModal2
          title={"Confirmación"}
          data={modalData}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
          onClose={closeModal}
        />

        <div className="flex flex-col flex-wrap space-y-5 max-w-5xl mx-auto">
        <div className="text-center">
            <h1 className="font-bold text-2xl">Pase de Entrada</h1>
          </div>

          <div className="flex flex-col space-y-5">
              <div className="flex flex-row justify-between ">
                  <div className="w-full flex gap-2">
                  <p className="font-bold whitespace-nowrap">Nombre: </p>
                  <p >{dataCatalogos?.pass_selected.nombre}</p>
                  </div>
              </div>

              <div className="flex justify-between">
                  <div className="w-full flex gap-2">
                  <p className="font-bold whitespace-nowrap">Email : </p>
                  <p className="w-full break-words">{dataCatalogos?.pass_selected.email}</p>
                  </div>

                  <div className="w-full flex gap-2">
                  <p className="font-bold whitespace-nowrap">Teléfono : </p>
                  <p className="text-sm">{dataCatalogos?.pass_selected.telefono}</p>
                  </div>
              </div>

              <div className="flex justify-between">
                  <div className="w-full flex gap-2">
                  <p className="font-bold whitespace-nowrap">Visita a: </p>
                  <p className="w-full break-words">{dataCatalogos?.pass_selected.visita_a[0].nombre}</p>
                  </div>

                  <div className="w-full flex gap-2">
                  <p className="font-bold whitespace-nowrap">Ubicación : </p>
                  <p className="w-full break-words">{dataCatalogos?.pass_selected.ubicacion} </p>
                  </div>
              </div>
              

              <div className="flex justify-between "> 
                {showIneIden?.includes("foto")&& 
                  <div className="w-full sm:w-1/3 md:w-1/2 lg:w-1/2 lg:mr-4 sm:mr-4">
                      <LoadImage
                      id="fotografia" //este identificador de preferencia ponerlo sin espacios, minusculas y sin acentos
                      titulo={"Fotografía"} //este es el nombre que se mostrará y id es el que se usara internamente para diferenciar las instancias
                      img={fotografia}
                      setImg={setFotografia}
                      showWebcamOption={true}
                      setErrorImagen={setErrorFotografia}
                      facingMode="user"
                      />
                      {errorFotografia !=="" && <span className="text-red-500 text-sm">{errorFotografia}</span>}
                  </div>}
                  {showIneIden?.includes("iden")&& <div className="w-full sm:w-1/3 md:w-1/2 lg:w-1/2 lg:mr-4 sm:mr-4">
                      <LoadImage
                      id="identificacion"
                      titulo={"Identificación"}
                      img={identificacion}
                      setImg={setIdentificacion}
                      showWebcamOption={true}
                      setErrorImagen={setErrorIdentificacion}
                      facingMode="environment"
                      />
                      {errorIdentificacion !=="" && <span className="text-red-500 text-sm">{errorIdentificacion}</span>}
                  </div>}
              </div> 
      
              <div className="flex flex-col mt-4 gap-y-3">
                <div className="flex items-center">
                      <button
                          type="button"
                          onClick={() => {handleCheckboxChange("agregar-vehiculos")}}
                          className={`px-4 py-2 rounded-md transition-all duration-300 ${
                              agregarVehiculosActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                          }`}
                        >
                          <div className="flex flex-wrap gap-2">
                            {agregarVehiculosActive ? (
                              <> <Car className="bg-blue-600 text-white"/><div className="">Agregar vehiculos</div></>
                            ):(
                              <> <Car className="text-blue-600"/><div className="text-blue-600">Agregar Vehiculos</div></>
                            )}
                          </div>
                      </button>
                </div>

                <div className="flex items-center">
                  <button
                      type="button"
                      onClick={() => {handleCheckboxChange("agregar-equipos")}}
                      className={`px-4 py-2 rounded-md transition-all duration-300 ${
                          agregarEquiposActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                      }`}
                      >
                      <div className="flex flex-wrap gap-2">
                          {agregarEquiposActive ? (
                          <> <Laptop className="bg-blue-600 text-white"/><div className="">Agregar equipos</div></>
                          ):(
                          <> <Laptop className="text-blue-600"/><div className="text-blue-600">Agregar equipos</div></>
                          )}
                      </div>
                  </button>
                </div>
              </div>
            
          </div>
          
            {agregarEquiposActive ? (<>
                <EquipoList
                    equipos = {equipos}
                    setEquipos={setEquipos}
                />
              </>):null}
            {agregarVehiculosActive ? (
                <>
                <VehicleList
                    account_id={account_id}
                    vehicles = {vehicles}
                    setVehicles={setVehicles}
                />
                </>
              ):null}

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8"> 
              <div className="text-center mt-10 flex justify-center">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-2/3 md:w-1/3 lg:w-1/3"
                  variant="secondary"
                  type="submit"
                >
                  Siguiente
                </Button>
              </div>
            </form>
            </Form> 
          
            
        </div>
        </>
      ): (<>
       <div className="flex flex-col items-center justify-start  space-y-5 max-w-2xl mx-auto h-screen">
            <span className="font-bold text-3xl text-slate-800">{dataCatalogos?.pass_selected.nombre}</span>
            <div>
              <p className="font-bold whitespace-nowrap">Visita General </p>
            </div>

            <div className="flex flex-col gap-2">
                <div className="w-full flex gap-2">
                <p className="font-bold whitespace-nowrap">Visita a: </p>
                <p className="w-full break-words">{dataCatalogos?.pass_selected.visita_a[0].nombre}</p>
                </div>

                <div className="w-full flex gap-2">
                <p className="font-bold whitespace-nowrap">Ubicación : </p>
                <p className="w-full break-words">{dataCatalogos?.pass_selected.ubicacion} </p>
                </div>

                <div className="w-full flex gap-2">
                <p className="font-bold whitespace-nowrap">Fecha : </p>
                <p className="text-sm">{dataCatalogos?.pass_selected.fecha_de_expedicion}</p>
                </div>
            </div>

            <div className="w-full flex-col">
                    <div className="w-full flex justify-center">
                        <img
                        src={dataCatalogos?.pass_selected.qr_pase[0].file_url  } // Asumiendo que data.imagenUrl contiene la URL de la imagen
                        alt="Imagen"
                        className="w-42 h-42 object-contain bg-gray-200 rounded-lg" // Clases de Tailwind para estilizar la imagen
                        />
                    </div>
                </div>

                <Button className="w-40 h-12  bg-yellow-500 hover:bg-yellow-600" type="submit" >
            {/* {!isLoading ? ("Actualizar pase"):(<><Loader2 className="animate-spin"/>Actualizando pase...</>)} */}
            Descargar pdf
            </Button>

            <Button className="w-1/3 h-12  bg-blue-500 hover:bg-blue-600" type="submit" >
            {/* {!isLoading ? ("Actualizar pase"):(<><Loader2 className="animate-spin"/>Actualizando pase...</>)} */}
            Actualizar informacion
            </Button>
        </div>
      </>)}

    </div>
  );
};
