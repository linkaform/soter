/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useEffect, useState } from "react";

import { useSearchPass } from "@/hooks/useSearchPass";
import { useShiftStore } from "@/store/useShiftStore";

// import { Loader2 } from "lucide-react";
import { Imagen } from "@/lib/update-pass-full";
import LoadImage from "../upload-Image";

interface Props {
  title: string;
  children: React.ReactNode;
}
const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "Campo requerido",
  }),
  empresa: z.string().min(2, {
    message: "Campo requerido",
  }),
  foto: z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
  identificacion:  z.array(
	  z.object({
		file_url: z.string(),
		file_name: z.string(),
	  })
	).optional(),
  area: z.string().optional(),
  visita_a: z.string().min(1, {
    message: "Campo requerido",
  }),
  perfil_pase: z.string().min(1, {
    message: "Campo requerido",
  }),
  status_pase: z.string().optional()
});

export const AddVisitModal: React.FC<Props> = ({ title, children }) => {
  const { location } = useShiftStore();
  const [openModal, setOpenModal] = useState(false);
  const [fotografia, setFotografia] = useState<Imagen[]>([]);
  const [identificacion, setIdentificacion] = useState<Imagen[]>([]);

  const { assets, registerNewVisit } = useSearchPass(openModal);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      empresa: "",
      foto: [],
      identificacion: [],
      area: "",
      visita_a: "",
      perfil_pase: "",
      status_pase:"activo"
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
      const access_pass = {
        nombre: data.nombre,
        empresa: data.empresa,
        // area:"",
        visita_a: data.visita_a,
        perfil_pase: data.perfil_pase,
        foto: fotografia ,
        identificacion: identificacion,
        status_pase:"activo"
      };
      console.log("entrada", access_pass)
      registerNewVisit.mutate({ location, access_pass });
  }

  useEffect(()=>{
    console.log("errores", form.formState.errors)
  },[form.formState.errors])

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="max-w-xl max-h-[90vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-2xl	 text-center  font-bold my-5">
            {title}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

                <LoadImage
								id="fotografia" 
								titulo={"Fotografía"} 
								setImg={setFotografia}
								showWebcamOption={true}
								facingMode="environment"
								imgArray={fotografia}
								showArray={false}
								limit={10}/>

                <LoadImage
								id="identificacion" 
								titulo={"Identificación"} 
								setImg={setIdentificacion}
								showWebcamOption={true}
								facingMode="environment"
								imgArray={identificacion}
								showArray={false}
								limit={10}/>

            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Texto" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Departamento</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets?.Areas.map((departamento: string) => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="visita_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Visita a</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets?.Visita_a?.map((item: string) => (
                        <SelectItem key={item} value={item}>
                          {item}
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
              name="perfil_pase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>* Tipo de Visita</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assets?.Perfiles?.map((item: string) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-gray-400">**Campos requeridos </p>
            <div className="flex gap-5">
              <DialogClose asChild>
                <Button
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                  onClick={() => form.reset()}
                >
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
