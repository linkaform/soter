/* eslint-disable react-hooks/exhaustive-deps */
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import AreasItem from "./areas-item";
import { Areas } from "@/hooks/useCreateAccessPass";

interface AreasListProps {
    areas: Areas[];
    setAreas: Dispatch<SetStateAction<Areas[]>>
    catAreas:string[]
    loadingCatAreas: boolean
    existingAreas:boolean
}

const formSchema = 
    z.object({
      nombre_area: z.string().min(1,{message:"Área es un campo obligatorio"}),
      commentario_area: z.string().optional(),
});

const AreasList:React.FC<AreasListProps> = ({ areas, setAreas, catAreas, loadingCatAreas, existingAreas})=> {
    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { nombre_area: "", commentario_area: "",}});

    const onSubmitArea = (data: z.infer<typeof formSchema>) => {
        const isAreaExists = areas.some(area => area.nombre_area === data.nombre_area);
        if (isAreaExists) {
            form.setError("nombre_area", {
            type: "manual",
            message: "Esta área ya fué agregada, edita o elimina el area.",
            });
            return; 
        }

      const newArea = {
        nombre_area:data.nombre_area ||"",  
        commentario_area: data.commentario_area||"",  
      };
      setAreas([...areas, newArea]);
      cleanInputs()
    };

    const handleDeleteArea = (index: number) => {
        setAreas((prevState) => prevState.filter((_, i) => i !== index)); // Elimina el vehículo en el índice especificado
      };


    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };

    useEffect(() => {
        if(catAreas && existingAreas == false){
            setAreas([])
        }
    }, [catAreas,existingAreas]);
    
    const cleanInputs =() =>{
        form.setValue('nombre_area', '');
        form.setValue('commentario_area', '');
    }

    const updatedArea = (index: number, value: string, fieldName:string) => {
        const updatedAreas = [...areas];
          updatedAreas[index] = {
            ...updatedAreas[index],
            [fieldName]: value,  
          };
        setAreas(updatedAreas);

        if (fieldName === "nombre_area" && areas.some(area => area.nombre_area === value)) {
            setAreas((prevState) => prevState.filter((area) => area.nombre_area !== value));
        }
    };

  return (
    <div >
      {areas.map((area, index) => 
      { 
      console.log("areas", area)

        return(
        <div key={index} className="border rounded mt-2">
          <AreasItem
            areaRaw={area}
            isCollapsed={collapsedIndex !== index}
            onToggleCollapse={() => toggleCollapse(index)}
            index={index}
            onDelete={() => handleDeleteArea(index)}
            catAreas={catAreas}
            loadingCatAreas={loadingCatAreas} 
            updateArea={(value:string, fieldName:string) => updatedArea(index, value, fieldName)}/>
        </div>
      )})}

      <Form {...form} >
      <div className="border p-7 pb-4 pt-4 rounded mt-5">
        <div className="font-bold text-lg mb-2">Agregar Area</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            <FormField
              control={form.control}
              name="nombre_area"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Área:</FormLabel>
                  <FormControl>
                    <Select {...field} className="input"
                        onValueChange={(value:string) => {
                        field.onChange(value); 
                      }}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                      {loadingCatAreas?(
                        <>
                        <SelectValue placeholder="Cargando áreas..." />
                        </>
                      ): (
                        <>
                        { catAreas?.length > 0 ? 
                        <SelectValue placeholder="Selecciona una área" />:
                        <SelectValue placeholder="Selecciona un ubicación para ver las opciones" />}
                        </>
                      )}
                      </SelectTrigger>
                      <SelectContent>
                      {catAreas?.length >0 ? (
                        <>
                          {catAreas?.map((area:string, index:number) => {
                          return(
                            <SelectItem key={index} value={area}>
                              {area}
                            </SelectItem>
                          )})} 
                        </>
                      ):<SelectItem key={"1"} value={"1"} disabled>No hay opciones disponibles.</SelectItem>}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comentario */}
            <FormField
              control={form.control}
              name="commentario_area"
              render={({ field }:any) => (
                <FormItem>
                  <FormLabel>Comentario:</FormLabel>
                  <FormControl>
                    <Input placeholder="Comentario" {...field} 
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
                Agregar Area
              </Button>
            </div>
      </div>
            
      {/* </form> */}
      </Form>
          
    </div>
  );
};

export default AreasList;