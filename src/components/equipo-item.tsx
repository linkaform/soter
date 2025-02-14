/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { catalogoColores, catalogoTipoEquipos } from "@/lib/utils";
import { Equipo } from "@/lib/update-pass";

export const formSchema = 
    z.array(
      z.object({
        tipo: z.string().refine((val) => val.trim().length > 0, {
          message: "El tipo es obligatorio",
        }),
        marca: z.string().optional(),
        modelo: z.string().optional(),
        nombre: z.string().optional(),
        serie: z.string().optional(),
        color: z.string().optional()
      })
    );

  interface EquipoItemProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    onDelete: () => void;
    equipo: Equipo;
  }

  const EquipoItem: React.FC<EquipoItemProps> = ({isCollapsed, onToggleCollapse,onDelete, equipo
  })=>  {
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          equipos: [{ tipo: "", marca: "", modelo: "", nombre: "", serie: "", color: "" }],
        },
    });

    useEffect(() => {
      if(equipo?.tipo !==""){
        loadNewEquipo(equipo)
      }
    }, [])


    function loadNewEquipo(equipo:Equipo){
      form.setValue('tipo', equipo?.tipo)
      form.setValue('nombre', equipo?.nombre)
      form.setValue('modelo', equipo?.modelo)
      form.setValue('marca', equipo?.marca)
      form.setValue('serie', equipo?.serie)
      form.setValue('color', equipo?.color)
    }

  return (
    <div className="p-8 mb-4">
      {/* Confirmar Pase de entrada modal */}
      <div className="flex justify-between">
        {isCollapsed ? (<>
        <h3 className="font-bold text-lg mb-3">{equipo?.tipo}</h3>
        </>) : (<>
          <h3 className="font-bold text-lg mb-3">Datos del Equipo: {equipo?.tipo}</h3>
        </>)}
        <div className="flex justify-between gap-5">
          <button onClick={onToggleCollapse} className="text-blue-500">
            {isCollapsed ? 'Abrir' : 'Cerrar'}
          </button>
          
          <button onClick={onDelete} className="text-blue-500">
              {isCollapsed ? 'Eliminar' : 'Eliminar'}
          </button>
        </div>
        
      </div>
        <Form {...form}>
          <form className="space-y-5">
          {!isCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
               <>
                    {/* Tipo de Equipo */}
                    <FormField
                      control={form.control}
                      name="tipo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Equipo:</FormLabel>
                          <FormControl>
                          <Select {...field} className="input"
                            onValueChange={(value:string) => {
                            field.onChange(value); 
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                          {catalogoTipoEquipos().length>0 ?(
                            <>
                            <SelectValue placeholder="Cargando tipos de vehiculos..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona un tipo de vehiculo" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {catalogoTipoEquipos()?.map((vehiculo:string, index:number) => (
                            <SelectItem key={index} value={vehiculo}>
                              {vehiculo}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Nombre del Equipo */}
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Equipo:</FormLabel>
                          <FormControl>
                          <Input placeholder="Nombre" {...field} 
                          onChange={(e) => {
                            field.onChange(e); 
                            // handleSelectChange("placas", e.target.value); // Acción adicional
                          }}
                          value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Marca */}
                    <FormField
                      control={form.control}
                      name="marca"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca:</FormLabel>
                          <FormControl>
                          <Input placeholder="Marca " {...field}
                           onChange={(e) => {
                            field.onChange(e); 
                            // handleSelectChange("placas", e.target.value); // Acción adicional
                          }}
                          value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* No. de Serie */}
                    <FormField
                      control={form.control}
                      name="serie"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. de Serie:</FormLabel>
                          <FormControl>
                          <Input placeholder="No. serie" {...field}
                          onChange={(e) => {
                            field.onChange(e); 
                            // handleSelectChange("placas", e.target.value); // Acción adicional
                          }}
                          value={field.value || ""}  />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Modelo */}
                    <FormField
                      control={form.control}
                      name="modelo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo:</FormLabel>
                          <FormControl>
                          <Input placeholder="Modelo" {...field} 
                          onChange={(e) => {
                            field.onChange(e); 
                            // handleSelectChange("placas", e.target.value); // Acción adicional
                          }}
                          value={field.value || ""} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Color */}
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color:</FormLabel>
                          <FormControl>
                          <Select {...field} className="input"
                            onValueChange={(value:string) => {
                            field.onChange(value); 
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                          {catalogoColores().length>0 ? (
                            <>
                            <SelectValue placeholder="Cargando tipos de vehiculos..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona un tipo de vehiculo" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {catalogoColores().map((color:string) => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </>
            </div>
          )}
          </form>
        </Form>
      </div>
  );
};

export default EquipoItem;