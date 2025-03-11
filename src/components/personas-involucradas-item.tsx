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
import { Label } from "@radix-ui/react-label";
import { PersonasInvolucradas } from "@/lib/incidencias";

const formSchema = 
    z.object({
        nombre_completo: z.string().optional(),
        tipo_persona: z.string().optional(),
    })

	interface PIItemProps {
		isCollapsed: boolean;
		onToggleCollapse: () => void;
		index: number;
		onDelete: () => void;

		PIRaw: PersonasInvolucradas;
		updateArea: (value: string, fieldName:string ) => void;
	}

	const AreasItem: React.FC<PIItemProps> = ({isCollapsed, onToggleCollapse, onDelete, PIRaw, updateArea
	})=>  {
			const personaInvolucrada = PIRaw
			const form = useForm<z.infer<typeof formSchema>>({
				resolver: zodResolver(formSchema),
				defaultValues: { nombre_completo: "", tipo_persona: "" }
		});

		useEffect(() => {
			if(personaInvolucrada){
				loadNewArea(personaInvolucrada)
			}
		}, [personaInvolucrada])

		function loadNewArea(item:PersonasInvolucradas){
			form.setValue('nombre_completo', item?.nombre_completo||"")
			form.setValue('tipo_persona', item?.tipo_persona||"")
		}
		
		const handleInputChange = (value:string, fieldName: string) => {
			if (value === "") {
				if (fieldName === "nombre_completo") {
					onDelete(); 
				}
			}
			updateArea(value, fieldName);
		};

return (
	<div className="p-2">
		<div className="flex justify-between">
			{isCollapsed ? (<>
			<h3 className="font-bold text-lg ml-3 w-80 truncate">{personaInvolucrada?.nombre_completo}</h3>
			</>) : (<>
				<h3 className="font-bold text-lg ml-3 p-2 w-96 truncate">Detalles involucrados: {personaInvolucrada?.nombre_completo}</h3>
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
					<>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 pt-2">
                            <div className="form-item">
                            <label htmlFor="commentario_area" className="text-sm"> Nombre completo: </label>
                            <Input
                                id="nombre_completo"
                                placeholder="Nombre completo"
                                {...form.register("nombre_completo")}
                                onChange={(e) => {
                                    form.setValue("nombre_completo", e.target.value);
                                    handleInputChange(e.target.value, "nombre_completo");
                                } }
                                value={form.getValues("nombre_completo")}
                                className="input-class" />
                            </div>
                            <div className="form-item">
                                <Label htmlFor="tipo_persona" className="text-sm">
                                    Tipo de persona:
                                </Label>
                                <Select
                                    onValueChange={(e) => {
                                        form.setValue("tipo_persona", e);
                                        handleInputChange(e, "tipo_persona");
                                    } }
                                    value={form.getValues("tipo_persona")}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecciona una opcion" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={"afectado"} value={"afectado"}>
                                            Afectado
                                        </SelectItem>
                                        <SelectItem key={"testigo"} value={"testigo"}>
                                            Testigo
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        
                    </>
					)}
				</form>
			
	</div>
);
};

export default AreasItem;