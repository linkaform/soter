/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { catalogoColores } from "@/lib/utils";
import { useGetVehiculos } from "@/hooks/useGetVehiculos";
import { Vehiculo } from "@/lib/update-pass";
import { useCatalogoEstados } from "@/hooks/useCatalogoEstados";
import VehicleItem from "./vehicle-item";


interface VehicleListProps {
    account_id: number;
    vehicles: Vehiculo[];
    setVehicles: Dispatch<SetStateAction<Vehiculo[]>>;
  }

  export const formSchema = 
    z.object({
      tipo: z.string().min(1,{message:"Tipo es un campo obligatorio"}),
      marca: z.string().optional(),
      modelo: z.string().optional(),
      estado: z.string().optional(),
      placas: z.string().optional(),
      color: z.string().optional()
    });

const VehicleList:React.FC<VehicleListProps> = ({ account_id, vehicles, setVehicles})=> {
    const [tipoVehiculoState, setTipoVehiculoState] = useState("");
    const [catalogSearch, setCatalogSearch] = useState("");
    const [marcaState, setMarcaState] = useState("");
    const {data:dataVehiculos,isLoading: loadingCat, refetch } = useGetVehiculos({account_id, tipo:tipoVehiculoState, marca:marcaState})
    const { data:catEstados, isLoading: loadingCatEstados } = useCatalogoEstados(account_id)

    const [tiposCat, setTiposCat] = useState<string[]>([]);
    const [marcasCat, setMarcasCat] = useState<string[]>([]);
    const [modelosCat, setModelosCat] = useState<string[]>([]);
    const [cleanMain, setCleanMain] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { tipo: "", marca: "", modelo: "", estado: "", placas: "", color: "" }});

    const onSubmit = (data: z.infer<typeof formSchema>) => {
      const newVehicle = {
        tipo:data.tipo ||"",  
        marca: data.marca||"",  
        modelo: data.modelo||"",  
        placas:data.placas||"",  
        estado: data.estado||"",  
        color: data.color||"" 
      };
      setVehicles([...vehicles, newVehicle]);
      setCleanMain(!cleanMain)
    };

    const handleDeleteVehicle = (index: number) => {
        setVehicles((prevState) => prevState.filter((_, i) => i !== index)); 
      };

    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };

    useEffect(() => {
        refetch()
        setTiposCat(dataVehiculos)
    }, []);

    useEffect(() => {
      console.log("QUE ESTA PASANDO", dataVehiculos, tipoVehiculoState,catalogSearch=="marcas")
      if(!tiposCat && dataVehiculos){
        setTiposCat(dataVehiculos)
      }
      if(dataVehiculos && tipoVehiculoState && catalogSearch=="marcas"){
        setMarcasCat(dataVehiculos)
      }
      if(dataVehiculos && tipoVehiculoState && marcaState && catalogSearch=="modelos"){
        setModelosCat(dataVehiculos)
      }
    }, [dataVehiculos]);

  useEffect(() => {
      form.setValue('tipo', '');
      form.setValue('marca', '');
      form.setValue('modelo', '');
      form.setValue('placas', '');
      form.setValue('estado', '');
      form.setValue('color', '');
  }, [cleanMain]);

  const updatedVehicles = (index: number, value: string, fieldName:string) => {
    const updatedAreas = [...vehicles];
      updatedAreas[index] = {
        ...updatedAreas[index],   // Mantener las propiedades anteriores del área
        [fieldName]: value,       // Actualizar el campo específico
      };
    setVehicles(updatedAreas);
  };

  return (
    <div>
      {vehicles.map((vehicle, index) => (
        <div key={index} className="border rounded mt-2">
          <VehicleItem
            account_id={account_id}
            vehicle={vehicle}
            isCollapsed={collapsedIndex !== index}  
            onToggleCollapse={() => toggleCollapse(index)}  
            onDelete={() => handleDeleteVehicle(index)}
            tiposCatPadre={tiposCat}
            modelosCatPadre={modelosCat}
            marcasCatPadre={marcasCat}
            updatedVehicles={(value:string, fieldName:string) => updatedVehicles(index, value, fieldName)}
          />
        </div>
      ))}

      <Form {...form}>
      <form className="space-y-5 border p-8 rounded mt-5" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="font-bold text-lg">Agregar vehiculo</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            {/* Tipo de Vehículo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Tipo de Vehículo:</FormLabel>
                  <FormControl>
                    <Select {...field} className="input"
                        onValueChange={(value:string) => {
                        field.onChange(value); 
                        setCatalogSearch("marcas")
                        setTipoVehiculoState(value);
                        setMarcaState("")
                        setMarcasCat([])
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
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Marca:</FormLabel>
                  <FormControl>
                  <Select {...field} className="input"
                        onValueChange={(value:string) => {
                        field.onChange(value); 
                        setMarcaState(value);  // Actualiza el estado
                        setModelosCat([])
                        setCatalogSearch("modelos")
                        refetch()
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
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Modelo:</FormLabel>
                  <FormControl>
                  <Select {...field} className="input"
                        onValueChange={(value:string) => {
                        field.onChange(value); 
                        // handleSelectChange("modelo", value)
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
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Matrícula:</FormLabel>
                  <FormControl>
                    <Input placeholder="Matrícula" {...field} 
                      onChange={(e) => {
                        field.onChange(e); // Actualiza el valor en react-hook-form
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
              render={({ field }:any) => (
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
              render={({ field }:any) => (
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
          <div className="text-end  mt-3">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white " 
                // variant="secondary"
                type="submit"
        
              >
                Agregar Vehiculo
              </Button>
            </div>
            
      </form>
      </Form>
          
    </div>
  );
};

export default VehicleList;