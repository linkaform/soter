/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Comentarios } from "@/hooks/useCreateAccessPass";
// import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const formSchema = 
	z.object({
	tipo_comentario: z.string().optional(),
	comentario_pase: z.string().optional(),
	})

interface ComentariosItemProps {
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	index: number;
	onDelete: () => void;
	comentario: Comentarios;
	tipo:string;
	updateComentario: (newComentario: string) => void;
}

  const ComentariosItem: React.FC<ComentariosItemProps> = ({isCollapsed, onToggleCollapse, onDelete, comentario, tipo, updateComentario})=>  {
	  	const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
			defaultValues: { tipo_comentario: "", comentario_pase: "" },
	});

	useEffect(() => {
		if(comentario?.tipo_comentario !==""){
			loadNewArea(comentario)
		}
	}, [])

	function loadNewArea(item:Comentarios){
	  	form.setValue('tipo_comentario', tipo)
	  	form.setValue('comentario_pase', item?.comentario_pase)
	}

	const onComentarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newComentario = e.target.value;
		if (newComentario === "") {
				onDelete();
			} else {
				updateComentario(newComentario);
			}
	  };

  return (
	<div className="p-8 mb-4">
		  <div className="flex justify-between">
			  {isCollapsed ? (<>
				  <h3 className="font-bold text-lg mb-3 w-80 truncate">{comentario.comentario_pase}</h3>
			  </>) : (<>
				  <h3 className="font-bold text-lg mb-3 w-96 truncate">Datos del comentario o instrucción: {comentario.comentario_pase}</h3>
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
		  {/* <Form {...form}>
         <form className="space-y-5">
            {!isCollapsed && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
                        <FormField
                        control={form.control}
                        name="comentario_pase"
                        render={({ field }:any) => (
                            <FormItem>
                                <FormLabel>Comentario o Instrucción:</FormLabel>
                                <FormControl>
                                        <Input placeholder="Comentario" {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Actualiza el valor en react-hook-form
                                            onComentarioChange(e);
                                        }}
                                        value={field.value || ""}
                                        />
                                </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
            )}
         </form>
     </Form> */}

		    <form onSubmit={form.handleSubmit((data) => console.log("Formulario enviado con:", data))} className="space-y-5">
				{!isCollapsed && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						<div>
							<Input
								id="comentario_pase"
								placeholder="Comentario"
								{...form.register("comentario_pase")}
								onChange={(e) => {
									form.setValue("comentario_pase", e.target.value);
									onComentarioChange(e); 
								} }
								value={form.getValues("comentario_pase") || ""}
								className="input-class" />
						</div>
					</div>
				)}
		  	</form>
	  </div>
  );
};

export default ComentariosItem;