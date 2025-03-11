/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { AccionesTomadas } from "@/lib/incidencias";

const formSchema = 
    z.object({
        acciones_tomadas: z.string().optional(),
        responsable_accion: z.string().optional(),
    })

	interface ATItemProps {
		isCollapsed: boolean;
		onToggleCollapse: () => void;
		index: number;
		onDelete: () => void;

		ATRaw: AccionesTomadas;
		updateArea: (value: string, fieldName:string ) => void;
	}

	const AccionesTomadasItem: React.FC<ATItemProps> = ({isCollapsed, onToggleCollapse, onDelete, ATRaw, updateArea
	})=>  {
			const personaInvolucrada = ATRaw
			const form = useForm<z.infer<typeof formSchema>>({
				resolver: zodResolver(formSchema),
				defaultValues: { acciones_tomadas: "", responsable_accion: "" }
		});

		useEffect(() => {
			if(personaInvolucrada){
				loadNewArea(personaInvolucrada)
			}
		}, [personaInvolucrada])

		function loadNewArea(item:AccionesTomadas){
			form.setValue('acciones_tomadas', item?.acciones_tomadas||"")
			form.setValue('responsable_accion', item?.responsable_accion||"")
		}
		
		const handleInputChange = (value:string, fieldName: string) => {
			if (value === "") {
				if (fieldName === "acciones_tomadas") {
					onDelete(); 
				}
			}
			updateArea(value, fieldName);
		};

return (
	<div className="p-2">
		<div className="flex justify-between">
			{isCollapsed ? (<>
			<h3 className="font-bold text-lg ml-3 w-80 truncate">{personaInvolucrada?.acciones_tomadas}</h3>
			</>) : (<>
				<h3 className="font-bold text-lg ml-3 p-2 w-96 truncate">Detalles de la acción: {personaInvolucrada?.acciones_tomadas}</h3>
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
                                id="acciones_tomadas"
                                placeholder="Nombre completo"
                                {...form.register("acciones_tomadas")}
                                onChange={(e) => {
                                    form.setValue("acciones_tomadas", e.target.value);
                                    handleInputChange(e.target.value, "acciones_tomadas");
                                } }
                                value={form.getValues("acciones_tomadas")}
                                className="input-class" />
                            </div>
                            <div className="form-item">
                                <Label htmlFor="responsable_accion" className="text-sm">
                                    Responsable Acción:
                                </Label>
                                <Input
                                id="responsable_accion"
                                placeholder="Nombre completo"
                                {...form.register("responsable_accion")}
                                onChange={(e) => {
                                    form.setValue("responsable_accion", e.target.value);
                                    handleInputChange(e.target.value, "responsable_accion");
                                } }
                                value={form.getValues("responsable_accion")}
                                className="input-class" />
                            </div>
                        </div>
                        
                    </>
					)}
				</form>
			
	</div>
);
};

export default AccionesTomadasItem;