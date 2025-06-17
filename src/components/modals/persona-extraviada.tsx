import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props = {
    control: any;
	data:any
};
  
export function PersonaExtraviadaFields({ control,data }: Props) {
	console.log("data", data)
    return (
     	 <div>
          	<div className="mb-2 font-bold text-lg">Persona extraviada</div>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<FormField
					control={control}
					name="nombre_completo_persona_extraviada"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Nombre Completo</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="edad"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Edad</FormLabel>
						<FormControl><Input defaultValue="" {...field}   /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="color_piel"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Color piel</FormLabel>
						<FormControl><Input defaultValue="" {...field}   /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="color_cabello"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Color cabello</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="estatura_aproximada"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Estatura aproximada</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="descripcion_fisica_vestimenta"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Descripción fisica de la vestimenta</FormLabel>
						<FormControl><Textarea defaultValue=""  {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="nombre_completo_responsable"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Nombre completo:</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="prentesco"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Parentesco</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
						<FormField
					control={control}
					name="num_doc_identidad"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Numero documento de identidad:</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="telefono"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Telefono: </FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="info_coincide_con_videos"
					render={({ field }) => (
						<FormItem>
						<FormLabel>La informacion coincide con los videos?</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="responsable_que_entrega"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Responsable que entrega</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="responsable_que_recibe"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Responsable que recibe</FormLabel>
						<FormControl><Input defaultValue="" {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
			</div>
      	</div>
    );
  }