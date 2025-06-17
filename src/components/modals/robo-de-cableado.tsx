import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type Props = {
    control: any;
};
  
export function RoboDeCableado({ control }: Props) {
    return (
     	 <div>
          	<div className="mb-2 font-bold text-lg flex justify-between">
                <div>
                    <p>Robo</p>
                    <small className="font-normal">Informacion del objeto</small>

                </div>
                <div className="flex justify-between">
                    
                </div>
            </div>
            
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<FormField
					control={control}
					name="nombre_completo"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Valor estimado de lo sustraído:</FormLabel>
						<FormControl><Input defaultValue="" {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="edad"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Pertenencias sustraídas:</FormLabel>
						<FormControl><Input defaultValue="" {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
			</div>
      	</div>
    );
  }