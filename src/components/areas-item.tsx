/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Areas } from "@/hooks/useCreateAccessPass";
import { Label } from "@radix-ui/react-label";

const formSchema = 
	z.object({
		nombre_area: z.string().optional(),
		commentario_area: z.string().optional(),
	})

	interface AreasItemProps {
		isCollapsed: boolean;
		onToggleCollapse: () => void;
		index: number;
		onDelete: () => void;

		areaRaw: Areas;
		loadingCatAreas:boolean;
		catAreas:string[];
		updateArea: (value: string, fieldName:string ) => void;
	}

	const AreasItem: React.FC<AreasItemProps> = ({isCollapsed, onToggleCollapse, onDelete , 
		catAreas, loadingCatAreas, areaRaw, updateArea
	})=>  {

			const area = formatArea(areaRaw)
			const form = useForm<z.infer<typeof formSchema>>({
				resolver: zodResolver(formSchema),
				defaultValues: { nombre_area: "", commentario_area: "" }
		});

		useEffect(() => {
			if (areaRaw && catAreas) {
			  const formatted = formatArea(areaRaw);
			  form.reset({
				nombre_area: formatted?.nombre_area || "",
				commentario_area: formatted?.commentario_area || "",
			  });
			}
		  }, [areaRaw]);
		  

		interface AreaConNoteBooth {
			note_booth?: string;
			commentario_area?: string;
		}

		function formatArea(a:Areas | AreaConNoteBooth){
			if ('nombre_area' in a) {
				return a
			} else if ('note_booth' in a) {
				return {nombre_area: a.note_booth||"", commentario_area: a.commentario_area||""}
			}
		}

		
		const handleInputChange = (value:string, fieldName: string) => {
			if (value === "") {
				if (fieldName === "nombre_area") {
					onDelete(); 
				}
			}
			updateArea(value, fieldName);
		};


		
return (
	<div className="p-2">
		<div className="flex justify-between">
			{isCollapsed ? (<>
			<h3 className="font-bold text-lg ml-3 w-80 truncate">{area?.nombre_area}</h3>
			</>) : (<>
				<h3 className="font-bold text-lg ml-3 p-2 w-96 truncate">Datos del Área: {area?.nombre_area}</h3>
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
				<form className="space-y-5">
					{!isCollapsed && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 pt-2">
						<div className="form-item">
							<Label htmlFor="nombre_area" className="text-sm">
							Área:
							</Label>
							<Select
							value={form.watch("nombre_area")}
							onValueChange={(value) => {
								form.setValue("nombre_area", value, { shouldDirty: true });
								handleInputChange(value, "nombre_area");
							}}
							>

							<SelectTrigger className="w-full">
							{loadingCatAreas?(
								<>
								<SelectValue placeholder="Cargando tipos de areas..." />
								</>
							): (
								<>
								<SelectValue placeholder="Selecciona un tipo de areas" />
								</>
							)}
							</SelectTrigger>
							<SelectContent>
							{catAreas?.map((area:string, index:number) => (
								<SelectItem key={index} value={area}>
									{area}
								</SelectItem>
							))}
							</SelectContent>
							</Select>
						</div>

						<div className="form-item">
							<label htmlFor="commentario_area" className="text-sm"> Comentario: </label>
							<Input
								placeholder="Comentario"
								{...form.register("commentario_area")}
								onChange={(e) => {
									form.setValue("commentario_area", e.target.value, { shouldDirty: true });
									handleInputChange(e.target.value, "commentario_area");
								}}
								/>
						</div>
						</div>
					)}
				</form>
			
	</div>
);
};

export default AreasItem;