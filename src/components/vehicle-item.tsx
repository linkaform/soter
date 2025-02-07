import React, { useEffect, useState } from "react";
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
import { catalogoColores } from "@/lib/utils";
import { useGetVehiculos } from "@/hooks/useGetVehiculos";
import { Vehiculo } from "@/lib/update-pass";
import { useCatalogoEstados } from "@/hooks/useCatalogoEstados";


export const formSchema = 
    z.array(
      z.object({
        tipo: z.string().refine((val) => val.trim().length > 0, {
          message: "El tipo es obligatorio",
        }),
        marca: z.string().optional(),
        modelo: z.string().optional(),
        estado: z.string().optional(),
        placas: z.string().optional(),
        color: z.string().optional()
      })
    );

  interface VehicleItemProps {
    account_id: number;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    index: number;
    onDelete: () => void;

    tiposCatPadre : string[]
    modelosCatPadre : string[]
    marcasCatPadre : string[]
    vehicle: Vehiculo;
  }

  const VehicleItem: React.FC<VehicleItemProps> = ({ account_id, isCollapsed, onToggleCollapse,onDelete,index, 
    tiposCatPadre, modelosCatPadre, marcasCatPadre, vehicle,
  })=>  {
      //  
      const [tipoVehiculoState, setTipoVehiculoState] = useState("");
      const [marcaState, setMarcaState] = useState("");

      const { isLoading: loadingCat, refetch } = useGetVehiculos({account_id, tipo:tipoVehiculoState, marca:marcaState})
      const { data:catEstados, isLoading: loadingCatEstados } = useCatalogoEstados(account_id)

      const [tiposCat, setTiposCat] = useState<string[]>(tiposCatPadre);
      const [marcasCat, setMarcasCat] = useState<string[]>(marcasCatPadre);
      const [modelosCat, setModelosCat] = useState<string[]>(modelosCatPadre);

      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          vehicles: [{ tipo: "", marca: "", modelo: "", estado: "", placas: "", color: "" }],
        },
    });

    useEffect(() => {
      
      if(vehicle?.tipo !==""){
        loadNewVehicle(vehicle)
        
      }else{
        refetch({account_id, tipo: "", marca:""}).then((response: any) => {
          const cat = response.data; 
          setTipoVehiculoState(""); 
          setTiposCat(cat); 
        }).catch((error:string)=> {
          console.error("Error al obtener tipos:", error);
        });
      }
    }, [])


    function loadNewVehicle(vehicle:Vehiculo){
  
      form.setValue('tipo', vehicle?.tipo)
      form.setValue('marca', vehicle?.marca)
      form.setValue('modelo', vehicle?.modelo)
      form.setValue('color', vehicle?.color)
      form.setValue('estado', vehicle?.estado)
      form.setValue('placas', vehicle?.placas)
    }

    useEffect(() => {
      if (tipoVehiculoState) {
        refetch({account_id, tipo: tipoVehiculoState}).then((response: any) => {
          const cat = response.data; 
          setMarcaState(""); 
          console.log("MARCAS en segunda vuelta", cat, tipoVehiculoState)
          setMarcasCat(cat); 
        }).catch((error:string)=> {
          console.error("Error al obtener marcas:", error);
        });
      }
    }, [tipoVehiculoState]);

    useEffect(() => {
      if (marcaState) {
        setModelosCat([]);
        refetch({account_id, tipo:tipoVehiculoState, marca:marcaState}).then((response: any) => {
          const cat = response.data; 
          setModelosCat(cat); 
        }).catch((error:string)=> {
          console.error("Error al obtener modelos:", error);
        });
      }
    }, [marcaState]);

  return (
    <div className="p-8 mb-4">
      {/* Confirmar Pase de entrada modal */}
      <div className="flex justify-between">
        {isCollapsed ? (<>
        <h3 className="font-bold text-lg mb-3">{vehicle?.tipo}</h3>
        </>) : (<>
          <h3 className="font-bold text-lg mb-3">Datos del Vehículo : {vehicle?.tipo}</h3>
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
                {/* Tipo de Vehículo */}
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Vehículo:</FormLabel>
                      <FormControl>
                        <Select {...field} className="input"
                            onValueChange={(value:string) => {
                              console.log("ontoyyyyyyyy", value)
                            field.onChange(value); 
                            setTipoVehiculoState(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                          {loadingCat?(
                            <>
                            <SelectValue placeholder="Cargando tipos de vehiculo..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona un tipo de vehiculo" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {tiposCat?.map((vehiculo:string, index:number) => (
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

                {/* Marca */}
                <FormField
                  control={form.control}
                  name="marca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marca:</FormLabel>
                      <FormControl>
                      <Select {...field} className="input"
                            onValueChange={(value:string) => {
                            field.onChange(value); 
                            setMarcaState(value);  // Actualiza el estado
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                          {loadingCat?(
                            <>
                            <SelectValue placeholder="Cargando marcas de vehículos..." />
                            </>
                          ): (
                            <>
                              {marcasCat?.length <= 0 ?(
                              <>  
                                <SelectValue placeholder="Selecciona tipo de vehiculo para ver los registros " />
                              </>
                              ):(
                                <>
                                <SelectValue placeholder="Selecciona una opción" />
                                </>
                              )}
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {marcasCat?.map((marca:string, index:number) => {
                            return(
                              <SelectItem key={index} value={marca}>
                                {marca}
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

                {/* Modelo */}
                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo:</FormLabel>
                      <FormControl>
                      <Select {...field} className="input"
                            onValueChange={(value:string) => {
                            field.onChange(value); 
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                          {loadingCat?(
                            <>
                            <SelectValue placeholder="Cargando modelos..." />
                            </>
                          ):(
                            <>
                              {modelosCat?.length <= 0 ?(
                              <>  
                                <SelectValue placeholder="Selecciona una marca para ver los registros" />
                              </>
                              ):(
                                <>
                                <SelectValue placeholder="Selecciona una opción" />
                                </>
                              )}
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {modelosCat?.map((modelo:string, index:number) => {
                            return (
                              <SelectItem key={index} value={modelo}>
                                {modelo}
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

                {/* Matrícula */}
                <FormField
                  control={form.control}
                  name="placas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula:</FormLabel>
                      <FormControl>
                        <Input placeholder="Matrícula" {...field} 
                          onChange={(e) => {
                            field.onChange(e); 
                            // handleSelectChange("placas", e.target.value); // Acción adicional
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Estado */}
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado:</FormLabel>
                      <FormControl>
                      <Select {...field} className="input"
                            onValueChange={(value:string) => {
                            field.onChange(value); 
                            // handleSelectChange("estado", value)
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                          {loadingCatEstados?(
                            <>
                            <SelectValue placeholder="Cargando estados..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona un estado" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {catEstados?.map((ubicacion:string, index:string) => (
                            <SelectItem key={index} value={ubicacion}>
                              {ubicacion}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
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
                            // handleSelectChange("color", value)
                          }}
                          value={field.value} 
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona un color" />
                          </SelectTrigger>
                          <SelectContent>
                          {catalogoColores().map((vehiculo:string) => (
                            <SelectItem key={vehiculo} value={vehiculo}>
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
                </div>
          )}
          </form>
        </Form>
      </div>
  );
};

export default VehicleItem;