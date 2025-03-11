/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AccionesTomadas } from "@/lib/incidencias";
import AccionesTomadasItem from "./acciones-tomadas-item";


interface AccionesTOmadasListProps {
    accionesTomadas: AccionesTomadas[];
    setAccionesTomadas: Dispatch<SetStateAction<AccionesTomadas[]>>
}

const formSchema = 
    z.object({
        acciones_tomadas: z.string().min(1,{message:"Área es un campo obligatorio"}),
        responsable_accion: z.string().optional(),
});

const PersonasInvolucradasList:React.FC<AccionesTOmadasListProps> = ({ accionesTomadas, setAccionesTomadas})=> {
    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { acciones_tomadas: "", responsable_accion: "",}});

    const onSubmitArea = (data: z.infer<typeof formSchema>) => {
        const isAreaExists = accionesTomadas.some(at => at.acciones_tomadas === data.acciones_tomadas);
        if (isAreaExists) {
            form.setError("acciones_tomadas", {
            type: "manual",
            message: "Esta acción ya fué agregada, edita o elimina la acción.",
            });
            return; 
        }

      const newPI = {
        acciones_tomadas:data.acciones_tomadas ||"",  
        responsable_accion: data.responsable_accion||"",  
      };
      setAccionesTomadas([...accionesTomadas, newPI]);
      cleanInputs()
    };

    const handleDeleteArea = (index: number) => {
        setAccionesTomadas((prevState) => prevState.filter((_, i) => i !== index)); 
      };


    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };
    
    const cleanInputs =() =>{
        form.setValue('acciones_tomadas', '');
        form.setValue('responsable_accion', '');
    }

    const updatedAT = (index: number, value: string, fieldName:string) => {
        const updatedAreas = [...accionesTomadas];
          updatedAreas[index] = {
            ...updatedAreas[index],  
            [fieldName]: value, 
          };
        setAccionesTomadas(updatedAreas);

        if (fieldName === "acciones_tomadas" && accionesTomadas.some(at => at.acciones_tomadas === value)) {
            setAccionesTomadas((prevState) => prevState.filter((at) => at.acciones_tomadas !== value));
        }
    };

  return (
    <div >
      {accionesTomadas.map((at, index) => 
      { 
        return(
        <div key={index} className="border rounded mt-2">
          <AccionesTomadasItem
            ATRaw={at}
            isCollapsed={collapsedIndex !== index}
            onToggleCollapse={() => toggleCollapse(index)}
            index={index}
            onDelete={() => handleDeleteArea(index)}
            updateArea={(value:string, fieldName:string) => updatedAT(index, value, fieldName)}/>
        </div>
      )})}

      <Form {...form} >
      <div className="border p-7 pb-4 pt-4 rounded mt-5">
        <div className="font-bold text-lg mb-2">Acciones Tomadas</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            <FormField
              control={form.control}
              name="acciones_tomadas"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Acciones Tomadas:</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre Completo" {...field} 
                      onChange={(e) => {
                        field.onChange(e); 
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsable_accion"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Responsable acción:</FormLabel>
                  <FormControl>
                    <Input placeholder="Responsable acción" {...field} 
                      onChange={(e) => {
                        field.onChange(e); 
                      }}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="text-end  mt-3">
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white " 
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmitArea)(); 
                  }}
              >
                Agregar
              </Button>
            </div>
      </div>
      </Form>
    </div>
  );
};

export default PersonasInvolucradasList;