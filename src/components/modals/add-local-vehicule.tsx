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
  tipo: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un tipo.",
  }),

  marca: z.array(z.string()).optional(),
  modelo: z.array(z.string()).optional(),
  estado: z.array(z.string()).optional(),
  placas: z.string().optional(),
  color: z.array(z.string()).optional(),
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
    if(!open)
		form.setValue("tipo", [""])
		form.setValue("marca", [""])
		form.setValue("modelo", [""])
		form.setValue("color", [""])
		form.setValue("estado", [""])
    	form.setValue("placas", "")
  }, [open]);



  return (
    <Dialog open={open} onOpenChange={setOpen} >
    <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-xl max-h-[90vh] flex flex-col" onInteractOutside={(e) => e.preventDefault()} aria-describedby=""
      > 
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto px-4"> 
			<Form {...form}>
				<form  className="space-y-8 ">
					<FormField
					control={form.control}
					name="tipo"
					render={({ field }) => (
						<FormItem>
						<FormLabel>* Tipo de vehículo</FormLabel>

						<Select
							aria-labelledby="aria-label"
							// ariaLiveMessages={{
							// onFocus,
							// }}
							inputId="aria-example-input"
							name="aria-live-color"
							// onMenuOpen={onMenuOpen}
							// onMenuClose={onMenuClose}
							options={tiposCat}
							onChange={(value:any) =>{
								field.onChange([value.value]);
								setCatalogSearch("marcas")
								setTipoVehiculoState(value.value);
								setMarcaState("")
								setMarcasCat([])
							}}
							isClearable
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
							}}
						/>

						{/* <Select
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
						</Select> */}
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
							aria-labelledby="aria-label"
							// ariaLiveMessages={{
							// onFocus,
							// }}
							inputId="aria-example-input"
							name="aria-live-color"
							// onMenuOpen={onMenuOpen}
							// onMenuClose={onMenuClose}
							options={marcasCat}
							onChange={(value:any) =>{
								field.onChange([value.value]);
								setMarcaState(value.value);
								setModelosCat([])
								setCatalogSearch("modelos")
							}}
							isClearable
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
							}}
						/>

						{/* <Select
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
						</Select> */}
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
							aria-labelledby="aria-label"
							// ariaLiveMessages={{
							// onFocus,
							// }}
							inputId="aria-example-input"
							name="aria-live-color"
							// onMenuOpen={onMenuOpen}
							// onMenuClose={onMenuClose}
							options={modelosCat}
							onChange={(value:any) => field.onChange([value.value])}
							isClearable
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
							}}
						/>
						{/* <Select onValueChange={(value) => field.onChange([value])}>
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
						</Select> */}
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
							aria-labelledby="aria-label"
							// ariaLiveMessages={{
							// onFocus,
							// }}
							inputId="aria-example-input"
							name="aria-live-color"
							// onMenuOpen={onMenuOpen}
							// onMenuClose={onMenuClose}
							options={catEstados}
							onChange={(value:any) => field.onChange([value.value])}
							isClearable
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
							}}
						/>

						{/* <Select onValueChange={(value) => field.onChange([value])}>
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
						</Select> */}
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
							aria-labelledby="aria-label"
							inputId="aria-example-input"
							name="aria-live-color"
							options={catColores}
							onChange={(selectedOption) => {
							field.onChange(selectedOption ? selectedOption.value : "");
							}}
							isClearable
							menuPortalTarget={document.body}
							styles={{
								menuPortal: (base) => ({ ...base, zIndex: 9999 ,pointerEvents: "auto",}),
							}}
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