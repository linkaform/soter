import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";


type Props = {
    control: any;
};
  
export function RoboDeVehiculo({ control }: Props) {
    return (
     	 <div>
          	<div className="mb-2 font-bold text-lg flex justify-between">
                <div>
                    <p>Robo</p>
                    <small className="font-normal">Informacion del Vehiculo</small>
                </div>
            </div>
            
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<FormField
					control={control}
					name="placas"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Placas:</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="tipo"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Tipo de vehiculo:</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="marca"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Marca:</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="modelo"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Modelo:</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
					<FormField
					control={control}
					name="color"
					render={({ field }) => (
						<FormItem>
						<FormLabel>Color:</FormLabel>
						<FormControl><Input {...field} /></FormControl>
						<FormMessage />
						</FormItem>
					)}
					/>
			</div>
      	</div>
    );
  }