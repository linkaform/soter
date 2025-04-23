/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import Image from "next/image";

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
import { Camera, IdCard, Trash } from "lucide-react";
import { useState } from "react";

import { useSearchPass } from "@/hooks/useSearchPass";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useShiftStore } from "@/store/useShiftStore";

import { Loader2 } from "lucide-react";
import { Imagen } from "@/lib/update-pass-full";

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
  foto: z
    .array(
      z.object({
        file_name: z.string(),
        file_url: z.string(),
      })
    )
    .optional(),
  identificacion: z
    .array(
      z.object({
        file_name: z.string(),
        file_url: z.string(),
      })
    )
    .optional(),
  area: z.string().min(1, {
    message: "Campo requerido",
  }),
  visita_a: z.string().min(1, {
    message: "Campo requerido",
  }),
  perfil_pase: z.string().min(1, {
    message: "Campo requerido",
  }),
});

export const AddVisitModal: React.FC<Props> = ({ title, children }) => {
  const { location } = useShiftStore();
  const [openModal, setOpenModal] = useState(false);

const [fotoSubida, setFotoSubida] = useState<Imagen | null>(null);
const [identificacionSubida, setIdentificacionSubida] = useState<Imagen | null>(null);

  const { assets, registerNewVisit } = useSearchPass(openModal);

  const { uploadImageMutation, response } = useUploadImage();

  const {
    uploadImageMutation: uploadIdentificacion,
    response: identificacion,
    isLoading: isLoadingId,
  } = useUploadImage();

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
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    const access_pass = {
      nombre: data.nombre,
      empresa: data.empresa,
      visita_a: data.visita_a,
      perfil_pase: data.perfil_pase,
      foto: response,
      identificacion: identificacion,
    };

    registerNewVisit.mutate({ location, access_pass });
  }

 const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadImageMutation.mutate(
      { img: file },
      {
        onSuccess: (data) => {
          setFotoSubida(data); // 💾 guardamos data procesada
        },
      }
    );
  }
};
const handleFileUploadId = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    uploadIdentificacion.mutate(
      { img: file },
      {
        onSuccess: (data) => {
          setIdentificacionSubida(data); // 💾 guardamos data procesada
        },
      }
    );
  }
};




  const handleDeleteFoto = () => {
    setFotoSubida(null);

  };

  const handleDeleteIdentificacion = () => {
    setIdentificacionSubida(null);
  };

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

            <div className="flex justify-between items-center">
              <p>Agregar foto</p>
              <label
                htmlFor="fileUploadFoto"
                className="cursor-pointer flex items-center gap-2"
              >
                <Camera />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="fileUploadFoto"
              />
            </div>

            {uploadImageMutation.isPending && (
              <div className="flex justify-center items-center">
                <p>Subiendo imagen...</p>
                <Loader2 className="animate-spin" />
              </div>
            )}

            {fotoSubida?.file_url && (
              <div className="flex flex-col items-center my-4 relative">
                <button
                  onClick={handleDeleteFoto}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  type="button"
                >
                  <Trash size={18} />
                </button>
                <p className="my-3">{fotoSubida.file_name}</p>
                <Image
                  src={fotoSubida.file_url}
                  alt="Imagen subida"
                  width={75}
                  height={75}
                  className="object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex justify-between items-center">
              <p>Agregar identificación</p>
              <label
                htmlFor="fileUploadId"
                className="cursor-pointer flex items-center gap-2"
              >
                <IdCard />
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUploadId}
                className="hidden"
                id="fileUploadId"
              />
            </div>

            {isLoadingId && (
              <div className="flex justify-center items-center">
                <p>Subiendo imagen...</p>
                <Loader2 className="animate-spin" />
              </div>
            )}

            {identificacionSubida?.file_url && (
              <div className="flex flex-col items-center my-4 relative">
                <button
                  onClick={handleDeleteIdentificacion}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                  type="button"
                >
                  <Trash size={18} />
                </button>
                <p className="my-3">{identificacionSubida.file_name}</p>
                <Image
                  src={identificacionSubida.file_url}
                  alt="Imagen subida"
                  width={75}
                  height={75}
                  className="object-cover rounded-md"
                />
              </div>
            )}

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
            <FormField
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
            />
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
