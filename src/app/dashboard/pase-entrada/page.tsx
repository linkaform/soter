/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { EntryPassModal } from "@/components/modals/add-pass-modal";
import { List, Mail, MessageCircleMore } from "lucide-react";
import { useCatalogoPaseLocation } from "@/hooks/useCatalogoPaseLocation";
import { useCatalogoPaseArea } from "@/hooks/useCatalogoPaseArea";
import { formatFecha } from "@/lib/utils";
import { useGetConfSeguridad } from "@/hooks/useGetConfSeguridad";

export const linkSchema = z.object({
  link: z.string().url({ message: "Por favor, ingresa una URL válida." }),  // Asegura que el link sea una URL válida
  docs: z.array(z.string()).optional(),
  creado_por_id: z.number().int({ message: "El ID debe ser un número entero." }),  // El ID debe ser un número entero
  creado_por_email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido." }),  // Asegura que el email sea válido
});

export const enviarPreSmsSchema = z.object({
  from: z.string().min(1, { message: "El campo 'from' no puede estar vacío." }),  // Asegura que 'from' no esté vacío
  mensaje: z.string().min(1, { message: "El mensaje no puede estar vacío." }),  // Asegura que el mensaje tenga al menos un carácter
  numero: z.string().optional()
});

export const comentariosSchema = z.array(
  z.object({
    tipo_comentario: z.string().optional(),      // Propiedad tipo_comentario debe ser un string
    comentario_pase: z.string().optional(),      // Propiedad comentario_pase debe ser un string
  })
);

export const areasSchema = z.array(
  z.object({
    nombre_area: z.string().optional(),         // Propiedad nombre_area debe ser un string
    comentario_area: z.string().optional(),     // Propiedad comentario_area debe ser un string
  })
);

export const formSchema = z
    .object({
    nombre: z.string().min(2, {
      message: "Por favor, ingresa un tu nombre completo",
    }),
    email: z.string().optional().refine((val) => {
      // Si el campo tiene valor, entonces validamos si es un correo válido
      if (val && !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(val)) {
        return false;
      }
      return true;
    }, {
      message: "Por favor, ingresa un correo electrónico válido.",
    }),
    telefono: z.string().optional(),
    ubicacion: z.string().min(1, {
      message: "Por favor, ingresa una ubicación válida.",
    }),
    tema_cita: z.string().optional(),
    descripcion: z.string().optional(),
    perfil_pase: z.string().min(1),
    status_pase:z.string().min(1),
    visita_a: z.string().min(1),
    custom: z.boolean().optional(),
    link: linkSchema,
    enviar_correo_pre_registro:z.array(
      z.enum(["enviar_correo_pre_registro", "enviar_sms_pre_registro"])
    ).optional(),
    
    tipo_visita_pase: z.enum(["fecha_fija", "rango_de_fechas"], {
      required_error: "Seleccione un tipo de fecha.",
    }),
    fechaFija: z.string().optional(),
    fecha_desde_visita: z.string().optional(),
    fecha_desde_hasta: z.string().optional(),
    config_dia_de_acceso: z.enum(["cualquier_día", "limitar_días_de_acceso"], {
      required_error: "Seleccione un tipo de acceso.",
    }),
    config_dias_acceso: z.array(
        z.enum(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"])
      ).optional(),
    config_limitar_acceso: z
      .number()
      .optional()
      .refine((val) => (val ? !isNaN(Number(val)) && Number(val) > 0 : true), {
        message:
          "Ingrese un número válido mayor a 0 para el límite de accesos.",
      }),
    areas: areasSchema,
    comentarios:comentariosSchema,
    enviar_pre_sms: enviarPreSmsSchema,
  }) 
  .refine((data) => {
    if (data.tipo_visita_pase === 'rango_de_fechas') {
      const fechaDesdeValida = data.fecha_desde_visita && data.fecha_desde_hasta;
      if (!fechaDesdeValida) {
        return false;
      }
    }
    return true;
  }, {
    message: "Ambas fechas (Desde y Hasta) son requeridas cuando el tipo de pase es 'rango de fechas'.",
    path: ['fecha_desde_visita'], // Error para 'fecha_desde_visita'
  })
  .refine((data) => {
    if (data.tipo_visita_pase === 'rango_de_fechas') {
      const fechaDesdeValida = data.fecha_desde_visita && data.fecha_desde_hasta;
      if (!fechaDesdeValida) {
        // Añadimos un error para 'fecha_desde_hasta' si la otra fecha no está presente
        return false;
      }
    }
    return true;
  }, {
    message: "Ambas fechas (Desde y Hasta) son requeridas cuando el tipo de pase es 'rango de fechas'.",
    path: ['fecha_desde_hasta'], // Error para 'fecha_desde_hasta'
  })
  .refine((data) => {
    if (data.tipo_visita_pase === 'fecha_fija') {
      return data.fechaFija; // Verifica que 'fechaFija' esté presente
    }
    return true;
  }, {
    message: "Fecha Fija es requerida cuando el tipo de pase es 'fecha fija'.",
    path: ['fechaFija'], // Error para 'fechaFija'
  })
  .refine((data) => {
    if (!data.email && !data.telefono) {
      return false;
    }
    return true;
  }, {
    message: "Se requiere un email o teléfono.", 
    path:['email']
  });
const PaseEntradaPage = () => {
  const [tipoVisita, setTipoVisita] = useState("fecha_fija");
  const [config_dias_acceso, set_config_dias_acceso] = useState<string[]>([]);
  const [config_dia_de_acceso, set_config_dia_de_acceso] = useState("cualquier_día");
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalData, setModalData] = useState<any>(null);
  const { data: ubicaciones, isLoading: loadingUbicaciones } = useCatalogoPaseLocation();
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState('');
  const { data: areas, isLoading: loadingAreas} = useCatalogoPaseArea(ubicacionSeleccionada);
  const userNameSoter = localStorage.getItem("userName_soter");
  const userEmailSoter = localStorage.getItem("userEmail_soter");
  const userIdSoter = parseInt(localStorage.getItem("userId_soter") || "0", 10);
  const protocol = window.location.protocol;  
  const host = window.location.host;  
  const [enviar_correo_pre_registro, set_enviar_correo_pre_registro] = useState<string[]>([]);
  const { data: configLocation, isLoading: loadingConfigLocation, refetch:refetchConfLocation } = useGetConfSeguridad(ubicacionSeleccionada);
  const [formatedDocs, setFormatedDocs] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      ubicacion:"",
      tema_cita:"",
      descripcion:"",
      perfil_pase: "Visita General",
      status_pase:"Proceso",
      visita_a: userNameSoter,
      custom: true,
      link:{
        link :`${protocol}//${host}/dashboard/pase-update`,
        docs : formatedDocs,
        creado_por_id: userIdSoter,
        creado_por_email: userEmailSoter
    },
      enviar_correo_pre_registro:enviar_correo_pre_registro, 
      tipo_visita_pase: "fecha_fija",
      fechaFija: "",
      fecha_desde_visita: "",
      fecha_desde_hasta: "",
      config_dia_de_acceso: "cualquier_día",
      config_dias_acceso: config_dias_acceso,
      config_limitar_acceso: 1,
      areas: [],
      comentarios: [],
      enviar_pre_sms:{
        from: "enviar_pre_sms",
        mensaje: "SOY UN MENSAJE",
        numero: "528120084370",
      },
    },
  });

  const toggleDia = (dia: string) => {
    set_config_dias_acceso((prev) => {
      const updatedDias = prev.includes(dia)
        ? prev.filter((d) => d !== dia) // Si ya está seleccionado, lo quitamos
        : [...prev, dia]; // Si no está seleccionado, lo añadimos
      return updatedDias;
    });
    
  };

  const errors = form.formState.errors;

  useEffect(()=>{
    console.error("ERRORES", errors)
  },[errors])


  useEffect(()=>{
    if(ubicacionSeleccionada){
      refetchConfLocation(ubicacionSeleccionada)
    }
  }, [ubicacionSeleccionada])

  useEffect(()=>{
    if(configLocation){
      const docs: string[] = []
      configLocation?.map((value:string)=>{
        if(value=="identificacion") {
          docs.push("agregarIdentificacion")}
        if(value=="fotografia") {
          docs.push("agregarFoto")}
      })
      setFormatedDocs(docs)
    }
  },[configLocation])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes datos:", data);
    
    const formattedData = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      ubicacion: data.ubicacion,
      tema_cita: data.tema_cita,
      descripcion: data.descripcion,
      perfil_pase: "Visita General",
      status_pase:"Proceso",
      visita_a: userNameSoter,
      custom:true,
      link:{
        link : data.link.link,
        docs : formatedDocs,
        creado_por_id: userIdSoter,
        creado_por_email: userEmailSoter
      },
      enviar_correo_pre_registro: enviar_correo_pre_registro, 
      tipo_visita_pase: data.tipo_visita_pase,
      fechaFija: data.fechaFija !=="" ? formatFecha(data.fechaFija)+`:00`:"",
      fecha_desde_visita: data.tipo_visita_pase === "fecha_fija"? (data.fechaFija !=="" ? formatFecha(data.fechaFija)+`:00`: "") : (data.fecha_desde_visita !== "" ? formatFecha(data.fecha_desde_visita)+`:00`:""),
      fecha_desde_hasta: data.fecha_desde_hasta !=="" ? formatFecha(data.fecha_desde_hasta)+`:00` : "",
      config_dia_de_acceso: config_dia_de_acceso === "limitar_días_de_acceso" ? config_dia_de_acceso : "cualquier_día",
      config_dias_acceso: config_dias_acceso,
      config_limitar_acceso: data.config_limitar_acceso,
      areas: [
        {
          nombre_area: "nose",
          comentario_area: "otra cosa",
        },
      ],
      comentarios: [
        {
          tipo_comentario: "Pase",
          comentario_pase: "nose",
        },
      ],
      enviar_pre_sms:{
        from: "enviar_pre_sms",
        mensaje: "SOY UN MENSAJE",
        numero: data.telefono,
      },
    };
    setModalData(formattedData);
    setIsSuccess(true);
  };
  const [isActive, setIsActive] = useState(false);
  const [isActiveSMS, setIsActiveSMS] = useState(false);
  const [isActiveAdvancedOptions, setIsActiveAdvancedOptions] = useState(false);

  const handleToggleEmail = () => {
    if (!form.getValues("email")) {
      form.setError("email", { type: "manual", message: "El campo email debe tener datos." });
    } else {
      form.clearErrors("email");
    }

      const email= "enviar_correo_pre_registro"
      set_enviar_correo_pre_registro((prev) => {
        const pre = prev.includes(email)
          ? prev.filter((d) => d !== email) // Si ya está seleccionado, lo quitamos
          : [...prev, email]; // Si no está seleccionado, lo añadimos
        return pre;
      });
      form.clearErrors("email");
    setIsActive(!isActive);

  };

  const handleToggleSMS = () => {
    if (!form.getValues("telefono")) {
      form.setError("telefono", { type: "manual", message: "El campo telefono debe tener datos." });
    } else {
      form.clearErrors("telefono");
    }
      const sms= "enviar_sms_pre_registro"
      set_enviar_correo_pre_registro((prev) => {
        const pre = prev.includes(sms)
          ? prev.filter((d) => d !== sms) // Si ya está seleccionado, lo quitamos
          : [...prev, sms]; // Si no está seleccionado, lo añadimos
        return pre;
      });
    setIsActiveSMS(!isActiveSMS);
  };

  const handleToggleAdvancedOptions = () => {
    setIsActiveAdvancedOptions(!isActiveAdvancedOptions);
  };

  return (
    <div className="p-8">
      <EntryPassModal
          title={"Confirmación"}
          data={modalData}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
        />

      <div className="flex flex-col space-y-5 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="font-bold text-2xl">Crear pase de entrada</h1>
        </div>

        <div className="flex justify-between">
          <p className="font-bold text-xl">Sobre la visita</p>
          <Link href="/dashboard/historial-de-pases">
            <Button
              className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
              variant="outline"
            >
              <List size={36} />
              Mis contactos
            </Button>
          </Link>
        </div>

        <div className="">
          <p className="font-bold">Tipo de pase : <span className="font-normal" > Visita General</span></p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <span className="text-red-500">*</span> Nombre Completo:
                    </FormLabel>{" "}
                    <FormControl>
                      <Input placeholder="Nombre Completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">
                        <span className="text-red-500">*</span> Email:
                      </FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="example@example.com" {...field}
                        onChange={(e) => {
                          field.onChange(e); // Asegúrate de seguir actualizando React Hook Form
                          // handleEmailChange(e); // Aquí llamamos a tu función personalizada
                        }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-red-500">*</span> Teléfono
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          value={field.value || ""}
                          onChange={(value) => {
                            form.setValue("telefono", value || "");
                          }}
                          placeholder="Teléfono"
                          defaultCountry="MX"
                          international={false}
                          withCountryCallingCode={false}
                          containerComponentProps={{
                            className:
                              "flex h-10 w-full rounded-md border border-input bg-background pl-3 py-0 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          }}
                          numberInputProps={{
                            className: "pl-3",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ubicacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación:</FormLabel>

                      { !loadingConfigLocation ? ( <>

                      <FormControl>
                        
                          <Select
                            onValueChange={(value:string) => {
                              field.onChange(value); 
                              setUbicacionSeleccionada(value);  // Actualiza el estado
                              // handleSelectLocation(value)
                            }}
                            value={field.value} 
                          >
                          <SelectTrigger className="w-full">
                          {loadingAreas?(
                            <>
                            <SelectValue placeholder="Cargando ubicaciónes..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona una ubicación" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {ubicaciones?.map((ubicacion:string, index:string) => (
                            <SelectItem key={index} value={ubicacion}>
                              {ubicacion}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        
                      </FormControl>

                      </>):(<>
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Cargando...</span>
                        </div>
                      </>)}
                      <FormMessage />
                    </FormItem>
                  )}
                />
             
                <FormField
                  control={form.control}
                  name="tema_cita"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="">
                         Tema cita:
                      </FormLabel>{" "}
                      <FormControl>
                        <Input placeholder="" {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
       

            <div className="grid gap-5">
              
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                       Descripción:
                    </FormLabel>{" "}
                    <FormControl>
                    <Textarea
                        placeholder="Escribe un comentario"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />         
            </div>
            
            <div className="flex gap-2 flex-col">
            <div className="">
              Metodo de envio: 
            </div>
            {/* Toggle Button */}
            <FormField
                control={form.control}
                name="toggleFieldEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <button
                        type="button"
                        onClick={handleToggleEmail}
                        className={`px-4 py-2 rounded-md transition-all duration-300 ${
                          isActive ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                        }`}
                      >
                        <div className="flex flex-wrap">
                          {isActive ? (
                            <><Mail className="mr-3" /><div className="">Enviar por correo</div></>
                          ):(
                            <><Mail className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por correo</div></>
                          )}
                            
                        </div>
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
                control={form.control}
                name="toggleFieldSMS"
                value ="enviar_sms_pre_registro"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <button
                        type="button"
                        onClick={handleToggleSMS}
                        className={`px-4 py-2 rounded-md transition-all duration-300 ${
                          isActiveSMS ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                        }`}
                      >
                        <div className="flex flex-wrap">
                          {isActiveSMS ? (
                            <><MessageCircleMore className="mr-3 text-white" /><div className="">Enviar por sms</div></>
                          ):(
                            <><MessageCircleMore className="mr-3 text-blue-600" /><div className="text-blue-600">Enviar por sms</div></>
                          )}
                            
                        </div>
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            
            <h1 className="font-bold text-xl">Sobre vigencia y acceso</h1>
            <FormField
                control={form.control}
                name="toggleFieldSMS"
                value={"enviar_sms_pre_registro"}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <button
                        type="button"
                        onClick={handleToggleAdvancedOptions}
                        className={`px-4 py-2 rounded-md transition-all duration-300 ${
                          isActiveAdvancedOptions ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                        }`}
                      >
                        <div className="flex flex-wrap">
                          {isActiveAdvancedOptions ? (
                            <><div className="">Opciones Avanzadas</div></>
                          ):(
                            <><div className="text-blue-600">Opciones Avanzadas</div></>
                          )}
                            
                        </div>
                      </button>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="tipo_visita_pase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visita de:</FormLabel>
                    <RadioGroup
                      value={tipoVisita}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTipoVisita(value);
                      }}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fecha_fija" />
                        </FormControl>
                        <FormLabel>Fecha Fija</FormLabel>
                      </FormItem>
                      {isActiveAdvancedOptions?(
                        <>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rango_de_fechas" />
                            </FormControl>
                            <FormLabel>Rango de Fechas</FormLabel>
                          </FormItem>
                        </>
                      ):null }
                      
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipoVisita === "fecha_fija" && (
                <FormField
                  control={form.control}
                  name="fechaFija"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <span className="text-red-500">*</span> Fecha y Hora de
                        Visita:
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {tipoVisita === "rango_de_fechas" && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="fecha_desde_visita"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-red-500">*</span> Fecha y Hora
                          de Visita:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            min={new Date().toISOString().slice(0, 16)} // Corta el exceso de datos
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fecha_desde_hasta"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-red-500">*</span> Fecha y Hora
                          Hasta:
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            min={new Date().toISOString().slice(0, 16)} // Corta el exceso de datos
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {isActiveAdvancedOptions?(
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Días de Acceso */}
                  <FormField
                    control={form.control}
                    name="config_dia_de_acceso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Días de acceso:</FormLabel>
                        <RadioGroup
                          value={config_dia_de_acceso}
                          onValueChange={(value) => {
                            field.onChange(value);
                            set_config_dia_de_acceso(value);
                          }}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="cualquier_día" />
                            </FormControl>
                            <FormLabel>Cualquier día</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="limitar_días_de_acceso" />
                            </FormControl>
                            <FormLabel>limitar días de acceso</FormLabel>
                          </FormItem>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Checkboxes de Días */}
                  {config_dia_de_acceso === "limitar_días_de_acceso" && (
                  
                    <div>
                      <FormLabel>Seleccione los días de acceso:</FormLabel>
                      <div className="grid grid-cols-2 gap-4 mt-2 mb-5">
                        {[
                          "Lunes",
                          "Martes",
                          "Miércoles",
                          "Jueves",
                          "Viernes",
                          "Sábado",
                          "Domingo"
                        ].map((dia) => {
                          return(
                            <FormItem key={dia.toLowerCase()} className="flex items-center space-x-3">
                              <FormControl>
                                <button
                                  type="button"
                                  onClick={() => toggleDia(dia.toLocaleLowerCase())}
                                  className={`px-4 py-2 rounded-md transition-all duration-300 ${
                                    config_dias_acceso.includes(dia.toLowerCase()) ? "bg-blue-600 text-white" : "border-2 border-blue-400 bg-transparent"
                                  }`}
                                >
                                  
                                  <div className="flex flex-wrap">
                                    {config_dias_acceso.includes(dia.toLowerCase()) ? (
                                      <><div className="">{dia}</div></>
                                    ):(
                                      <><div className="text-blue-600">{dia}</div></>
                                    )}
                                      
                                  </div>
                                </button>
                              </FormControl>
                            </FormItem>
                          )
                        })}
                      </div>
                        
                      {/* Límite de Accesos */}
                      <FormField
                        control={form.control}
                        name="config_limitar_acceso"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Limitar número de accesos:</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Ejemplo: 5" 
                                type="number"  // Establecer el tipo como 'number'
                                min={0}  // Opcional: Definir el valor mínimo
                                step={1}  // Opcional: Definir el paso de incremento
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                <div className="font-bold">Areas de acceso:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="nombre_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área de acceso:</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                            {loadingAreas?(
                                <>
                                <SelectValue placeholder="Cargando areas..." />
                                </>
                              ): (
                                <>
                                <SelectValue placeholder="Selecciona un área" />
                                </>
                              )}
                            </SelectTrigger>
                            <SelectContent>
                                {areas?.map((ubicacion:string, index:string) => 
                                  {
                                    return(
                                      <SelectItem key={index} value={ubicacion}>
                                        {ubicacion}
                                      </SelectItem>
                                    )
                                })}
                            
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Comentario */}
                  <FormField
                    control={form.control}
                    name="comentario_area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentario:</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escribe un comentario"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ):null}

            <div className="grid gap-5">
              <div className="font-bold">Comentarios/ Instrucciones:</div>
               {/* Comentario */}
               <FormField
                control={form.control}
                name="comentario_pase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comentario:</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escribe un comentario"
                        {...field}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {loadingAreas == false && loadingConfigLocation == false && loadingUbicaciones == false ? (<>
              <div className="text-center">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-2/3 md:w-1/2 lg:w-1/2"
                variant="secondary"
                type="submit"
              >
                Siguiente
              </Button>
            </div>
            </>):null}
            
          </form>
        </Form>

     
      </div>
    </div>
  );
};

export default PaseEntradaPage;


