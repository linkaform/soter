"use client";

import React, { useState } from "react";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Camera, IdCard, Plus, Minus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterIncomeModal } from "@/components/modals/register-income-modal";
import { v4 as uuidv4 } from "uuid"; // Agrega esta librería para generar IDs únicos.

const formSchema = z
  .object({
    nombreCompleto: z.string().min(2, "El nombre completo es requerido."),
    email: z.string().email("Ingresa un correo válido."),
    telefono: z
      .string()
      .regex(/^\+\d{1,4}\d{7,14}$/, "Ingrese un número de teléfono válido."),
    empresa: z.string().min(2, "El nombre de la empresa es requerido."),
    aQuienVisita: z
      .string()
      .min(2, "El nombre de la persona que visita es requerido."),
    fotografia: z
      .any()
      .refine((file) => file instanceof File, "Sube una fotografía válida."),
    identificacion: z
      .any()
      .refine(
        (file) => file instanceof File,
        "Sube una identificación válida."
      ),
    motivoVisita: z
      .string()
      .min(5, "El motivo debe tener al menos 5 caracteres."),
    agregarVehiculo: z.boolean(),
    agregarEquipo: z.boolean(),
    vehiculos: z
      .array(
        z.object({
          tipoVehiculo: z.string().optional(),
          marcaVehiculo: z.string().optional(),
          modeloVehiculo: z.string().optional(),
          estadoVehiculo: z.string().optional(),
          placasVehiculo: z.string().optional(),
          colorVehiculo: z.string().optional(),
        })
      )
      .optional(),
    equipos: z
      .array(
        z.object({
          tipoEquipo: z.string().optional(),
          equipo: z.string().optional(),
          marcaEquipo: z.string().optional(),
          modeloEquipo: z.string().optional(),
          numeroSerieEquipo: z.string().optional(),
          colorEquipo: z.string().optional(),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // Validar los campos de los arrays dinámicos
    const validateArrayFields = (
      array: Record<string, string>[] | undefined,
      fields: string[],
      arrayName: "vehiculos" | "equipos",
      isEnabled: boolean
    ) => {
      if (isEnabled) {
        if (!array || array.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [arrayName],
            message: `El campo es obligatorio.`,
          });
          return;
        }
        array.forEach((item, index) => {
          fields.forEach((field) => {
            if (!item[field]) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [arrayName, index, field],
                message: `El campo es obligatorio.`,
              });
            }
          });
        });
      }
    };

    // Validar vehículos
    validateArrayFields(
      data.vehiculos,
      [
        "tipoVehiculo",
        "marcaVehiculo",
        "modeloVehiculo",
        "estadoVehiculo",
        "placasVehiculo",
        "colorVehiculo",
      ],
      "vehiculos",
      data.agregarVehiculo
    );

    // Validar equipos
    validateArrayFields(
      data.equipos,
      [
        "tipoEquipo",
        "equipo",
        "marcaEquipo",
        "modeloEquipo",
        "numeroSerieEquipo",
        "colorEquipo",
      ],
      "equipos",
      data.agregarEquipo
    );
  });

const PaseEntradaPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalData, setModalData] = useState<any>(null);
  const [equipos, setEquipos] = useState([{ id: uuidv4() }]);
  const [vehiculos, setVehiculos] = useState([{ id: uuidv4() }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCompleto: "",
      email: "",
      telefono: "",
      empresa: "",
      aQuienVisita: "",
      fotografia: undefined,
      identificacion: undefined,
      motivoVisita: "",
      agregarEquipo: false,
      agregarVehiculo: false,

      // Valores predeterminados para listas dinámicas
      equipos: [
        {
          tipoEquipo: "",
          equipo: "",
          marcaEquipo: "",
          modeloEquipo: "",
          numeroSerieEquipo: "",
          colorEquipo: "",
        },
      ],
      vehiculos: [
        {
          tipoVehiculo: "",
          marcaVehiculo: "",
          modeloVehiculo: "",
          estadoVehiculo: "",
          placasVehiculo: "",
          colorVehiculo: "",
        },
      ],
    },
  });

  // Configura los valores iniciales
  const defaultVehiculo = {
    id: uuidv4(),
    tipoVehiculo: "",
    marcaVehiculo: "",
    modeloVehiculo: "",
    estadoVehiculo: "",
    placasVehiculo: "",
    colorVehiculo: "",
  };

  const defaultEquipo = {
    id: uuidv4(),
    tipoEquipo: "",
    equipo: "",
    marcaEquipo: "",
    modeloEquipo: "",
    numeroSerieEquipo: "",
    colorEquipo: "",
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {

    const formattedData = {
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      telefono: data.telefono,
      empresa: data.empresa,
      aQuienVisita: data.aQuienVisita,
      motivoVisita: data.motivoVisita,
      agregarEquipo: data.agregarEquipo,
      agregarVehiculo: data.agregarVehiculo,
      fotografia: data.fotografia,
      identificacion: data.identificacion,

      // Datos dinámicos de equipos y vehículos
      equipos: data?.equipos?.map((equipo) => ({
        tipoEquipo: equipo.tipoEquipo,
        equipo: equipo.equipo,
        marcaEquipo: equipo.marcaEquipo,
        modeloEquipo: equipo.modeloEquipo,
        numeroSerieEquipo: equipo.numeroSerieEquipo,
        colorEquipo: equipo.colorEquipo,
      })),

      vehiculos: data?.vehiculos?.map((vehiculo) => ({
        tipoVehiculo: vehiculo.tipoVehiculo,
        marcaVehiculo: vehiculo.marcaVehiculo,
        modeloVehiculo: vehiculo.modeloVehiculo,
        estadoVehiculo: vehiculo.estadoVehiculo,
        placasVehiculo: vehiculo.placasVehiculo,
        colorVehiculo: vehiculo.colorVehiculo,
      })),
    };

    setModalData(formattedData);
    setIsSuccess(true);
  };

  // Métodos para manejar vehículos y equipos
  const agregarVehiculo = () => {
    setVehiculos((prev) => [...prev, { ...defaultVehiculo, id: uuidv4() }]);
  };

  const eliminarVehiculo = (id: string) => {
    if (vehiculos.length > 1) {
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const agregarEquipo = () => {
    setEquipos((prev) => [...prev, { ...defaultEquipo, id: uuidv4() }]);
  };

  const eliminarEquipo = (id: string) => {
    if (equipos.length > 1) {
      setEquipos((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const vehiculoChecked = form.watch("agregarVehiculo");
  const equipoChecked = form.watch("agregarEquipo");

  return (
    <div className="p-8">
      <div className="flex flex-col space-y-5 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="font-medium text-2xl">Registro de Ingreso</h1>
        </div>

        <p className="font-bold text-xl">Sobre la visita</p>

        <div className="">
          <p className="">Tipo de pase</p>

          <p className="text-sm">Visita General</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nombreCompleto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">
                    <span className="text-red-500">*</span> Nombre Completo:
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre Completo:" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <span className="text-red-500">*</span> Email:
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="example@example.com" {...field} />
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="empresa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <span className="text-red-500">*</span> Empresa:
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="aQuienVisita"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">
                      <span className="text-red-500">*</span> ¿A quíen visita?
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Texto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="fotografia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <Camera className="w-5 h-5 text-gray-500" />
                      <span className="text-red-500">*</span>
                      <span>Fotografía</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        capture="user" // Abre la cámara en dispositivos móviles
                        onChange={(e) =>
                          field.onChange(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="identificacion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2">
                      <IdCard className="w-5 h-5 text-gray-500" />
                      <span className="text-red-500">*</span>
                      <span>Identificación</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*" // Solo imágenes
                        onChange={(e) =>
                          field.onChange(
                            e.target.files ? e.target.files[0] : null
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="motivoVisita"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <span className="text-red-500">*</span> Motivo de visita
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Escribe el motivo de la visita"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row justify-end">
              <div className="space-y-4">
                {/* FormField para agregar vehículos */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="agregarVehiculo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel htmlFor="agregarVehiculo">
                          Agregar vehículo
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                {/* FormField para cargar equipos */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="agregarEquipo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel htmlFor="cargarEquipo">
                          Agregar equipo
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Equipos */}

            {equipoChecked && (
              <>
                <div className="">
                  <h1 className="font-medium text-2xl">Equipos</h1>
                </div>

                {equipos.map((equipo, index) => (
                  <div key={equipo.id} className="mt-3">
                    <div className="flex justify-between">
                      <p>{`Equipo ${index + 1}`}</p>
                      <div className="flex">
                        <Plus
                          className="cursor-pointer"
                          onClick={agregarEquipo}
                        />

                        {equipos.length > 1 && (
                          <Minus
                            className="cursor-pointer"
                            onClick={() => eliminarEquipo(equipo.id)}
                          />
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name={`equipos.${index}.tipoEquipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Tipo
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Herramienta">
                                  Herramienta
                                </SelectItem>
                                <SelectItem value="Computo">Computo</SelectItem>
                                <SelectItem value="Tablet">Tablet</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`equipos.${index}.equipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Equipo
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Pc">Pc</SelectItem>
                                <SelectItem value="Celular">Celular</SelectItem>
                                <SelectItem value="Tablet">Tablet</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`equipos.${index}.marcaEquipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Marca
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Apple">Apple</SelectItem>
                                <SelectItem value="Lenovo">Lenovo</SelectItem>
                                <SelectItem value="Msi">Msi</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`equipos.${index}.modeloEquipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Modelo
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* Opciones de modelos de PC */}
                                <SelectItem value="dell-xps-13">
                                  Dell XPS 13
                                </SelectItem>
                                <SelectItem value="macbook-pro-16">
                                  MacBook Pro 16
                                </SelectItem>
                                <SelectItem value="hp-spectre-x360">
                                  HP Spectre x360
                                </SelectItem>
                                <SelectItem value="lenovo-thinkpad-x1">
                                  Lenovo ThinkPad X1
                                </SelectItem>
                                <SelectItem value="asus-rog-zephyrus">
                                  ASUS ROG Zephyrus
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`equipos.${index}.numeroSerieEquipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Número de
                              Serie
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Número de Serie"
                                value={field.value || ""} 
                                onChange={field.onChange} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`equipos.${index}.colorEquipo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Color
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {/* Opciones de colores */}
                                <SelectItem value="rojo">Rojo</SelectItem>
                                <SelectItem value="azul">Azul</SelectItem>
                                <SelectItem value="verde">Verde</SelectItem>
                                <SelectItem value="amarillo">
                                  Amarillo
                                </SelectItem>
                                <SelectItem value="negro">Negro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            {vehiculoChecked && (
              <>
                <div className="">
                  <h1 className="font-medium text-2xl">Vehiculos</h1>
                </div>

                {vehiculos.map((vehiculo, index) => (
                  <div key={vehiculo.id} className="mt-3">
                    <div className="flex justify-between">
                      <p>{`Vehiculo ${index + 1}`}</p>
                      <div className="flex">
                        <Plus
                          className="cursor-pointer"
                          onClick={agregarVehiculo}
                        />

                        {vehiculos.length > 1 && (
                          <Minus
                            className="cursor-pointer"
                            onClick={() => eliminarVehiculo(vehiculo.id)}
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.tipoVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Tipo de
                              vehiculo
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="autobus">Autobús</SelectItem>
                                <SelectItem value="automovil">
                                  Automóvil
                                </SelectItem>
                                <SelectItem value="bicicleta">
                                  Bicicleta
                                </SelectItem>
                                <SelectItem value="camion">Camión</SelectItem>
                                <SelectItem value="moto">Moto</SelectItem>
                                <SelectItem value="pickup">Pick up</SelectItem>
                                <SelectItem value="remolque">
                                  Remolque
                                </SelectItem>
                                <SelectItem value="trailer">Tráiler</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.marcaVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Marca
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="toyota">Toyota</SelectItem>
                                <SelectItem value="honda">Honda</SelectItem>
                                <SelectItem value="ford">Ford</SelectItem>
                                <SelectItem value="nissan">Nissan</SelectItem>
                                <SelectItem value="chevrolet">
                                  Chevrolet
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.modeloVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Modelo
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="corolla">
                                  Toyota Corolla
                                </SelectItem>
                                <SelectItem value="civic">
                                  Honda Civic
                                </SelectItem>
                                <SelectItem value="mustang">
                                  Ford Mustang
                                </SelectItem>
                                <SelectItem value="altima">
                                  Nissan Altima
                                </SelectItem>
                                <SelectItem value="silverado">
                                  Chevrolet Silverado
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.estadoVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Estado
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cdmx">
                                  Ciudad de México
                                </SelectItem>
                                <SelectItem value="jalisco">Jalisco</SelectItem>
                                <SelectItem value="nuevo-leon">
                                  Nuevo León
                                </SelectItem>
                                <SelectItem value="estado-de-mexico">
                                  Estado de México
                                </SelectItem>
                                <SelectItem value="puebla">Puebla</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.placasVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Placas
                            </FormLabel>
                            <FormControl>
                              {/* Elimina el Select y usa Input directamente */}
                              <Input
                                placeholder="Placas"
                                value={field.value || ""} // Asegura que no pase de controlado a incontrolado
                                onChange={field.onChange} // Maneja el cambio de valor
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`vehiculos.${index}.colorVehiculo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <span className="text-red-500">*</span> Color
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rojo">Rojo</SelectItem>
                                <SelectItem value="azul">Azul</SelectItem>
                                <SelectItem value="negro">Negro</SelectItem>
                                <SelectItem value="blanco">Blanco</SelectItem>
                                <SelectItem value="gris">Gris</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="text-center">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white"
                variant="secondary"
                type="submit"
              >
                Siguiente
              </Button>
            </div>
          </form>
        </Form>

        <RegisterIncomeModal
          title={"Sobre la visita"}
          data={modalData}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
        />
      </div>
    </div>
  );
};

export default PaseEntradaPage;
