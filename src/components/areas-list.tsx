import React, { useEffect, useState } from "react";
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
import { Vehiculo } from "@/lib/update-pass";
import AreasItem from "./areas-item";
import { useCatalogoPaseArea } from "@/hooks/useCatalogoPaseArea";
import { Areas } from "@/hooks/useCreateAccessPass";


interface AreasListProps {
    location:string;
    areas: Areas[];
    setAreas: (area: Areas[])=> void
    catAreas:string[]
    loadingCatAreas: boolean
  }

  export const formSchema = 
    z.object({
      nombre_area: z.string().min(1,{message:"Área es un campo obligatorio"}),
      comentario_area: z.string().optional(),
    });

const AreasList:React.FC<AreasListProps> = ({ location, areas, setAreas, catAreas, loadingCatAreas})=> {
    const {data:cat, isLoading: loadingCat, refetch } = useCatalogoPaseArea(location)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { nombre_area: "", comentario_area: "",}});

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
        comentario_area: data.comentario_area||"",  
      };
      setAreas([...areas, newArea]);
      cleanInputs()
    };

    const handleDeleteArea = (index: number) => {
        setAreas((prevState) => prevState.filter((_, i) => i !== index)); // Elimina el vehículo en el índice especificado
      };

    const [collapsedIndex, setCollapsedIndex] = useState<number | null>(null);

    const toggleCollapse = (index: number) => {
      if (collapsedIndex === index) {
        setCollapsedIndex(null);  
      } else {
        setCollapsedIndex(index);
      }
    };

    useEffect(() => {
        if(location!==""){
            refetch()
        }
    }, []);

    useEffect(() => {
        if(catAreas){
            setAreas([])
        }
    }, [catAreas]);

    const cleanInputs =() =>{
        form.setValue('nombre_area', '');
        form.setValue('comentario_area', '');
    }

    const updatedArea = (index: number, value: string, fieldName:string) => {
        const updatedAreas = [...areas];
          updatedAreas[index] = {
            ...updatedAreas[index],   // Mantener las propiedades anteriores del área
            [fieldName]: value,       // Actualizar el campo específico
          };
        setAreas(updatedAreas);

        if (fieldName === "nombre_area" && areas.some(area => area.nombre_area === value)) {
            setAreas((prevState) => prevState.filter((area, i) => area.nombre_area !== value));
        }
    };

    useEffect(()=>{
        console.log("ENTRADA", areas, )
    },[areas])

  return (
    <div >
      {areas.map((area, index) => (
        <div key={index} className="border rounded mt-2">
          <AreasItem
            area={area}
            isCollapsed={collapsedIndex !== index}
            onToggleCollapse={() => toggleCollapse(index)}
            index={index}
            onDelete={() => handleDeleteArea(index)}
            catAreas={catAreas}
            location={location} 
            loadingCatAreas={loadingCatAreas} 
            updateArea={(value:any, fieldName:string) => updatedArea(index, value, fieldName)}/>
        </div>
      ))}

      <Form {...form} >
      {/* <form className="space-y-5 border p-8 rounded mt-5" onSubmit={form.handleSubmit(onSubmit)}> */}
      <div className="border p-8 rounded mt-5">
        <div className="font-bold text-lg">Agregar Area</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            {/* Nombre Area */}
            <FormField
              control={form.control}
              name="nombre_area"
              render={({ field }) => (
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
                        <SelectValue placeholder="Selecciona una ubicación" />
                        </>
                      )}
                      </SelectTrigger>
                      <SelectContent>
                      {catAreas?.map((area:string, index:number) => {
                      return(
                        <SelectItem key={index} value={area}>
                          {area}
                        </SelectItem>
                      )})}
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
              name="comentario_area"
              render={({ field }) => (
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