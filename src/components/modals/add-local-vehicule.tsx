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
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { useGetLocalVehiculos } from "@/hooks/useLocalCatVehiculos";
import { Vehiculo } from "@/lib/update-pass";
import { useAccessStore } from "@/store/useAccessStore";


interface Props {
  title: string;
  children: React.ReactNode;
  vehicles: Vehiculo[];
  setVehiculos: Dispatch<SetStateAction<Vehiculo[]>>;
  isAccesos:boolean;
}


const formSchema = z.object({
  tipo: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un tipo.",
  }),

  marca: z.array(z.string()).optional(),
  modelo: z.array(z.string()).optional(),
  estado: z.array(z.string()).optional(),
  placas: z.string().optional(),
  color: z.array(z.string()).optional(),
})

export const VehiclePassModal: React.FC<Props> = ({ title, children, vehicles, setVehiculos, isAccesos }) => {
  const [open, setOpen] = useState(false);
  const [tipoVehiculoState, setTipoVehiculoState] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [marcaState, setMarcaState] = useState("");
  const [tiposCat, setTiposCat] = useState<string[]>([]);
  const [marcasCat, setMarcasCat] = useState<string[]>([]);
  const [modelosCat, setModelosCat] = useState<string[]>([]);
  const {data:dataVehiculos,isLoading: loadingCat } = useGetLocalVehiculos({ tipo:tipoVehiculoState, marca:marcaState, isModalOpen:true})
  const setSelectedVehiculos = useAccessStore((state) => state.setSelectedVehiculos);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: [],
      marca: [],
      estado: [],
      modelo: [],
      placas: "",
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
      "Vehiculo agregado correctamente."
    );

    setOpen(false);
  }

  const addNewVehicle = (data: z.infer<typeof formSchema>) => {
	console.log("placas", data)
	if(isAccesos){
		setSelectedVehiculos([{
			color: data.color?.length ? data.color[0] :"",
			marca: data.marca?.length ? data.marca[0] :"",
			modelo:data.modelo?.length ?  data.modelo[0] : "",
			estado: data.estado?.length ? data.estado[0] :"",
			placas: data.placas||"",
			tipo: data?.tipo? data.tipo[0]: "",
		  }])
		setVehiculos([{
			color: data.color?.length ? data.color[0] :"",
			marca: data.marca?.length ? data.marca[0] :"",
			modelo:data.modelo?.length ?  data.modelo[0] : "",
			estado: data.estado?.length ? data.estado[0] :"",
			placas: data.placas||"",
			tipo:  data?.tipo? data.tipo[0]: "",
		},
		...vehicles,
		]);
	}
    setVehiculos([
      {
        color: data.color?.length ? data.color[0] :"",
        marca: data.marca?.length ? data.marca[0] :"",
        modelo:data.modelo?.length ?  data.modelo[0] : "",
        estado: data.estado?.length ? data.estado[0] :"",
        placas: data.placas||"",
        tipo:  data?.tipo? data.tipo[0]: "",
      },
      ...vehicles,
    ]);
  };

  useEffect(() => {
    if(!open)
    form.setValue("placas", "")
  }, [open]);



  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>

      <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4">
			<Form {...form}>
				<form  className="space-y-8 ">
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
									<SelectValue placeholder="Selecciona una opción" />
							</SelectTrigger>
							</FormControl>
							<SelectContent>
								{marcasCat.length>0?(
									<>
									{marcasCat?.map((item: string) => (
										<SelectItem key={item} value={item}>
										{item}
										</SelectItem>
									))}
									</>
								):(
									<SelectItem key={0} value={"0"} disabled> Selecciona un tipo para ver las opciones</SelectItem>
								)}
							
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
								<SelectValue placeholder="Selecciona una opción" />
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
					name="placas"
					render={({ field }) => (
						<FormItem>
						<FormLabel>* Placas</FormLabel>
						<FormControl>
							<Input
							maxLength={20}
							{...field}
							value={field.value?.toUpperCase() || ""}
							onChange={(e) => field.onChange(e.target.value)}
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

				
				</form>
			</Form>
      	</div>
	 	<div  className="flex gap-2">
			<DialogClose asChild>
			<Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
				Cancelar
			</Button>
			</DialogClose>

			<Button
			onClick={form.handleSubmit(onSubmit)}
			type="submit"
			className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
			>
			Agregar
			</Button>
		</div>

      </DialogContent>

    </Dialog>
  );
};