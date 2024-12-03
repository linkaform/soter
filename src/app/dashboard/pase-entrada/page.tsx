"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";

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

const formSchema = z
  .object({
    nombreCompleto: z.string().min(2, {
      message: "Por favor, ingresa un tu nombre completo",
    }),
    email: z.string().email({
      message: "Por favor, ingresa un correo electrónico válido.",
    }),
    telefono: z
      .string()
      .regex(/^\+\d{1,4}\d{7,14}$/, "Ingrese un número de teléfono válido."),
    metodo: z.enum(["email", "sms"], {
      required_error: "Seleccione un método de envío.",
    }),
    visita: z.enum(["fija", "rango"], {
      required_error: "Seleccione un tipo de fecha.",
    }),
    fechaFija: z.string().optional(),
    fechaInicio: z.string().optional(),
    fechaHasta: z.string().optional(),

    area: z.string().min(1, { message: "Por favor, selecciona un área." }),
    comentario: z
      .string()
      .min(5, { message: "El comentario debe tener al menos 5 caracteres." })
      .max(500, {
        message: "El comentario no debe exceder los 500 caracteres.",
      }),

    // Días de Acceso
    tipoAcceso: z.enum(["cualquierDia", "limitar"], {
      required_error: "Seleccione un tipo de acceso.",
    }),
    diasSeleccionados: z
      .array(
        z.enum(["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"])
      )
      .optional(),
    limiteAccesos: z
      .string()
      .optional()
      .refine((val) => (val ? !isNaN(Number(val)) && Number(val) > 0 : true), {
        message:
          "Ingrese un número válido mayor a 0 para el límite de accesos.",
      }),
  })
  .refine(
    (data) =>
      data.tipoAcceso === "cualquierDia" ||
      (data.diasSeleccionados && data.diasSeleccionados.length > 0),
    {
      message: "Seleccione al menos un día si limita el acceso.",
      path: ["diasSeleccionados"], // Apunta al campo correspondiente
    }
  );

const PaseEntradaPage = () => {
  const [tipoVisita, setTipoVisita] = useState("fija");
  const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
  const [tipoAcceso, setTipoAcceso] = useState("cualquierDia");
  const [isSuccess, setIsSuccess] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modalData, setModalData] = useState<any>(null);

  console.log(diasSeleccionados);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreCompleto: "",
      email: "",
      telefono: "",
      metodo: "email",
      visita: "fija",
      fechaFija: "",
      fechaInicio: "",
      fechaHasta: "",
      tipoAcceso: "cualquierDia",
      diasSeleccionados: [],
      limiteAccesos: "",
      area: "",
      comentario: "",
    },
  });

  const toggleDia = (dia: string) => {
    setDiasSeleccionados((prev) => {
      const updatedDias = prev.includes(dia)
        ? prev.filter((d) => d !== dia) // Si ya está seleccionado, lo quitamos
        : [...prev, dia]; // Si no está seleccionado, lo añadimos

      return updatedDias;
    });
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con:", {
      ...data,
      diasSeleccionados:
        tipoAcceso === "limitar" ? diasSeleccionados : "Cualquier día",
    });

    const formattedData = {
      tipoPase: "Visita General",
      estatus: "Proceso",
      nombreCompleto: data.nombreCompleto,
      email: data.email,
      telefono: data.telefono,
      fechaFija: data.fechaFija,
      fechaInicio: data.fechaInicio,
      fechaHasta: data.fechaHasta,
      diasSeleccionados:
        tipoAcceso === "limitar" ? diasSeleccionados : ["Cualquier día"], // Incluye los días seleccionados

      areasAcceso: [
        {
          area: data.area,
          comentarios: data.comentario,
        },
      ],
      comentariosGenerales: [
        {
          tipo: "General",
          comentarios: data.comentario,
        },
      ],
    };

    setModalData(formattedData);
    setIsSuccess(true);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col space-y-5 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="font-medium text-2xl">Pase de entrada</h1>
        </div>

        <Link href="/dashboard/historial-de-pases">
          <Button
            className="bg-blue-500 text-white hover:text-white hover:bg-blue-600"
            variant="outline"
            size="icon"
          >
            <List size={36} />
          </Button>
        </Link>

        <p className="font-bold text-xl">Sobre la visita</p>

        <div className="">
          <p className="">Tipo de pase</p>

          <p className="text-sm">Visita General</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="nombreCompleto"
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
                    <FormLabel>
                      {" "}
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
            <FormField
              control={form.control}
              name="metodo"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Metodo de envío</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <div className="flex flex items-center ">
                            <Mail className="mr-3" />

                            <RadioGroupItem value="email" />
                          </div>
                        </FormControl>
                        <FormLabel className="font-normal ">
                          Enviar correo
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <div className="flex flex items-center ">
                            <MessageCircleMore  className="mr-3"/>
                            <RadioGroupItem value="sms" />
                          </div>
                        </FormControl>
                        <FormLabel className="font-normal">
                          Enviar sms
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <h1 className="font-bold text-xl">Sobre vigencia y acceso</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="visita"
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
                          <RadioGroupItem value="fija" />
                        </FormControl>
                        <FormLabel>Fecha Fija</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="rango" />
                        </FormControl>
                        <FormLabel>Rango de Fechas</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {tipoVisita === "fija" && (
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

              {tipoVisita === "rango" && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
                  <FormField
                    control={form.control}
                    name="fechaInicio"
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
                    name="fechaHasta"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Días de Acceso */}
              <FormField
                control={form.control}
                name="tipoAcceso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de acceso:</FormLabel>
                    <RadioGroup
                      value={tipoAcceso}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTipoAcceso(value);
                      }}
                      className="flex flex-col space-y-2"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cualquierDia" />
                        </FormControl>
                        <FormLabel>Cualquier día</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="limitar" />
                        </FormControl>
                        <FormLabel>Limitar días de acceso</FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Checkboxes de Días */}
              {tipoAcceso === "limitar" && (
                <div>
                  <FormLabel>Seleccione los días de acceso:</FormLabel>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    {[
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                    ].map((dia) => (
                      <FormItem
                        key={dia}
                        className="flex items-center space-x-3"
                      >
                        <FormControl>
                          <Checkbox
                            id={dia}
                            checked={diasSeleccionados.includes(dia)}
                            onCheckedChange={() => toggleDia(dia)}
                          />
                        </FormControl>
                        <FormLabel htmlFor={dia}>{dia}</FormLabel>
                      </FormItem>
                    ))}
                  </div>

                  {/* Límite de Accesos */}
                  <FormField
                    control={form.control}
                    name="limiteAccesos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limitar número de accesos:</FormLabel>
                        <FormControl>
                          <Input placeholder="Ejemplo: 5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
     
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área de acceso:</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona un área" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Almacén de inventario">
                            Almacén de inventario
                          </SelectItem>
                          <SelectItem value="Almacén de Materia Prima">
                            Almacén de Materia Prima
                          </SelectItem>
                          <SelectItem value="Antenas">Antenas</SelectItem>
                          <SelectItem value="Caseta 1 - Mty">
                            Caseta 1 - Mty
                          </SelectItem>
                      
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
                name="comentario"
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

        <EntryPassModal
          title={"Confirmación"}
          data={modalData}
          isSuccess={isSuccess}
          setIsSuccess={setIsSuccess}
        />
      </div>
    </div>
  );
};

export default PaseEntradaPage;
