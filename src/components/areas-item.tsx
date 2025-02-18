/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Areas } from "@/hooks/useCreateAccessPass";

export const formSchema = 
      z.object({
        nombre_area: z.string().optional(),
        comentario_area: z.string().optional(),
      })

  interface AreasItemProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    index: number;
    onDelete: () => void;

    areaRaw: Areas;
    location:string;
    loadingCatAreas:boolean;
    catAreas:string[];
    updateArea: (value: string, fieldName:string ) => void;
  }

  const AreasItem: React.FC<AreasItemProps> = ({isCollapsed, onToggleCollapse, onDelete , 
    catAreas, loadingCatAreas, areaRaw, updateArea
  })=>  {
      const area = formatArea(areaRaw)
      const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { nombre_area: "", comentario_area: "" }
    });

    useEffect(() => {
      if(area){
        loadNewArea(area)
      }
    }, [area])

    interface AreaConNoteBooth {
      note_booth?: string;
      commentario_area?: string;
    }

    function formatArea(a:Areas | AreaConNoteBooth){
      if ('nombre_area' in a) {
        return a
      } else if ('note_booth' in a) {
        return {nombre_area: a.note_booth||"", comentario_area: a.commentario_area||""}
      }
    }
    function loadNewArea(item:Areas){
      form.setValue('nombre_area', item?.nombre_area||"")
      form.setValue('comentario_area', item?.comentario_area||"")
    }
    
    const handleInputChange = (value:string, fieldName: string) => {
      if (value === "") {
        if (fieldName === "nombre_area") {
          onDelete(); // Elimina el area si está vacío
        }
      }
      updateArea(value, fieldName);
    };

  return (
    <div className="p-8 mb-4">
      <div className="flex justify-between">
        {isCollapsed ? (<>
        <h3 className="font-bold text-lg mb-3 w-80 truncate">{area?.nombre_area}</h3>
        </>) : (<>
          <h3 className="font-bold text-lg mb-3 w-96 truncate">Datos del Área: {area?.nombre_area}</h3>
        </>)}
        <div className="flex justify-between gap-5">
          <button onClick={onToggleCollapse} className="text-blue-500">
            {isCollapsed ? 'Abrir' : 'Cerrar'}
          </button>
          
          <button onClick={onDelete} className="text-blue-500">
              {isCollapsed ? 'Eliminar' : 'Eliminar'}
          </button>
        </div>
        
      </div>
        <Form {...form}> 
          <form className="space-y-5">
          {!isCollapsed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
                {/* Nombre Area */}
                <FormField
                  control={form.control}
                  name="nombre_area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área:</FormLabel>
                      <FormControl>
                          <Select {...field} 
                              onValueChange={(value:string) => {
                              field.onChange(value); 
                              handleInputChange(value, "nombre_area")
                            }}
                            value={field.value}
                          >
                          <SelectTrigger className="w-full">
                          {loadingCatAreas?(
                            <>
                            <SelectValue placeholder="Cargando tipos de vehiculo..." />
                            </>
                          ): (
                            <>
                            <SelectValue placeholder="Selecciona un tipo de vehiculo" />
                            </>
                          )}
                          </SelectTrigger>
                          <SelectContent>
                          {catAreas?.map((area:string, index:number) => (
                            <SelectItem key={index} value={area}>
                              {area}
                            </SelectItem>
                          ))}
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
                            field.onChange(e); // Actualiza el valor en react-hook-form
                            handleInputChange(e.target.value, "comentario_area")
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>
          )}
          </form> 
         </Form>
      </div>
  );
};

export default AreasItem;