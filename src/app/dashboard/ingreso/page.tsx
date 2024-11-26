"use client";

import React, { useState } from "react";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodIssueCode } from "zod";

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
    equipoVehiculo: z.boolean(),

    /* Equipos */
    tipoEquipo: z.string().optional(),
    equipo: z.string().optional(),
    marcaEquipo: z.string().optional(),
    modeloEquipo: z.string().optional(),
    numeroSerieEquipo: z.string().optional(),
    colorEquipo: z.string().optional(),

    /* Vehículos */
    tipoVehiculo: z.string().optional(),
    marcaVehiculo: z.string().optional(),
    modeloVehiculo: z.string().optional(),
    estadoVehiculo: z.string().optional(),
    placasVehiculo: z.string().optional(),
    colorVehiculo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Solo valida si equipoVehiculo está marcado
    if (data.equipoVehiculo) {
      const requiredFields = [
        "tipoEquipo",
        "equipo",
        "marcaEquipo",
        "modeloEquipo",
        "numeroSerieEquipo",
        "colorEquipo",
        "tipoVehiculo",
        "marcaVehiculo",
        "modeloVehiculo",
        "estadoVehiculo",
        "placasVehiculo",
        "colorVehiculo",
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataAsRecord = data as Record<string, any>;

      requiredFields.forEach((field) => {
        if (!dataAsRecord[field]) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            path: [field],
            message: "Este campo es obligatorio.",
          });
        }
      });
    }
  });

const PaseEntradaPage = () => {

  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalData, setModalData] = useState<any>(null);


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
      equipoVehiculo: false,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {

    const formattedData = {
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      telefono: data.telefono,
      empresa: data.empresa,
      aQuienVisita: data.aQuienVisita,
      motivoVisita: data.motivoVisita,
    };

    setModalData(formattedData);
    setIsSuccess(true);
  };

  const equipoVehiculoChecked = form.watch("equipoVehiculo");

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
                  </FormLabel>{" "}
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
                    </FormLabel>{" "}
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
      <FormLabel> <span className="text-red-500">*</span> Teléfono</FormLabel>
      <FormControl
       >
        <PhoneInput
          {...field}
          value={field.value || ''}
          onChange={(value) => {
            form.setValue('telefono', value || '');
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
            className:
              "pl-3",
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
                      <span className="text-red-500">*</span>{" "}
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
                      <span className="text-red-500">*</span>{" "}
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

            <div className="flex justify-end">
              <FormField
                control={form.control}
                name="equipoVehiculo"
                render={({ field }) => (
                  <FormItem className="flex  items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="" htmlFor="equipoVehiculo">
                      Cargar equipo y/o vehículo
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Equipos */}

            {equipoVehiculoChecked && (
              <>
                <div className="">
                  <h1 className="font-medium text-2xl">Equipos</h1>
                </div>

                <div className="flex justify-between mt-3">
                  <p>Equipo 1</p>
                  <div className="flex">
                    <Plus className="cursor-pointer" />
                    <Minus className="cursor-pointer" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="tipoEquipo"
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
                    name="equipo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marcaEquipo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modeloEquipo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numeroSerieEquipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-red-500">*</span> Número de
                          Serie
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <Input placeholder="Número de Serie" {...field} />
                          </FormControl>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorEquipo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="">
                  <h1 className="font-medium text-2xl">Vehiculos</h1>
                </div>

                <div className="flex justify-between mt-3">
                  <p>Vehiculo 1</p>
                  <div className="flex">
                    <Plus className="cursor-pointer" />
                    <Minus className="cursor-pointer" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="tipoVehiculo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="marcaVehiculo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="modeloVehiculo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estadoVehiculo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placasVehiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="text-red-500">*</span> Placas
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <Input placeholder="placas" {...field} />
                          </FormControl>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="colorVehiculo"
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
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
