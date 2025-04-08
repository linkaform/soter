import React, { Dispatch, SetStateAction, useState } from "react";
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

import { Input } from "@/components/ui/input";
import { Comentarios } from "@/hooks/useCreateAccessPass";
import ComentariosItem from "./comentarios-item";

interface ComentariosListProps {
		comentarios: Comentarios[];
		setComentarios: Dispatch<SetStateAction<Comentarios[]>>;
		tipo:string;
	}

const formSchema = 
	z.object({
		tipo_comentario: z.string().optional(),
		comentario_pase: z.string().min(1,{message:"Comentario es un campo obligatorio"}),
});

const ComentariosList:React.FC<ComentariosListProps> = ({comentarios, setComentarios, tipo })=> {
	const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: { tipo_comentario: tipo||"pase", comentario_pase: "",}});

	const onSubmitComentarios = (data: z.infer<typeof formSchema>) => {
		const newComentario = {
			tipo_comentario:tipo ||"pase",  
			comentario_pase: data.comentario_pase||"",  
		};
		setComentarios([...comentarios, newComentario]);
		cleanInputs()
	};

	const handleDeleteVehicle = (index: number) => {
			setComentarios((prevState) => prevState.filter((_, i) => i !== index)); // Elimina el vehículo en el índice especificado
		};

	const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

	const toggleCollapse = (index: number) => {
		if (collapsedIndex === index) {
			setCollapsedIndex(null);  
		} else {
			setCollapsedIndex(index);
		}
	};

	const cleanInputs =() =>{
		form.setValue('comentario_pase', '');
	}

	const updateComentario = (index: number, newComentario: string) => {
		const updatedComentarios = [...comentarios];
		updatedComentarios[index].comentario_pase = newComentario;
		updatedComentarios[index].tipo_comentario = tipo;
		setComentarios(updatedComentarios);
	};

return (
	<div>
		{comentarios.map((comentario, index) => (
			<div key={index} className="border rounded mt-2">
				<ComentariosItem
					comentario={comentario}
					isCollapsed={collapsedIndex !== index}
					onToggleCollapse={() => toggleCollapse(index)}
					index={index}
					onDelete={() => handleDeleteVehicle(index)}
					updateComentario={(newComentario: string) => updateComentario(index, newComentario)} 
					tipo={tipo}/>
			</div>
		))}

		<Form {...form} >
		<div className="border p-8 rounded mt-5">
			<div className="font-bold text-lg">Agregar comentario o instrucción</div>
			<div className="grid  gap-5" >
				{/* Comentario */}
				<FormField
					control={form.control}
					name="comentario_pase"
					render={({ field }:any) => (
						<FormItem>
							<FormLabel>Comentario o instrucción:</FormLabel>
							<FormControl>
								<Input placeholder="Comentario" {...field} 
									onChange={(e) => {
										field.onChange(e); 
									}}
									value={field.value || ""}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="text-end  mt-3">
				<Button
					className="bg-blue-500 hover:bg-blue-600 text-white" 
					type="button"
					onClick={(e) => {
						e.preventDefault();
						form.handleSubmit(onSubmitComentarios)(); 
					}}
				>
					Agregar Comentario
				</Button>
			</div>

		</div>
			
		{/* </form> */}
		
		</Form>
		
	</div>
);
};
	
	export default ComentariosList;