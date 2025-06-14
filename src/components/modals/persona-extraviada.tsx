import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { formSchema } from "./add-incidencia";
import { z } from "zod";

type FormData = z.infer<typeof formSchema>;

type Props = {
    control: Control<FormData>;
};
  
export function PersonaExtraviadaFields({ control }: Props) {
    return (
      <div>
        <FormField
          control={control}
          name="nombre_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Textarea {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
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
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  }