import React, { useEffect, useState } from "react";
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
import { catalogoColores, catalogoTipoEquipos } from "@/lib/utils";
import { Equipo } from "@/lib/update-pass";
import EquipoItem from "./equipo-item";


interface EquipoListProps {
    equipos: Equipo[];
    setEquipos: (vehicle: Equipo[])=> void
  }

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

const EquipoList:React.FC<EquipoListProps> = ({ equipos, setEquipos})=> {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          vehicles: [{ tipo: "", marca: "", modelo: "", nombre: "", serie: "", color: "" }],
        },
    });
  
  const [cleanMain, setCleanMain] = useState(false);

  const handleAddEquipo = () => {
    
    const newEquipo:Equipo = {
      tipo:form.getValues('tipo')|| '',  // Valor inicial o el que desees
      marca: form.getValues('marca') || '',  // Valor inicial o el que desees
      modelo: form.getValues('modelo') || '',  // Valor inicial o el que desees
      nombre:form.getValues('nombre') || '',  // Valor inicial o el que desees
      serie:form.getValues('serie') || '',  // Valor inicial o el que desees
      color: form.getValues('color') || '' // Valor inicial o el que desees
    };
    console.log("VEHICULO E LISTA", newEquipo)
    setEquipos([...equipos, newEquipo]);
    setCleanMain(true)
  };

  // Función para eliminar el vehículo
  const handleDeleteEquipos = (index: number) => {
      setEquipos((prevState) => prevState.filter((_, i) => i !== index)); // Elimina el vehículo en el índice especificado
    };

  const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

  // Función para manejar la expansión y contracción del colapso
  const toggleCollapse = (index: number) => {
    if (collapsedIndex === index) {
      setCollapsedIndex(null);  // Si el vehículo ya está expandido, lo contraemos
    } else {
      setCollapsedIndex(index);  // Expandimos el vehículo
    }
  };

  useEffect(() => {
    //   refetch({account_id, tipo: "", marca:""}).then((response: any) => {
    //     const cat = response.data; 
    //     setTipoVehiculoState(""); 
    //     setTiposCat(cat); 
    //   }).catch((error:string)=> {
    //     console.error("Error al obtener tipos:", error);
    //   });
  }, []);

  useEffect(() => {
    if (cleanMain) {
      // Lógica para limpiar los campos del equipo
      form.setValue('tipo', '');
      form.setValue('marca', '');
      form.setValue('modelo', '');
      form.setValue('nombre', '');
      form.setValue('serie', '');
      form.setValue('color', '');
    }
  }, [cleanMain]);


  return (
    <div>
      {equipos.map((equipo, index) => (
        <div key={index} className="border rounded">
          <EquipoItem
            equipo={equipo}
            isCollapsed={collapsedIndex !== index}  // Controlar si está colapsado o no
            onToggleCollapse={() => toggleCollapse(index)}  // Función para alternar el colapso
            onDelete={() => handleDeleteEquipos(index)}
          />
        </div>
      ))}

        <Form {...form}>
          <form className="space-y-5 border p-8 rounded mt-4">
          <div className="font-bold text-lg">Agregar Equipo</div>
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
                            field.onChange(e); // Actualiza el valor en react-hook-form
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
                            field.onChange(e); // Actualiza el valor en react-hook-form
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
                            field.onChange(e); // Actualiza el valor en react-hook-form
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
                            field.onChange(e); // Actualiza el valor en react-hook-form
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
          </form>
        </Form>
        <div className="text-end  mt-3">
            <Button
            className="bg-blue-500 hover:bg-blue-600 text-white " 
            variant="secondary"
            onClick={handleAddEquipo} 
            >
            Agregar Equipo
            </Button>
        </div>
    </div>
  );
};

export default EquipoList;