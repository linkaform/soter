/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Select from 'react-select';
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

import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { catalogoColores, catalogoEstados } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import React from "react";
import { toast } from "sonner";
import { useGetLocalVehiculos } from "@/hooks/useLocalCatVehiculos";
import { Vehiculo } from "@/lib/update-pass";
import { useAccessStore } from "@/store/useAccessStore";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";
import { catalogoColores, catalogoEstados } from "@/lib/utils";


interface Props {
  title: string;
  children: React.ReactNode;
  vehicles: Vehiculo[];
  setVehiculos: Dispatch<SetStateAction<Vehiculo[]>>;
  isAccesos:boolean;
  id?:string;
  fetch?:boolean;
}


const formSchema = z.object({
	tipo: z.array(z.string()).min(1, "Debe seleccionar un tipo."),
	marca: z.array(z.string()).min(1, "Debe seleccionar una marca."),
	modelo: z.array(z.string()).min(1, "Debe seleccionar un modelo."),
	estado: z.array(z.string()).optional(),
	placas: z.string().optional(),
	color: z.array(z.string()).min(1, "Debe seleccionar un color."),
})

export const VehicleLocalPassModal: React.FC<Props> = ({ title, children, vehicles, setVehiculos, isAccesos , id="", fetch=false}) => {
  const [open, setOpen] = useState(false);
  const [tipoVehiculoState, setTipoVehiculoState] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [marcaState, setMarcaState] = useState("");
  const [tiposCat, setTiposCat] = useState<string[]>([]);
  const [marcasCat, setMarcasCat] = useState<string[]>([]);
  const [modelosCat, setModelosCat] = useState<string[]>([]);
  const {data:dataVehiculos } = useGetLocalVehiculos({ tipo:tipoVehiculoState, marca:marcaState, isModalOpen:true})
  const setSelectedVehiculos = useAccessStore((state) => state.setSelectedVehiculos);
  const { updateBitacoraMutation,isLoading }= useUpdateBitacora()
  const catEstados = catalogoEstados().map((tipo: any) => ({
	value: tipo,
	label: tipo
  }));
  const catColores = catalogoColores().map((tipo: any) => ({
	value: tipo,
	label: tipo
  }));

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
		const opcionesTipos = dataVehiculos.map((tipo: any) => ({
			value: tipo,
			label: tipo
		  }));
      setTiposCat(opcionesTipos)
    }
    if(dataVehiculos && tipoVehiculoState && catalogSearch=="marcas"){
		const opcionesMarcas = dataVehiculos.map((marca: any) => ({
			value: marca,
			label: marca
		  }));
      setMarcasCat(opcionesMarcas)
    }
    if(dataVehiculos && tipoVehiculoState && marcaState && catalogSearch=="modelos"){
		const opcionesModelos = dataVehiculos.map((modelo: any) => ({
			value: modelo,
			label: modelo
		  }));
      setModelosCat(opcionesModelos)
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
	if(isAccesos){
		if (data?.tipo[0]=="")

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
	}else{
		if(fetch){
			updateBitacoraMutation.mutate({
				vehiculo: {
					color: data.color?.length ? data.color[0] : "",
					marca: data.marca?.length ? data.marca[0] : "",
					modelo: data.modelo?.length ? data.modelo[0] : "",
					estado: data.estado?.length ? data.estado[0] : "",
					placas: data.placas || "",
					tipo: data?.tipo ? data.tipo[0] : "",
				},
				id: id,
			}, )
		}else{
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
		}
	}
  };

  useEffect(() => {
	if (!open) {
	  form.setValue("tipo", []);
	  form.setValue("marca", []);
	  form.setValue("modelo", []);
	  form.setValue("color", []);
	  form.setValue("estado", []);
	  form.setValue("placas", "");
	}
  }, [open]);
  


  return (
    <Dialog open={open} onOpenChange={setOpen} >
    <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-xl flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby=""
      > 
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className=" px-4"> 
			<Form {...form}>
				<form  className="space-y-8 ">
				<FormField
				control={form.control}
				name="tipo"
				render={({ field }) => (
					<FormItem>
					<FormLabel>* Tipo de vehículo</FormLabel>

					<Select
						value={
						field.value?.length
							? { value: field.value[0], label: field.value[0] }
							: null
						}
						options={tiposCat}
						onChange={(value: any) => {
						if (value) {
							field.onChange([value.value]);  
							setCatalogSearch("marcas");
							setTipoVehiculoState(value.value);
							setMarcaState("");
							setMarcasCat([]);
						} else {
							field.onChange([]); 
						}
						}}
						isClearable
						styles={{
						menuPortal: (base) => ({ ...base, zIndex: 9999 }),
						}}
					/>

					<FormMessage />
					</FormItem>
				)}
				/>


					<FormField
					control={form.control}
					name="marca"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Marca</FormLabel>
						<Select
							options={marcasCat}
							className="react-select-marca no-animation"
							onChange={(value: any) => {
								if (value) {
									field.onChange([value.value]);
									setMarcaState(value.value);
									setModelosCat([]);
									setCatalogSearch("modelos");
								} else {
									field.onChange([]);
									setMarcaState("");
									setModelosCat([]);
								}
							}}
							isClearable
						/>

						<FormMessage />
						</FormItem>
					)}
					/>

					<FormField
					control={form.control}
					name="modelo"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Modelo</FormLabel>

						<Select
							options={modelosCat}
							className="react-select-modelo"
							onChange={(value: any) => {
								field.onChange(value ? [value.value] : []); // ← array o vacío
							}}
							isSearchable
							isClearable
						/>

						
						<FormMessage />
						</FormItem>
					)}
					/>

					<FormField
					control={form.control}
					name="estado"
					render={({ field }) => (
						<FormItem>
						<FormLabel> Estado</FormLabel>
						<Select
							options={catEstados}
							className="react-select-estado"
							onChange={(value: any) => {
								field.onChange(value ? [value.value] : []); // ← no "" ni undefined
							}}
							isClearable
						/>

						<FormMessage />
						</FormItem>
					)}
					/>

					<FormField
					control={form.control}
					name="placas"
					render={({ field }) => (
						<FormItem>
						<FormLabel> Placas</FormLabel>
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
						<FormLabel> Color</FormLabel>
						<Select
							options={catColores}
							className="react-select-color"
							onChange={(selectedOption) => {
								field.onChange(selectedOption ? [selectedOption.value] : []); 
							}}
							isSearchable
							isClearable
						/>

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
			disabled={isLoading}
			className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
			>
			{ isLoading? "Cargando..." : "Agregar"} 
			</Button>
		</div>

      </DialogContent>

    </Dialog>
  );
};