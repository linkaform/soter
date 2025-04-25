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
import { useState } from "react";
import { useAccessStore } from "@/store/useAccessStore";
import { toast } from "sonner";

interface Props {
  title: string;
  children: React.ReactNode;
}
const formSchema = z.object({
  tipo: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un tipo.",
  }),

  equipo: z.string().min(2, {
    message: "Campo requerido.",
  }),
  marca: z.string().min(2, {
    message: "Campo requerido.",
  }),
  modelo: z.string().min(2, {
    message: "Campo requerido.",
  }),
  noSerie: z.string().min(2, {
    message: "Campo requerido.",
  }),
  color: z.array(z.string()).nonempty({
    message: "Debe seleccionar al menos un color.",
  }),
});

export const EqipmentPassModal: React.FC<Props> = ({ title, children }) => {



  const [open, setOpen] = useState(false); 


  const {
    newEquipment,

    setNewEquipment,
  } = useAccessStore()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: [],
      equipo: "",
      marca: "",
      modelo: "",
      noSerie: "",
      color: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    addNewEquipment(data)
    form.reset();
    toast.success(
      "Equipo listo para agregar al registro de ingreso."
    );
    setOpen(false);
  }

  const addNewEquipment = (data: z.infer<typeof formSchema>) => {
    setNewEquipment([
      {
        color_articulo: data.tipo?.[0],
        marca_articulo: data.marca,
        modelo_articulo: data.modelo,
        nombre_articulo: data.equipo,
        numero_serie: data.noSerie,
        tipo_equipo: data.tipo?.[0],
      },
      ...newEquipment,
    ])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
        
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Tipo</FormLabel>
                  <Select onValueChange={(value) => field.onChange([value])}>
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
              name="equipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Nombre del Equipo</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto" {...field} />
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
                      <Input placeholder="Texto" {...field} />
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
                      <Input placeholder="Texto" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="noSerie"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>* Número de Serie</FormLabel>
                    <FormControl>
                      <Input placeholder="Texto" {...field} />
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
                    <Select onValueChange={(value) => field.onChange([value])}>
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

            <p className="text-gray-400">**Campos requeridos </p>

            <div className="flex gap-5">
              <DialogClose asChild>
                <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                  Cancelar
                </Button>
              </DialogClose>

              <Button
                type="submit"
                className="w-full  bg-blue-500 hover:bg-blue-600 text-white "
              >
                Agregar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};