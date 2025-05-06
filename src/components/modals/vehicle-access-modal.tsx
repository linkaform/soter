/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Input } from "../ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { catalogoColores, catalogoEstados } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useGetVehiculos } from "@/hooks/useGetVehiculos";
import React from "react";
import { useAccessStore } from "@/store/useAccessStore";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";

interface Props {
  title: string;
  children: React.ReactNode;
}


const formSchema = z.object({
  tipo: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un tipo.",
  }),

  marca: z.array(z.string()).nonempty({
    message: "Campo requerido.",
  }),
  modelo: z.array(z.string()).nonempty({
    message: "Campo requerido.",
  }),
  estado: z.array(z.string()).nonempty({
    message: "Campo requerido.",
  }),
  matricula: z.string().min(2, {
    message: "Campo requerido.",
  }),
  color: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un color.",
  }),
})

export const VehiclePassModal: React.FC<Props> = ({ title, children }) => {
  const { newVehicle, setNewVehicle } = useAccessStore();
  const { userIdSoter } = useAuthStore();
  const [open, setOpen] = useState(false);

  const [tipoVehiculoState, setTipoVehiculoState] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [marcaState, setMarcaState] = useState("");
  
  const [tiposCat, setTiposCat] = useState<string[]>([]);
  const [marcasCat, setMarcasCat] = useState<string[]>([]);
  const [modelosCat, setModelosCat] = useState<string[]>([]);

  const {data:dataVehiculos,isLoading: loadingCat } = useGetVehiculos({ account_id: userIdSoter, tipo:tipoVehiculoState, marca:marcaState, isModalOpen:true})

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: [],
      marca: [],
      estado: [],
      modelo: [],
      matricula: "",
      color: [],
    },
  });


    useEffect(() => {
      setTiposCat(dataVehiculos)
  }, []);

  useEffect(() => {
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

  function onSubmit(data: z.infer<typeof formSchema>) {
    addNewVehicle(data);

    form.reset();

    toast.success(
      "Vehiculo listo para agregar al registro de ingreso."
    );

    setOpen(false);
  }


  // const { data: tiposVehiculo,  } = useGetVehiculos({
  //   tipo,
  //   account_id: userIdSoter,
  //   marca,
  //   isModalOpen: true,
  // });

 

  // const { data: marcasVehiculo} = useGetVehiculos({
  //   tipo,
  //   account_id: userIdSoter
  // });

  // const { data: modelosVehiculo } =
  //   useGetVehiculos({ tipo,  account_id: userIdSoter, marca });

  const addNewVehicle = (data: z.infer<typeof formSchema>) => {
    setNewVehicle([
      {
        color_vehiculo: data.color[0],
        marca_vehiculo: data.marca[0],
        modelo_vehiculo: data.modelo[0],
        nombre_estado: data.estado[0],
        placas_vehiculo: data.matricula,
        tipo_vehiculo: data.tipo[0],
      },
      ...newVehicle,
    ]);
  };

  // const isLoading = isLoadingMarcas || isLoadingModelos;




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>
{/* 
				<div className="overflow-y-auto">
					<VehicleList
						vehicles={vehiculos}
						setVehicles={setVehiculos} account_id={userIdSoter} isModalOpen={open}/>
					<p className="text-red-500" > Agrega almenos un elemento para actualizar. </p>
				</div> */}
				
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-x-4 gap-y-8">
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Tipo de vehículo</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange([value]);
                        setCatalogSearch("marcas")
                        setTipoVehiculoState(value);
                        setMarcaState("")
                        setMarcasCat([])
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                      </FormControl>
                      <SelectContent>
                        {tiposCat?.map((item: string) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Marca</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange([value]);
                        setMarcaState(value);
                        setModelosCat([])
                        setCatalogSearch("modelos")
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                      </FormControl>
                      <SelectContent>
                        {marcasCat?.map((item: string) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Modelo</FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])}>
                      <FormControl>
                        <SelectTrigger>
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
                      </FormControl>
                      <SelectContent>
                        {modelosCat?.map((item: string) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Estado</FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catalogoEstados().map((estado: string) => (
                          <SelectItem key={estado} value={estado}>
                            {estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Placas</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Texto"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Color</FormLabel>
                    <Select onValueChange={(value) => field.onChange([value])}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una opción" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catalogoColores().map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <p className="text-gray-400">**Campos requeridos </p>

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
              >
                Agregar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  );
};