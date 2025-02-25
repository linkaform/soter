/* eslint-disable react-hooks/exhaustive-deps */
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

	interface VehicleItemProps {
	account_id: number;
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	onDelete: () => void;

	tiposCatPadre : string[]
	modelosCatPadre : string[]
	marcasCatPadre : string[]
	vehicle: Vehiculo;
	updatedVehicles: (value: string, fieldName:string ) => void;
	}

	const VehicleItem: React.FC<VehicleItemProps> = ({ account_id, isCollapsed, onToggleCollapse,onDelete, 
	tiposCatPadre, modelosCatPadre, marcasCatPadre, vehicle, updatedVehicles
	})=>  {
		const [tipoVehiculoState, setTipoVehiculoState] = useState("");
		const [marcaState, setMarcaState] = useState("");
		const [catalogSearch, setCatalogSearch] = useState("");

		const { data:dataVehiculos,isLoading: loadingCat, refetch } = useGetVehiculos({account_id, tipo:tipoVehiculoState, marca:marcaState})
		const { data:catEstados, isLoading: loadingCatEstados } = useCatalogoEstados(account_id)

		const [tiposCat, setTiposCat] = useState<string[]>(tiposCatPadre);
		const [marcasCat, setMarcasCat] = useState<string[]>(marcasCatPadre);
		const [modelosCat, setModelosCat] = useState<string[]>(modelosCatPadre);

		const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: { tipo: "", marca: "", modelo: "", estado: "", placas: "", color: "" },
	});

	useEffect(() => {
		if(vehicle?.tipo !==""){
			loadNewVehicle(vehicle)
		}else{
			refetch()
			setTiposCat(dataVehiculos)
		}
	}, [])


    useEffect(() => {
		if(!tiposCat && dataVehiculos){
		  setTiposCat(dataVehiculos)
		}
		console.log("helloooooo",dataVehiculos, catalogSearch)
		if(dataVehiculos && catalogSearch=="marcas"){
		  setMarcasCat(dataVehiculos)
		}
		if(dataVehiculos && catalogSearch=="modelos"){
		  setModelosCat(dataVehiculos)
		}
	  }, [dataVehiculos]);

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
			refetch()
		}
	}, [tipoVehiculoState]);

	useEffect(() => {
		if (marcaState) {
			refetch()
		}
	}, [marcaState]);

	// useEffect(()=>{
	// 	if(loadingCat){
	// 		console.log("loadingCat",loadingCat)
	// 	}
	// },[loadingCat])
	const handleInputChange = (value:string, fieldName: string) => {
		if (value === "") {
			if (fieldName === "tipo") {
				onDelete(); 
			}
		}
		updatedVehicles(value, fieldName);
	};

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
							render={({ field }:any) => (
								<FormItem>
									<FormLabel>Tipo de Vehículo:</FormLabel>
									<FormControl>
										<Select {...field} className="input"
												onValueChange={(value:string) => {
												handleInputChange(value, "tipo"); 
												field.onChange(value); 
												setMarcasCat([])
												setCatalogSearch("marcas")
												setTipoVehiculoState(value)
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
												handleInputChange(value, "marca"); 
												field.onChange(value); 
												setModelosCat([])
												setMarcaState(value)
												setCatalogSearch("modelos")
											}}
											value={field.value} 
										>
											<SelectTrigger className="w-full">
											{loadingCat && catalogSearch=="marcas"? (
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
												handleInputChange(value, "mdoelo"); 
											}}
											value={field.value} 
										>
											<SelectTrigger className="w-full">
											{loadingCat && catalogSearch=="modelos"?(
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
												field.onChange(e); 
												handleInputChange(e.target.value, "placas"); 
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
												handleInputChange(value, "estado"); 
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
												handleInputChange(value, "color"); 
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