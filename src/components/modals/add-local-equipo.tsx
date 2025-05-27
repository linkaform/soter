/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { Input } from "../ui/input";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { catalogoColores, catalogoTipoEquipos } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";
import { Equipo } from "@/lib/update-pass-full";
import { useAccessStore } from "@/store/useAccessStore";
import { useUpdateBitacora } from "@/hooks/useUpdateBitacora";

interface Props {
  title: string;
  children: React.ReactNode;
  equipos: Equipo[]
  setEquipos: Dispatch<SetStateAction<Equipo[]>>;
  isAccesos: boolean
  id?:string
}

const formSchema = z.object({
  tipo:z.string().min(2, {
    message: "Campo requerido.",
  }),

  nombre: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  serie: z.string().optional(),
  color: z.string().optional()
});

export const EqipmentLocalPassModal: React.FC<Props> = ({ title, children , equipos, setEquipos, isAccesos, id=""}) => {
  const [open, setOpen] = useState(false); 
  const setSelectedEquipos = useAccessStore((state) => state.setSelectedEquipos);
  const selectedEquipos = useAccessStore((state) => state.selectedEquipos);
  const { updateBitacoraMutation, isLoading }= useUpdateBitacora()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: "",
      nombre: "",
      marca: "",
      modelo: "",
      serie: "",
      color: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    addNewEquipment(data)
    form.reset();
    toast.success(
      "Equipo agregado correctamente."
    );
    setOpen(false);
  }

  const addNewEquipment = (data: z.infer<typeof formSchema>) => {
    if( isAccesos ){
      setSelectedEquipos([...selectedEquipos,  {
        color: data.color||"",
        marca: data.marca ||"",
        modelo: data.modelo||"",
        nombre: data.nombre||"",
        serie: data.serie||"",
        tipo: data.tipo||"",
      },]);
      setEquipos([
        {
          color: data.color||"",
          marca: data.marca ||"",
          modelo: data.modelo||"",
          nombre: data.nombre||"",
          serie: data.serie||"",
          tipo: data.tipo||"",
        },
        ...equipos,
      ])
    }else{
      updateBitacoraMutation.mutate({
        equipo: {
          nombre: data.color ||"",
          modelo:  data.modelo || "",
          marca: data.marca || "",
          color: data.color || "",
          tipo: data.tipo || "",
          serie: data?.serie|| "",
        },
        id: id,
      }, )

      // setEquipos([
      //   {
      //     color: data.color||"",
      //     marca: data.marca ||"",
      //     modelo: data.modelo||"",
      //     nombre: data.nombre||"",
      //     serie: data.serie||"",
      //     tipo: data.tipo||"",
      //   },
      //   ...equipos,
      // ])
    }
    
  }

    useEffect(() => {
        if(!open)
        form.setValue("color", "")
        form.setValue("marca", "")
        form.setValue("modelo", "")
        form.setValue("nombre", "")
        form.setValue("serie", "")
        form.setValue("tipo", "")
        
    }, [open]);



  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
        
      </DialogTrigger>

      <DialogContent className="max-w-xl  overflow-y-auto max-h-[90vh] flex flex-col" aria-describedby="">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl text-center font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Tipo</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {catalogoTipoEquipos().map((equipo) => (
                        <SelectItem key={equipo} value={equipo}>
                          {equipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> 
               
                  <FormMessage /> 
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del equipo"  maxLength={20} {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-x-4 gap-y-8">
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Marca" maxLength={20} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Modelo" maxLength={20} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Número de Serie</FormLabel>
                    <FormControl>
                    <Input
                      placeholder="No. de serie"
                      {...field}
                      maxLength={20}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Color</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catalogoColores().map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
          </form>
        </Form>
        </div>

        <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
                disabled={isLoading}
              >
               {isLoading? "Cargando...": "Agregar"} 
              </Button>
            </div>

      </DialogContent>
    </Dialog>
  );
};