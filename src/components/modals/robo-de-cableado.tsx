import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { formSchema } from "./add-incidencia";
import { z } from "zod";
import { Button } from "../ui/button";

type FormData = z.infer<typeof formSchema>;

type Props = {
    control: Control<FormData>;
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
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white sm:w-2/3 md:w-1/2 lg:w-full mb-2" >
                        Dar seguimiento
                    </Button>
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