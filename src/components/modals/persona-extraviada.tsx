import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

type Props = {
    control: any;
};
  
export function PersonaExtraviadaFields({ control }: Props) {
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
						<FormControl><Input {...field}  /></FormControl>
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
						<FormControl><Input {...field}  placeholder="Edad..."
							onChange={(e) => {
								const value = e.target.value;
								if (/^\d*\.?\d*$/.test(value)) {
								field.onChange(Number(value)); 
								}
							}}
						 /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					  control={control}
					  name="color_piel"
					  render={({ field }:any) => (
						<FormItem className="w-full">
							<FormLabel>Color de piel</FormLabel>
							<FormControl>
								<Select {...field} className="input"
									onValueChange={(value: string) => {
										field.onChange(value);
									} }
									value={field.value}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecciona una opción" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem key={"Muy clara"} value={"Muy clara"}>Muy clara</SelectItem>
										<SelectItem key={"Clara"} value={"Clara"}>Clara</SelectItem>
										<SelectItem key={"Trigueña clara"} value={"Trigueña clara"}>Trigueña clara</SelectItem>
										<SelectItem key={"Trigueña"} value={"Trigueña"}>Trigueña</SelectItem>
										<SelectItem key={"Morena"} value={"Morena"}>Morena</SelectItem>
										<SelectItem key={"Oscura"} value={"Oscura"}>Oscura</SelectItem>
										<SelectItem key={"Muy oscura"} value={"Muy oscura"}>Muy oscura</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
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
						<FormControl><Input {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="estatura_aproximada"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Estatura apróximada</FormLabel>
						<FormControl>
							<Input placeholder="Estatura apróximada..." {...field}
							 onChange={(e) => {
								const value = e.target.value;
								if (/^\d*\.?\d*$/.test(value)) {
									const numericValue = value !== '' && !value.endsWith('.') ? parseFloat(value) : value;
									console.log("valor", numericValue)
									field.onChange(numericValue);
								}
							}}
							/>
						</FormControl>
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
						<FormControl><Textarea  {...field}  /></FormControl>
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
						<FormControl><Input {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="parentesco"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Parentesco</FormLabel>
						<FormControl><Input {...field}  /></FormControl>
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
						<FormControl><Input {...field}  /></FormControl>
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
						<FormControl><Input {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="info_coincide_con_videos"
					render={({ field }) => (
						<FormItem>
						<FormLabel>La información coincide con los videos?</FormLabel>
						<FormControl>
							<div className="flex gap-2 ">
								<button
								type="button"
								onClick={() => field.onChange("sí")}
								className={`px-6 py-2 rounded ${
									field.value === "sí"
									? "bg-blue-600 text-white "
									: "bg-white-200 text-blue-600 border border-blue-500 "
								}`}
								>
								Sí
								</button>
								<button
								type="button"
								onClick={() => field.onChange("no")}
								className={`px-6 py-2 rounded ${
									field.value === "no"
									? "bg-blue-600 text-white"
									: "bg-white-200 text-blue-600 border border-blue-500"
								}`}
								>
								No
								</button>
							</div>
						</FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="responsable_que_entrega"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Responsable que reporta</FormLabel>
						<FormControl><Input {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					{/* <FormField
					control={control}
					name="responsable_que_recibe"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Responsable que recibe</FormLabel>
						<FormControl><Input {...field}  /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/> */}
			</div>
      	</div>
    );
  }