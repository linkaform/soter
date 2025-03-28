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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PersonasInvolucradas } from "@/lib/incidencias";
import PersonasInvolucradasItem from "./personas-involucradas-item";


interface PersonasInvolucradasListProps {
    personasInvolucradas: PersonasInvolucradas[];
    setPersonasInvolucradas: Dispatch<SetStateAction<PersonasInvolucradas[]>>
}

const formSchema = 
    z.object({
        nombre_completo: z.string().min(1,{message:"Área es un campo obligatorio"}),
        tipo_persona: z.string().optional(),
});

const PersonasInvolucradasList:React.FC<PersonasInvolucradasListProps> = ({ personasInvolucradas, setPersonasInvolucradas})=> {
  console.log("QUE PASA INVOLUIC",personasInvolucradas)
    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { nombre_completo: "", tipo_persona: "",}});

    const onSubmitArea = (data: z.infer<typeof formSchema>) => {
        const isAreaExists = personasInvolucradas.some(area => area.nombre_completo === data.nombre_completo);
        if (isAreaExists) {
            form.setError("nombre_completo", {
            type: "manual",
            message: "Esta área ya fué agregada, edita o elimina el area.",
            });
            return; 
        }

      const newPI = {
        nombre_completo:data.nombre_completo ||"",  
        tipo_persona: data.tipo_persona||"",  
      };
      setPersonasInvolucradas([...personasInvolucradas, newPI]);
      cleanInputs()
    };

    const handleDeleteArea = (index: number) => {
        setPersonasInvolucradas((prevState) => prevState.filter((_, i) => i !== index)); 
      };


    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };
    
    const cleanInputs =() =>{
        form.setValue('nombre_completo', '');
        form.setValue('tipo_persona', '');
    }

    const updatedArea = (index: number, value: string, fieldName:string) => {
        const updatedAreas = [...personasInvolucradas];
          updatedAreas[index] = {
            ...updatedAreas[index],  
            [fieldName]: value, 
          };
        setPersonasInvolucradas(updatedAreas);

        if (fieldName === "nombre_completo" && personasInvolucradas.some(area => area.nombre_completo === value)) {
            setPersonasInvolucradas((prevState) => prevState.filter((area) => area.nombre_completo !== value));
        }
    };

    return (
    <div >
      {personasInvolucradas.map((area, index) => 
      { 
        console.log("personasInvolucradas", area)

        return(
        <div key={index} className="border rounded mt-2">
          <PersonasInvolucradasItem
            PIRaw={area}
            isCollapsed={collapsedIndex !== index}
            onToggleCollapse={() => toggleCollapse(index)}
            index={index}
            onDelete={() => handleDeleteArea(index)}
            updateArea={(value:string, fieldName:string) => updatedArea(index, value, fieldName)}/>
        </div>
      )})}

      <Form {...form} >
      <div className="border p-7 pb-4 pt-4 rounded mt-5">
        <div className="font-bold text-lg mb-2">Personas Involucradas</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            <FormField
              control={form.control}
              name="nombre_completo"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Nombre Completo:</FormLabel>
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
              name="tipo_persona"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Tipo de persona:</FormLabel>
                  <FormControl>
                    <Select {...field} className="input"
                        onValueChange={(value:string) => {
                        field.onChange(value); 
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key={"Testigo"} value={"testigo"}>
                          Testigo
                        </SelectItem>
                        <SelectItem key={"fectado"} value={"afectado"}>
                          Afectado
                        </SelectItem>
                      </SelectContent>
                    </Select>
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